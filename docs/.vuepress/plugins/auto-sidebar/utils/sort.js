"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require("colors/safe");
const findSpecifiedPageIndex = (defaultPagesGroupByMenuPath, page) => {
    const pageGroup = defaultPagesGroupByMenuPath[page.menuPath];
    if (!pageGroup)
        return -1;
    const { autoPrev, autoNext } = page.frontmatter;
    if (autoPrev) {
        return pageGroup.findIndex(page => page.filename === autoPrev);
    }
    else if (autoNext) {
        return pageGroup.findIndex(page => page.filename === autoNext);
    }
    else {
        return -1;
    }
};
const builtInSortRules = {
    asc: (pageA, pageB) => pageA.filename > pageB.filename ? 1 : -1,
    desc: (pageA, pageB) => pageA.filename > pageB.filename ? -1 : 1
};
exports.readmeFirstSort = (pages) => {
    const index = pages.findIndex(page => page.filename === 'README');
    if (index !== -1) {
        const README = pages.splice(index, 1);
        pages.unshift(...README);
    }
};
exports.pagesSort = (pagesGroup, sortOptions) => Object.values(pagesGroup)
    .forEach(pages => {
    const { mode, fn } = sortOptions;
    if (mode === 'custom') {
        console.log(fn);
        if (!fn) {
            throw Error('未传递自定义排序函数！');
        }
        return pages.sort(fn);
    }
    if (!mode) {
        pages.sort(builtInSortRules.asc);
    }
    else {
        pages.sort(builtInSortRules[mode]);
    }
    if (sortOptions.readmeFirst) {
        exports.readmeFirstSort(pages);
    }
});
exports.specifiedPagesSort = (defaultPagesGroupByMenuPath, specifiedSortPages) => {
    function insertPage(page, targetIndex) {
        const index = page.frontmatter.autoPrev ? targetIndex + 1 : targetIndex;
        defaultPagesGroupByMenuPath[page.menuPath].splice(index, 0, page);
    }
    let sortQueueCache = [];
    while (specifiedSortPages.length) {
        let targetIndex = -1;
        const page = specifiedSortPages.pop();
        if (page) {
            targetIndex = findSpecifiedPageIndex(defaultPagesGroupByMenuPath, page);
            if (targetIndex !== -1) {
                insertPage(page, targetIndex);
                specifiedSortPages.push(...sortQueueCache);
                sortQueueCache = [];
            }
            else {
                sortQueueCache.push(page);
            }
        }
    }
    if (sortQueueCache.length) {
        console.log(colors.red('\nvuepress plugin auto sidebar(精准排序): '), `\n  [${colors.green(sortQueueCache.map(q => `${q.filename}(${q.frontmatter.title})`).join('、'))}] \t共 ${sortQueueCache.length} 个文件指向了不存在的 prev 或 next，它将不会显示在 sidebar 中`);
    }
};
exports.pagesGroupSort = (defaultPagesGroupByMenuPath) => Object.keys(defaultPagesGroupByMenuPath)
    .sort((groupA, groupB) => groupA.length > groupB.length ? -1 : 1)
    .reduce((acc, group) => {
    acc[group] = defaultPagesGroupByMenuPath[group];
    return acc;
}, {});
