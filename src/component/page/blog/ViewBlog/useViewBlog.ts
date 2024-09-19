import {ViewBlogProps} from "./ViewBlog";
import {useParams} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import {getDocument} from "../../../../endpoints/blog-endpoints";
import {useRecoilState} from "recoil";
import recoil from "../../../../stores/recoil";
import {useAtom} from "jotai";
import {isBookmark} from "../../../../stores/jotai/jotai";
import {getIsBookmarked} from "../../../../endpoints/bookmark-endpoints";
import {useAuth} from "../../../../appConfig/AuthContext";
import {endpointUtils} from "../../../../utils/endpointUtils";

function useViewBlog(props : ViewBlogProps) {
  const {id} = useParams();
  const [document, setDocument] = useState<DocumentDTO>({});
  const [isBookmarked, setBookmarked] = useAtom<boolean>(isBookmark);
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  const {accessToken, setAccessToken} = useAuth();
  
  // 블로그 글 조회
  // 글 조회
    const getDocumentData = useCallback(async () => {
        try {
          if (id) {
            console.log("여기 오나?")
            const res = await getDocument({params: {id: id}});
            if (res.status !== 200) {
              throw res.statusText;
            }
            setDocument(res.data);
            const resBookmark = await endpointUtils.authAxios({
              func : getIsBookmarked,
              params : {documentId : id},
              accessToken : accessToken,
              setAccessToken : setAccessToken
            });
            console.log("resBookmark", resBookmark)
            if (resBookmark.status !== 200) {
              throw resBookmark.statusText;
            }
            setBookmarked(resBookmark.data)
          } else {
            setErrorMsg({
                status : "warning",
                msg: "there is no blog id"
            })
          }
          } catch (e) {
            setErrorMsg({
                status : "error",
                msg: e?.toString()
            })
          }
    }, [document, id]);
    useEffect(() => {
      getDocumentData();
      }, [id]);
    return {
      document,
      isBookmarked
    }
}

export default useViewBlog;