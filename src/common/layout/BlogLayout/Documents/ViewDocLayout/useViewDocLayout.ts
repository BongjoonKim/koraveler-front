import {ViewDocLayoutProps} from "./ViewDocLayout";
import {useCallback} from "react";
import {useRecoilState} from "recoil";
import recoil from "../../../../../stores/recoil";
import {deleteDocument} from "../../../../../endpoints/blog-endpoints";
import {s3Utils} from "../../../../../utils/awsS3Utils";
import {useNavigate} from "react-router-dom";
import {useAtom} from "jotai";
import {isBookmark} from "../../../../../stores/jotai/jotai";
import {createBookmark, deleteBookmark} from "../../../../../endpoints/bookmark-endpoints";
import {ERROR_MESSAGE} from "../../../../../stores/recoil/recoilConstants";
import {ErrorMessageProps} from "../../../../../stores/recoil/types";
import useAuthEP from "../../../../../utils/useAuthEP";

export default function useViewDocLayout(props : ViewDocLayoutProps) {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  const [loginUser, setLoginUser] = useRecoilState(recoil.userData);
  const [isBookmarked, setBookmarked] = useAtom(isBookmark);
  const [errMsg, setErrMsg] = useRecoilState(recoil.errMsg);
  const authEP = useAuthEP();
  
  // 수정 화면으로 전환
  const handleEdit = useCallback(() => {
    navigate(`/blog/edit/${props.id}`)
  }, [props.id]);
  
  const handleDelete = useCallback(async () => {
    try {
      // 글 데이터 삭제
      const res = await authEP({
        func : deleteDocument,
        params : {id : props?.id}
      })
      
      // S3에 있는 이미지, 첨부파일 정보 삭제
      const listRes = await s3Utils.getFiles({
        prefix : `${props.id}/`
      })
      
      // 첨부파일이 있을 경우 삭제
      console.log("listRes", listRes)
      if (listRes?.length) {
        const fileKeyList = listRes.map(el => ({Key : el.Key}));
        s3Utils.deleteFiles({
          Keys : fileKeyList
        });
      }
      navigate(`/blog/home`)
      // 이상이 없으면 view 화면으로 이동
    } catch (e) {
      setErrorMsg({
        status: "error",
        msg: "delete failed",
      })
    }

  }, [props]);
  
  const changeBookmark = useCallback(async () => {
    try {
      if (isBookmarked) {
        const res = await authEP({
          func : deleteBookmark,
          params : {
            documentId : props.id
          },
        })
        console.log("삭제해보기", res)
        if (res.status !== 200) {
          throw res.statusText;
        }
        setBookmarked(false);
      } else {
        const reqBody: BookmarkDTO = {
          documentId: props.id
        }
        const res = await authEP({
          func: createBookmark,
          reqBody: reqBody,
        })
        if (res.status !== 200) {
          throw res.statusText;
        }
        setBookmarked(true);
      }
    } catch (e : ErrorMessageProps | unknown) {
      setErrMsg({
        status: "error",
        msg: e?.toString(),
      })
    }
  }, [isBookmarked, props]);
  
  return {
    handleEdit,
    handleDelete,
    changeBookmark,
    loginUser
  }

}