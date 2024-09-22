import {BlogHomeProps} from "./BlogList";
import {useCallback, useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import recoil from "../../../../../stores/recoil";
import {getAllDocuments, getDocumentsByAuth} from "../../../../../endpoints/blog-endpoints";
import {useLocation, useMatch} from "react-router-dom";
import {BLOG_LIST_SORTS, BLOG_PAGE_TYPE} from "../../../../../constants/constants";
import {useAuth} from "../../../../../appConfig/AuthContext";
import {endpointUtils} from "../../../../../utils/endpointUtils";
import {useAtom, useAtomValue} from "jotai/index";
import {selBlogSortOpt} from "../../../../../stores/jotai/jotai";

function useBlogList(props : BlogHomeProps) {
  const [blogList, setBlogList] = useState<DocumentsInfo>();
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(24);
  const match = useMatch("/blog/:type");
  const {accessToken, setAccessToken} = useAuth();
  const selectedOption = useAtomValue(selBlogSortOpt);
  
  
  console.log("keyof typeof BLOG_PAGE_TYPE",  match, BLOG_PAGE_TYPE.BOOKMARK)
  
  
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  
  // 블로그 글 목록 조회
  const getDocuments = useCallback(async () => {
    try {
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
        setBlogList(res.data);
      } else if (match?.params?.type === BLOG_PAGE_TYPE.MY_BLOG) {
        const res = await endpointUtils.authAxios({
          func : getDocumentsByAuth,
          params : {
            page : page,
            size : size,
            type : BLOG_PAGE_TYPE.MY_BLOG,
            dateSort : dateSort
          },
          accessToken : accessToken,
          setAccessToken : setAccessToken
        })
        if (res.status !== 200) {
          throw res.statusText;
        }
        setBlogList(res.data);
      } else if (match?.params?.type === BLOG_PAGE_TYPE.BOOKMARK) {
        
        const res = await endpointUtils.authAxios({
          func : getDocumentsByAuth,
          params : {
            page : page,
            size : size,
            type : BLOG_PAGE_TYPE.BOOKMARK,
            dateSort : dateSort,
          },
          accessToken : accessToken,
          setAccessToken : setAccessToken
        })
        if (res.status !== 200) {
          throw res.statusText;
        }
        setBlogList(res.data)
      } else if (match?.params?.type === BLOG_PAGE_TYPE.DRAFT) {
        const res = await endpointUtils.authAxios({
          func : getDocumentsByAuth,
          params : {
            page : page,
            size : size,
            type : BLOG_PAGE_TYPE.DRAFT,
            dateSort : dateSort,
          },
          accessToken : accessToken,
          setAccessToken : setAccessToken
        })
        if (res.status !== 200) {
          throw res.statusText;
        }
        setBlogList(res.data)
      }

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