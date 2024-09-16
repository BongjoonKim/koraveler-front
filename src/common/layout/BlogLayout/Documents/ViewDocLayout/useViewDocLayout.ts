import {ViewDocLayoutProps} from "./ViewDocLayout";
import {useCallback} from "react";
import {useAuth} from "../../../../../appConfig/AuthContext";
import {useRecoilState} from "recoil";
import recoil from "../../../../../stores/recoil";
import {endpointUtils} from "../../../../../utils/endpointUtils";
import {deleteDocument} from "../../../../../endpoints/blog-endpoints";
import {s3Utils} from "../../../../../utils/awsS3Utils";
import {useNavigate} from "react-router-dom";

export default function useViewDocLayout(props : ViewDocLayoutProps) {
  const navigate = useNavigate();
  const {accessToken, setAccessToken} = useAuth();
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  const [loginUser, setLoginUser] = useRecoilState(recoil.userData);
  
  // 수정 화면으로 전환
  const handleEdit = useCallback(() => {
    navigate(`/blog/edit/${props.id}`)
  }, [props.id]);
  
  const handleDelete = useCallback(async () => {
    try {
      // 글 데이터 삭제
      const res = await endpointUtils.authAxios({
        func : deleteDocument,
        accessToken  : accessToken,
        setAccessToken : setAccessToken,
        params : {id : props?.id}
      });
      
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
  
  return {
    handleEdit,
    handleDelete,
    loginUser
  }

}