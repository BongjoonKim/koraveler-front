import {BLOG_PAGE_TYPE} from "../../../../../constants/constants";
import {CommentDTO} from "./CommentDTO";

declare interface PaginationDTO {
  page ?: number;
  size ?: number;
  folderId ?: string;
  PageType ?: keyof typeof BLOG_PAGE_TYPE;
  dateSort ?: string;
}

export interface CommentPageDTO {
  comments: CommentDTO[];
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
}