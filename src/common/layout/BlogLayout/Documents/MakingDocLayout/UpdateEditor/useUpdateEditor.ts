import {UpdateEditorProps} from "./UpdateEditor";
import {useAtom} from "jotai";
import {uploadedInfo} from "../../../../../../stores/jotai/jotai";
import {useRecoilState} from "recoil";
import recoil from "../../../../../../stores/recoil";
import {useCallback} from "react";
import {uuid} from "../../../../../../utils/commonUtils";
import {s3Utils} from "../../../../../../utils/awsS3Utils";

export default function useUpdateEditor(props : UpdateEditorProps) {
  const [uploadedList, setUploadedList] = useAtom<any[]>(uploadedInfo);
  const [errMsg, setErrMsg] = useRecoilState(recoil.errMsg);
  
  // 파일 업로드
  const onUploadImg = useCallback(async (blob : Blob, callback: HookCallback) => {
    try {
      const fileName = uuid();
      const file = new File([blob], `${fileName}`, {type: blob.type});
      const fileKey = `${props.id}/${fileName}`;
      
      const res = await s3Utils.uploadFile({
        fileKey: fileKey,
        file:file
      });
      
      setUploadedList((prev : any[]) => {
        return [
          ...prev,
          {
            blob: blob,
            key : `${fileKey}`
          }
        ]
      });
      await callback(res);
    } catch (e) {
      setErrMsg({
        status : "error",
        msg: "onUploadImg fail"
      })
    }
  }, [uploadedList, props]);
  
  return {
    onUploadImg
  }
}