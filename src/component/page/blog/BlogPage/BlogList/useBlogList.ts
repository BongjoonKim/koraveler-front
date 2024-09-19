import {BlogHomeProps} from "./BlogList";
import {useCallback, useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import recoil from "../../../../../stores/recoil";
import {getAllDocuments, getDocumentsByAuth} from "../../../../../endpoints/blog-endpoints";
import {useLocation, useMatch} from "react-router-dom";
import {BLOG_PAGE_TYPE} from "../../../../../constants/constants";
import {useAuth} from "../../../../../appConfig/AuthContext";
import {endpointUtils} from "../../../../../utils/endpointUtils";

function useBlogList(props : BlogHomeProps) {
  const [blogList, setBlogList] = useState<DocumentsInfo>();
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(24);
  const match = useMatch("/blog/:type");
  const {accessToken, setAccessToken} = useAuth();
  
  console.log("keyof typeof BLOG_PAGE_TYPE",  match, BLOG_PAGE_TYPE.BOOKMARK)
  
  
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  
  // 블로그 글 목록 조회
  const getDocuments = useCallback(async () => {
    try {
      if (!match?.params?.type || match?.params?.type === BLOG_PAGE_TYPE.HOME) {
        const res = await getAllDocuments({
          params : {
            page : page,
            size : size
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
            type : BLOG_PAGE_TYPE.MY_BLOG
          },
          accessToken : accessToken,
          setAccessToken : setAccessToken
        })
        console.log("res", res)
      } else if (match?.params?.type === BLOG_PAGE_TYPE.BOOKMARK) {
        
        const res = await endpointUtils.authAxios({
          func : getDocumentsByAuth,
          params : {
            page : page,
            size : size,
            type : BLOG_PAGE_TYPE.BOOKMARK
          },
          accessToken : accessToken,
          setAccessToken : setAccessToken
        })
        console.log("res", res)
        setBlogList(res.data)
  
      }

    } catch (e) {
      setErrorMsg({
        status : "error",
        msg : e?.toString()
      })
    }
  }, [page, size, blogList, errorMsg, match]);
  
  useEffect(() => {
    getDocuments();
  }, []);
  
  return {
    blogList
  }
}

export default useBlogList;