"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const merge_1 = require("merge");
const colors = require("colors/safe");
const fs_1 = require("fs");
const path_1 = require("path");
const options_1 = require("./config/options");
const nav_1 = require("./utils/nav");
const pages_1 = require("./utils/pages");
const sidebar_1 = require("./utils/sidebar");
const sort_1 = require("./utils/sort");
const AutoSidebarPlugin = (options, ctx) => {
    const MERGE_OPTIONS = merge_1.default.recursive(options_1.AutoSidebarOptionsDefault, options);
    let AUTO_SIDEBAR_DATA = Object.create(null);
    return {
        name: 'auto-sidebar',
        ready() {
            const pages = pages_1.handlePages(ctx);
            const { specifiedSortPages, defaultPages } = pages_1.distinguishSpecifiedSortPages(pages);
            const defaultPagesGroupByMenuPath = pages_1.groupPagesByMenuPath(defaultPages);
            pages_1.handleIgnorePages(defaultPagesGroupByMenuPath, MERGE_OPTIONS.ignore);
            sort_1.pagesSort(defaultPagesGroupByMenuPath, MERGE_OPTIONS.sort);
            sort_1.specifiedPagesSort(defaultPagesGroupByMenuPath, specifiedSortPages);
            const sortedGroupPages = sort_1.pagesGroupSort(defaultPagesGroupByMenuPath);
            AUTO_SIDEBAR_DATA = sidebar_1.genSidebar(sortedGroupPages, MERGE_OPTIONS);
        },
        enhanceAppFiles() {
            return {
                name: 'auto-sidebar-enhance',
                content: `export default ({ siteData, options }) => { siteData.themeConfig.sidebar = ${JSON.stringify(AUTO_SIDEBAR_DATA)} }`
            };
        },
        extendCli(cli) {
            cli
                .command('nav [targetDir]', '生成导航栏（generate nav file）')
                .option('-f, --force', '强制覆盖已存在的 nav 文件（Forcibly overwrite the existing nav file）')
                .action((dir, options) => {
                const nav = nav_1.genNav(AUTO_SIDEBAR_DATA);
                const dest = path_1.join(ctx.sourceDir, '.vuepress/nav.js');
                if (options.force || !fs_1.existsSync(dest)) {
                    fs_1.writeFileSync(dest, `module.exports = ${JSON.stringify(nav, null, 2)};`);
                    console.log(colors.green(`已在 ${dest} 生成 nav 配置文件`));
                }
                else {
                    console.log(colors.red(`${dest} 已存在文件，可使用 vuepress nav ${dir} -f 覆盖配置文件`));
                }
            });
        }
    };
};
module.exports = AutoSidebarPlugin;
