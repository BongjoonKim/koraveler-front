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
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  
  // Tiptap용 이미지 업로더
  const handleImageUpload = useCallback((blobInfo: any, progress: (percent: number) => void) => {
    return new Promise<string>(async (resolve, reject) => {
      try {
        console.log("이미지 업로드 시작", blobInfo)
        const blob = blobInfo.blob();
        const fileName = uuid();
        const file = new File([blob], `${fileName}`, { type: blob.type });
        const fileKey = `${props.id}/${fileName}`;
        
        // 진행률 업데이트
        progress(10);
        
        // S3에 파일 업로드
        console.log("업로드 확인", fileKey)
        const res = await s3Utils.uploadFile({ fileKey, file });
        
        // 진행률 업데이트
        progress(90);
        
        // 업로드된 파일 목록 상태 업데이트
        setUploadedList((prev: any[]) => {
          return [
            ...prev,
            {
              blob: blob,
              key: `${fileKey}`,
            }
          ];
        });
        
        // 최종 진행률
        progress(100);
        
        // 이미지 URL 반환
        resolve(res);
      } catch (e) {
        setErrorMsg({
          status: "error",
          msg: "Image upload failed",
        });
        reject(e);
      }
    });
  }, [uploadedList, setUploadedList, setErrorMsg, props]);
  
  // 콘텐츠 변경 핸들러 (Tiptap용)
  const handleContentChange = useCallback((content: string) => {
    // 필요시 content를 상위 컴포넌트로 전달하거나 저장
    console.log("Content updated in update editor");
  }, []);
  
  return {
    handleImageUpload,
    handleContentChange,
  }
}