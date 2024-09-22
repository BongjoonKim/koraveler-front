import {BlogTitleProps} from "./BlogTitle";
import {useMatch} from "react-router-dom";
import {SyntheticEvent, useEffect, useState} from "react";
import {
  BLOG_LIST_SORTS_OPTIONS,
  BLOG_PAGE_TYPE,
  BlogListSortsOptionsType,
  BlogPageTypeType
} from "../../../../../constants/constants";
import {upperCase} from "lodash";
import {useAtom} from "jotai";
import {selBlogSortOpt} from "../../../../../stores/jotai/jotai";


export default function useBlogTitle(props : BlogTitleProps) {
  const match = useMatch("/blog/:type");
  const [blogTitles, setBlogTitles] = useState<string[]>(Object.values(BLOG_PAGE_TYPE));
  const [curPageTitle, setCurPageTitle] = useState<BlogPageTypeType>(upperCase(BLOG_PAGE_TYPE.HOME));
  const [sortOptions, setSortOptions] = useState<BlogListSortsOptionsType[]>(BLOG_LIST_SORTS_OPTIONS);
  const [selectedOption, setSelectedOption] = useAtom(selBlogSortOpt);
  
  // 블로그 페이지 명
  const findCurPageTitle = () => {
    const curPage = blogTitles.find((bt:string) => bt === match?.params?.type);
    if (curPage) {
      setCurPageTitle(upperCase(curPage));
    } else {
      setCurPageTitle(upperCase(BLOG_PAGE_TYPE.HOME));
    }
  }
  
  const changeSort = (event : any) => {
    console.log("event", event.target.value);
    setSelectedOption(
      event.target.value
    )
  }
  
  useEffect(() => {
    findCurPageTitle();
  }, [match])
  
  return {
    curPageTitle,
    sortOptions,
    changeSort,
    selectedOption
  }
  
}