import {CreateDocumentProps} from "./CreateEditor";
import {useAtom} from "jotai";
import {uploadedInfo} from "../../../../../../stores/jotai/jotai";
import {useCallback} from "react";
import {uuid} from "../../../../../../utils/commonUtils";
import {s3Utils} from "../../../../../../utils/awsS3Utils";
import {useRecoilState} from "recoil";
import recoil from "../../../../../../stores/recoil";

export default function useCreateEditor(props : CreateDocumentProps) {
  const [uploadedList, setUploadedList] = useAtom<any[]>(uploadedInfo);
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  
  console.log("id", props.id)
  
  // React Quill용 이미지 업로드 핸들러
  const handleImageUpload = useCallback(async (blobInfo: any, progress: (percent: number) => void): Promise<string> => {
    try {
      console.log("이미지 파일 보기", props)
      const blob = blobInfo.blob();
      const fileName = uuid();
      const file = new File([blob], `${fileName}`, { type: blob.type });
      const fileKey = `${props?.id || "new"}/${fileName}`;
      
      // 진행률 업데이트
      progress(10);
      
      // S3에 파일 업로드
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
      return res;
    } catch (e) {
      setErrorMsg({
        status: "error",
        msg: "Image upload failed",
      });
      throw e;
    }
  }, [uploadedList, setUploadedList, setErrorMsg, props]);
  
  // React Quill 에디터 설정 (필요시 사용)
  const getEditorConfig = useCallback(() => {
    return {
      // React Quill은 modules와 formats을 컴포넌트 내에서 직접 설정하므로
      // 여기서는 추가 설정이 필요한 경우에만 사용
      placeholder: '내용을 입력하세요...',
    };
  }, []);
  
  return {
    handleImageUpload,
    getEditorConfig
  }
}