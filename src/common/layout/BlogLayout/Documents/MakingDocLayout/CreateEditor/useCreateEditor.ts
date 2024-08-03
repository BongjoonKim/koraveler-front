import {CreateDocumentProps} from "./CreateEditor";
import {useAtomValue} from "jotai/index";
import {uploadedInfo} from "../../../../../../stores/jotai/jotai";
import {useAtom} from "jotai";
import {useCallback} from "react";
import {uuid} from "../../../../../../utils/commonUtils";
import {s3Utils} from "../../../../../../utils/awsS3Utils";
import {useRecoilState} from "recoil";
import recoil from "../../../../../../stores/recoil";

export default function useCreateEditor(props : CreateDocumentProps) {
  const [uploadedList, setUploadedList] = useAtom<any[]>(uploadedInfo);
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  
  // 파일 업로드
  const onUploadImg = useCallback(async (blob: Blob, callback: HookCallback) => {
    try {
      const fileName = uuid();
      const file = new File([blob], `${fileName}`, {type: blob.type});
      const fileKey = `new/${fileName}`
      
      const res = await s3Utils.uploadFile({fileKey: fileKey, file: file});
      
      setUploadedList((prev : any[]) => {
        return [
          ...prev,
          {
            blob: blob,
            key: `${fileKey}`,
          }
        ]
      });
      
      await callback(res);
    } catch (e) {
      setErrorMsg({
        status: "error",
        msg: "onUploadImg fail",
      })
    }
  }, [uploadedList]);
  
  return {
    onUploadImg
  }
  
}