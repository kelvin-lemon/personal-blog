"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DivideReg = /autoGroup([+-])(\d*)/;
const toDefaultCase = (str) => str;
const toLowerCase = (str) => str.toLowerCase();
const toUpperCase = (str) => str.toUpperCase();
const toCapitalize = ([first, ...rest]) => first.toUpperCase() + rest.join('');
const toCamelCase = (str) => {
    const s = str &&
        str
            .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
            .map((x) => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
            .join('');
    return s.slice(0, 1).toLowerCase() + s.slice(1);
};
const toKebabCase = (str) => str &&
    str
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map((x) => x.toLowerCase())
        .join('-');
const toTitleCase = (str) => str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
    .join(' ');
const builtInTitleRules = {
    default: toDefaultCase,
    lowercase: toLowerCase,
    uppercase: toUpperCase,
    capitalize: toCapitalize,
    camelcase: toCamelCase,
    kebabcase: toKebabCase,
    titlecase: toTitleCase
};
const formatTitle = (title = '', titleOptions) => {
    const { mode, map } = titleOptions;
    if (map[title]) {
        return map[title];
    }
    const endTitle = title.split('/').slice(-2, -1).toString();
    if (!mode) {
        return builtInTitleRules.default(endTitle);
    }
    return builtInTitleRules[mode.toLowerCase()](endTitle);
};
const divideMoreGroups = (pagesGroup) => pagesGroup.reduce((acc, page, index) => {
    const autoGroupName = page.frontmatter.autoGroup;
    const groupSort = page.frontmatter.groupSort;
    const filename = page.filename === 'README' ? '' : page.filename;
    console.log(1111, groupSort, autoGroupName);
    if (!autoGroupName) {
        acc.default.push(filename);
    }
    else if (groupSort) {
        if (groupSort >= 0) {
            const findGroup = acc.above.find(a => a.groupName === autoGroupName);
            if (findGroup) {
                findGroup.children.push(filename);
            }
            else {
                acc.above.push({
                    groupName: autoGroupName,
                    sort: Number(groupSort),
                    children: [filename]
                });
            }
        }
        else {
            const findGroup = acc.below.find(a => a.groupName === autoGroupName);
            if (findGroup) {
                findGroup.children.push(filename);
            }
            else {
                acc.below.push({
                    groupName: autoGroupName,
                    sort: Number(groupSort),
                    children: [filename]
                });
            }
        }
    }
    if (index === pagesGroup.length - 1) {
        acc.above.sort((a, b) => a.sort - b.sort >= 0 ? -1 : 1);
        acc.below.sort((a, b) => a.sort - b.sort >= 0 ? 1 : -1);
    }
    return acc;
}, {
    above: [],
    default: [],
    below: []
});
const genGroup = (title, children = [''], collapsable = false, sidebarDepth = 1) => ({
    title,
    collapsable,
    sidebarDepth,
    children
});
exports.genSidebar = (sortedGroupPages, options) => Object.keys(sortedGroupPages)
    .reduce((acc, group) => {
    var _a, _b;
    const title = formatTitle(group, options.title);
    const { above, default: defaultGroup, below } = divideMoreGroups(sortedGroupPages[group]);
    const collapsable = ((_a = options.collapse.collapseList) === null || _a === void 0 ? void 0 : _a.find(co => co === group)) ? true
        : ((_b = options.collapse.uncollapseList) === null || _b === void 0 ? void 0 : _b.find(co => co === group)) ? false
            : options.collapse.open;
    acc[group] = [
        ...above.map(a => genGroup(a.groupName, a.children, collapsable, options.sidebarDepth)),
        genGroup(title, defaultGroup, collapsable, options.sidebarDepth),
        ...below.map(b => genGroup(b.groupName, b.children, collapsable, options.sidebarDepth))
    ];
    return acc;
}, {});
