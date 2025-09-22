import {BlogTitleProps} from "./BlogTitle";
import {useMatch} from "react-router-dom";
import {SyntheticEvent, useEffect, useState} from "react";
import {
  BLOG_LIST_SORTS,
  BLOG_LIST_SORTS_OPTIONS,
  BLOG_PAGE_TYPE,
  BlogListSortsOptionsType,
  BlogPageTypeType
} from "../../../../../constants/constants";
import {upperCase} from "lodash";
import {useAtom} from "jotai";
import {selBlogSortOpt} from "../../../../../stores/jotai/jotai";


export default function useBlogTitle(props: BlogTitleProps) {
  const match = useMatch("/blog/:type");
  const [blogTitles, setBlogTitles] = useState<string[]>(Object.values(BLOG_PAGE_TYPE));
  const [curPageTitle, setCurPageTitle] = useState<BlogPageTypeType>(upperCase(BLOG_PAGE_TYPE.HOME));
  const [sortOptions, setSortOptions] = useState<BlogListSortsOptionsType[]>(BLOG_LIST_SORTS_OPTIONS);
  const [selectedOption, setSelectedOption] = useAtom(selBlogSortOpt);
  
  const findCurPageTitle = () => {
    const curPage = blogTitles.find((bt:string) => bt === match?.params?.type);
    if (curPage) {
      setCurPageTitle(upperCase(curPage));
    } else {
      setCurPageTitle(upperCase(BLOG_PAGE_TYPE.HOME));
    }
  }
  
  const changeSort = (value: string) => {
    console.log("Selected value:", value);
    setSelectedOption(value as BLOG_LIST_SORTS);
  }
  
  useEffect(() => {
    findCurPageTitle();
  }, [match])
  
  return {
    curPageTitle,
    sortOptions,
    changeSort,
    selectedOption: selectedOption || BLOG_LIST_SORTS.LATEST  // 여기서도 기본값 보장
  }
}