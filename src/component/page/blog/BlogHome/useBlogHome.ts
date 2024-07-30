import {BlogHomeProps} from "./BlogHome";
import {useCallback, useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import recoil from "../../../../stores/recoil";
import {getAllDocuments} from "../../../../endpoints/blog-endpoints";

function useBlogHome(props : BlogHomeProps) {
  const [blogList, setBlogList] = useState<DocumentsInfo>();
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(24);
  
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  
  // 블로그 글 목록 조회
  const getDocuments = useCallback(async () => {
    try {
      
      const res = await getAllDocuments({
        params : {
          page : page,
          size : size
        }
      });
      setBlogList(res.data);
    } catch (e) {
      setErrorMsg({
        status : "error",
        msg : "블로그 글을 가져오지 못했습니다"
      })
    }
  }, [page, size, blogList, errorMsg]);
  
  useEffect(() => {
    getDocuments();
  }, []);
  
  return {
    blogList
  }
}

export default useBlogHome;