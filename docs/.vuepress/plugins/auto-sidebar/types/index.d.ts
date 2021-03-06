import { PageFrontmatter } from 'vuepress-types';
export declare type ArraySortFn<T> = (pageA: T, pageB: T) => number;
export declare type ArrayMapFn<T> = (value: T, index: number, array: T[]) => any[];
interface AutoSidebarPageFrontmatter {
    autoPrev?: string;
    autoNext?: string;
    autoGroup?: string;
    groupSort?: number;
    sort?: number;
    autoIgnore?: boolean;
}
export interface AutoSidebarPage {
    relativePath: string;
    menuPath: string;
    frontmatter: PageFrontmatter & AutoSidebarPageFrontmatter;
    date: string;
    filename: string;
}
declare type SIDEBAR_OPTIONS_SORT = 'asc' | 'desc' | 'custom';
declare type SIDEBAR_OPTIONS_TITLE = 'default' | 'lowercase' | 'uppercase' | 'capitalize' | 'camelcase' | 'kebabcase' | 'titlecase';
interface IgnoreOption {
    menu: string;
    regex?: RegExp;
}
export declare type IgnoreOptions = IgnoreOption[];
export interface SortOptions {
    mode?: SIDEBAR_OPTIONS_SORT;
    fn?: ArraySortFn<AutoSidebarPage>;
    readmeFirst: boolean;
}
interface TitleMap {
    [key: string]: string;
}
export interface TitleOptions {
    mode: SIDEBAR_OPTIONS_TITLE;
    map: TitleMap;
}
export interface CollapseOptions {
    open?: boolean;
    collapseList?: string[];
    uncollapseList?: string[];
}
export interface AutoSidebarPluginOptions {
    sort: SortOptions;
    title: TitleOptions;
    sidebarDepth: number;
    collapse: CollapseOptions;
    ignore: IgnoreOptions;
}
export interface GroupPagesResult {
    [key: string]: AutoSidebarPage[];
}
export interface SidebarGroupResult {
    [key: string]: {
        title: string;
        collapsable: boolean;
        sidebarDepth: number;
        children: string[];
    }[];
}
interface Navbar {
    text: string;
    link?: string;
    items?: Navbar[];
}
export declare type NavbarResult = Navbar[];
export interface BuiltInSortRules {
    [key: string]: ArraySortFn<AutoSidebarPage>;
}
export interface BuiltInTitleRules {
    [key: string]: (str: string) => string;
}
export {};
