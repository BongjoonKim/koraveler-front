export const BLOG_PAGE_TYPE = {
  HOME : "home",
  MY_BLOG : "my-blog",
  BOOKMARK : "bookmark",
  DRAFT: "draft"
}

export enum BLOG_SAVE_TYPE {
  SAVE = "save",
  DRAFT = "draft",
}

export type BlogPageTypeType = typeof BLOG_PAGE_TYPE[keyof typeof BLOG_PAGE_TYPE];

export enum BLOG_LIST_SORTS {
  OLD = "Old",
  LATEST = "Latest",
}

export const BLOG_LIST_SORTS_OPTIONS = [
  {
    label : "Old",
    value : BLOG_LIST_SORTS.OLD
  },
  {
    label : "Latest",
    value : BLOG_LIST_SORTS.LATEST
  }
]

export type BlogListSortsOptionsType = {
  label : string,
  value : BLOG_LIST_SORTS
}

export type BlogListSortsType =  typeof BLOG_LIST_SORTS[keyof typeof BLOG_LIST_SORTS];
