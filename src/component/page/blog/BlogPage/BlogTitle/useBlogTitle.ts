import {BlogTitleProps} from "./BlogTitle";
import {useMatch} from "react-router-dom";
import {useEffect, useState} from "react";
import {BLOG_PAGE_TYPE, BlogPageTypeType} from "../../../../../constants/constants";
import {upperCase} from "lodash";


export default function useBlogTitle(props : BlogTitleProps) {
  const match = useMatch("/blog/:type");
  const [blogTItles, setBlogTitles] = useState<string[]>(Object.keys(BLOG_PAGE_TYPE));
  const [curPageTitle, setCurPageTitle] = useState<BlogPageTypeType>(upperCase(BLOG_PAGE_TYPE.HOME));
  
  // 블로그 페이지 명
  const findCurPageTitle = () => {
    const curPage = blogTItles.find((bt:string) => bt === match?.params?.type);
    if (curPage) {
      setCurPageTitle(upperCase(curPage));
    } else {
      setCurPageTitle(upperCase(BLOG_PAGE_TYPE.HOME));
    }
  }
  
  useEffect(() => {
    findCurPageTitle();
  }, [match])
  
  return {
    curPageTitle
  }
  
}