import { Context } from 'vuepress-types';
import { AutoSidebarPage, GroupPagesResult, IgnoreOptions } from '../types';
export declare const handlePages: (ctx: Context) => AutoSidebarPage[];
export declare const handleIgnorePages: (groupPages: GroupPagesResult, ignoreOptions: IgnoreOptions) => void;
export declare const distinguishSpecifiedSortPages: (pages: AutoSidebarPage[]) => {
    specifiedSortPages: AutoSidebarPage[];
    defaultPages: AutoSidebarPage[];
};
export declare const groupPagesByMenuPath: (pages: AutoSidebarPage[]) => GroupPagesResult;
