import {ViewDocLayoutProps} from "./ViewDocLayout";
import {useCallback} from "react";
import {useAuth} from "../../../../../appConfig/AuthContext";
import {useRecoilState} from "recoil";
import recoil from "../../../../../stores/recoil";
import {endpointUtils} from "../../../../../utils/endpointUtils";
import {deleteDocument} from "../../../../../endpoints/blog-endpoints";

export default function useViewDocLayout(props : ViewDocLayoutProps) {
  const {accessToken, setAccessToken} = useAuth();
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  
  const handleDelete = useCallback(async () => {
    try {
      // 글 데이터 삭제
      console.log("props", props);
      const res = await endpointUtils.authAxios({
        func : deleteDocument,
        accessToken  : accessToken,
        setAccessToken : setAccessToken,
        params : {id : props?.id}
      });
      
      
      
      // S3에 있는 이미지, 첨부파일 정보 삭제
    } catch (e) {
      setErrorMsg({
        status: "error",
        msg: "delete failed",
      })
    }

  }, [props]);
  
  return {
    handleDelete
  }

}