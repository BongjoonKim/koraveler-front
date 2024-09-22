import {atom} from 'jotai'
import {BLOG_LIST_SORTS, BLOG_LIST_SORTS_OPTIONS, BlogListSortsOptionsType} from "../../constants/constants";

// 로그인한 사용자 정보를 가지고 있음
export const LoginUser = atom<UsersDTO>({});

export const uploadedInfo = atom<any[]>([]);

export const isBookmark = atom<boolean>(false);

export const selBlogSortOpt = atom<string>(BLOG_LIST_SORTS.LATEST)