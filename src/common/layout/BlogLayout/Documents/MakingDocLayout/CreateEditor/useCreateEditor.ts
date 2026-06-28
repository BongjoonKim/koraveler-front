import {CreateDocumentProps} from "./CreateEditor";
import {uploadedInfo} from "../../../../../../stores/jotai/jotai";
import {useAtom} from "jotai";
import {useCallback} from "react";
import {uuid} from "../../../../../../utils/commonUtils";
import useFileUpload from "../../../../../../hooks/useFileUpload";
import {useRecoilState} from "recoil";
import recoil from "../../../../../../stores/recoil";

export default function useCreateEditor(props : CreateDocumentProps) {
  const [uploadedList, setUploadedList] = useAtom<any[]>(uploadedInfo);
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  const {upload} = useFileUpload();

  console.log("id", props.id)
  
  // Tiptap용 이미지 업로더
  const handleImageUpload = useCallback((blobInfo: any, progress: (percent: number) => void) => {
    return new Promise<string>(async (resolve, reject) => {
      try {
        console.log("이미지 파일 보기", props)
        const blob = blobInfo.blob();
        const fileName = uuid();
        const file = new File([blob], `${fileName}`, { type: blob.type });
        const fileKey = `${props?.id || "new"}/${fileName}`;
        
        // 진행률 업데이트
        progress(10);
        
        // 백엔드 경유 업로드
        const res = await upload(fileKey, file);
        
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
  }, [uploadedList, setUploadedList, setErrorMsg, props, upload]);
  
  // Tiptap용 비디오 업로더
  const handleVideoUpload = useCallback((blobInfo: any, progress: (percent: number) => void) => {
    return new Promise<string>(async (resolve, reject) => {
      try {
        console.log("비디오 파일 보기", props);
        const blob = blobInfo.blob();
        const fileName = uuid();
        
        // 비디오 파일 확장자 추출
        const extension = blob.type.split('/')[1] || 'mp4';
        const file = new File([blob], `${fileName}.${extension}`, { type: blob.type });
        const fileKey = `${props?.id || "new"}/${fileName}.${extension}`;
        
        // 진행률 업데이트
        progress(10);
        
        // 백엔드 경유 업로드
        const res = await upload(fileKey, file);
        
        // 진행률 업데이트
        progress(90);
        
        // 업로드된 파일 목록 상태 업데이트
        setUploadedList((prev: any[]) => {
          return [
            ...prev,
            {
              blob: blob,
              key: `${fileKey}`,
              type: 'video',
            }
          ];
        });
        
        // 최종 진행률
        progress(100);
        
        // 비디오 URL 반환
        resolve(res);
      } catch (e) {
        setErrorMsg({
          status: "error",
          msg: "Video upload failed",
        });
        reject(e);
      }
    });
  }, [uploadedList, setUploadedList, setErrorMsg, props, upload]);
  
  
  // 콘텐츠 변경 핸들러 (Tiptap용)
  const handleContentChange = useCallback((content: string) => {
    // 필요시 content를 상위 컴포넌트로 전달하거나 저장
    console.log("Content updated");
  }, []);
  
  return {
    handleImageUpload,
    handleVideoUpload,
    handleContentChange,
  }
}