export const BLOG_PAGE_TYPE = {
  HOME : "home",
  MY_BLOG : "my-blog",
  BOOKMARK : "bookmark"
}

export type BlogPageTypeType = typeof BLOG_PAGE_TYPE[keyof typeof BLOG_PAGE_TYPE];
