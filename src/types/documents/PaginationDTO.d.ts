import {BLOG_PAGE_TYPE} from "../../../../../constants/constants";

declare interface PaginationDTO {
  page ?: number;
  size ?: number;
  folderId ?: string;
  PageType ?: keyof typeof BLOG_PAGE_TYPE;
  dateSort ?: string;
}