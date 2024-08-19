import {ViewBlogProps} from "./ViewBlog";
import {useParams} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import {getDocument} from "../../../../endpoints/blog-endpoints";
import {useRecoilState} from "recoil";
import recoil from "../../../../stores/recoil";

function useViewBlog(props : ViewBlogProps) {
  const {id} = useParams();
  const [document, setDocument] = useState<DocumentDTO>({})
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  // 블로그 글 조회
  // 글 조회
    const getDocumentData = useCallback(async () => {
        try {
            if (id) {
                const res = await getDocument({params: {id: id}});
                setDocument(res.data);
              } else {
                setErrorMsg({
                    status : "warn",
                    msg: "there is no blog id"
                })
              }
          } catch (e) {
            setErrorMsg({
                status : "error",
                msg: "get blog fail"
            })
          }
    }, [document, id]);
    useEffect(() => {
      getDocumentData();
      }, [id]);
    return {
      document
    }
}

export default useViewBlog;