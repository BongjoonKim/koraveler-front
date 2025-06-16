import {BlogHomeProps} from "./BlogList";
import {useCallback, useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import recoil from "../../../../../stores/recoil";
import {getAllDocuments, getDocumentsByAuth} from "../../../../../endpoints/blog-endpoints";
import {useLocation, useMatch} from "react-router-dom";
import {BLOG_LIST_SORTS, BLOG_PAGE_TYPE} from "../../../../../constants/constants";
import {useAtom, useAtomValue} from "jotai/index";
import {selBlogSortOpt} from "../../../../../stores/jotai/jotai";
import useAuthEP from "../../../../../utils/useAuthEP";
import {extractTextAdvanced} from "../../../../../utils/commonUtils";

function useBlogList(props : BlogHomeProps) {
  const [blogList, setBlogList] = useState<DocumentsInfo | undefined>();
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(24);
  const match = useMatch("/blog/:type");
  const selectedOption = useAtomValue(selBlogSortOpt);
  const authEP = useAuthEP();
  
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  
  // 블로그 글 목록 조회
  const getDocuments = useCallback(async () => {
    try {
      let blogPosts : DocumentsInfo = {
        totalDocsCnt : 0,
        totalPagesCnt : 0,
        documents : []
      };
      // 소팅 작업
      let dateSort = "DESC";
      if (selectedOption === BLOG_LIST_SORTS.OLD) {
        dateSort = "ASC"
      } else if (selectedOption === BLOG_LIST_SORTS.LATEST) {
        dateSort = "DESC"
      }
      if (!match?.params?.type || match?.params?.type === BLOG_PAGE_TYPE.HOME) {
        const res = await getAllDocuments({
          params : {
            page: page,
            size: size,
            dateSort : dateSort
          }
        });
        if (res?.status !== 200) {
          throw res?.statusText;
        }
        console.log("res.data", res.data)
        blogPosts = res.data;
      } else if (match?.params?.type === BLOG_PAGE_TYPE.MY_BLOG) {
        const res = await authEP({
          func : getDocumentsByAuth,
          params : {
            page : page,
            size : size,
            type : BLOG_PAGE_TYPE.MY_BLOG,
            dateSort : dateSort
          },
        })
        if (res.status !== 200) {
          throw res.statusText;
        }
        blogPosts = res.data
      } else if (match?.params?.type === BLOG_PAGE_TYPE.BOOKMARK) {
        const res = await authEP({
          func : getDocumentsByAuth,
          params : {
            page : page,
            size : size,
            type : BLOG_PAGE_TYPE.BOOKMARK,
            dateSort : dateSort,
          },
        })
        if (res.status !== 200) {
          throw res.statusText;
        }
        blogPosts = res.data;
      } else if (match?.params?.type === BLOG_PAGE_TYPE.DRAFT) {
        const res = await authEP({
          func : getDocumentsByAuth,
          params : {
            page : page,
            size : size,
            type : BLOG_PAGE_TYPE.DRAFT,
            dateSort : dateSort,
          },
        })
        if (res.status !== 200) {
          throw res.statusText;
        }
        blogPosts = res.data;
      }
      console.log("blogPosts", blogPosts)
      if (!blogPosts?.documents) return;
      console.log("여기 오나")
      const updatedBlogPosts = {
        ...blogPosts,
        documents: blogPosts.documents.map(post => ({
          ...post,
          contents: extractTextAdvanced(post?.contents)
        }))
      };
      
      console.log("extractBlogPosts", updatedBlogPosts);
      setBlogList(updatedBlogPosts);
    } catch (e) {
      setErrorMsg({
        status : "error",
        msg : e?.toString()
      })
    }
  }, [page, size, blogList, errorMsg, match, selectedOption]);
  
  useEffect(() => {
    getDocuments();
  }, [match, selectedOption]);
  
  return {
    blogList
  }
}

export default useBlogList;