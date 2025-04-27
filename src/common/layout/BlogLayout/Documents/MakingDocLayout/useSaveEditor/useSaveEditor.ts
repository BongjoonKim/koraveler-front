import {useCallback} from "react";
import {uuid} from "../../../../../../utils/commonUtils";
import {s3Utils} from "../../../../../../utils/awsS3Utils";
import {useAtom} from "jotai/index";
import {uploadedInfo} from "../../../../../../stores/jotai/jotai";
import {useRecoilState} from "recoil";
import recoil from "../../../../../../stores/recoil";

export interface useSaveEditorProps extends DocumentDTO{

};

function useSaveEditor(props : useSaveEditorProps) {
  const [uploadedList, setUploadedList] = useAtom<any[]>(uploadedInfo);
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  
  // TinyMCE용 이미지 업로더
  const handleImageUpload = useCallback((blobInfo: any, progress: (percent: number) => void) => {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const blob = blobInfo.blob();
        const fileName = uuid();
        const file = new File([blob], `${fileName}`, { type: blob.type });
        const fileKey = `new/${fileName}`;
        
        // 진행률 업데이트 (TinyMCE에서 지원)
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
        
        // 이미지 URL 반환 (TinyMCE는 문자열 URL을 기대함)
        resolve(res);
      } catch (e) {
        setErrorMsg({
          status: "error",
          msg: "Image upload failed",
        });
        reject(e);
      }
    });
  }, [uploadedList, setUploadedList, setErrorMsg]);
  
  // TinyMCE 에디터 설정
  const getEditorConfig = useCallback(() => {
    return {
      // 이미지 업로드 설정
      automatic_uploads: true,
      images_upload_handler: handleImageUpload,
      file_picker_types: 'image',
      // 파일 선택 콜백 (선택적)
      file_picker_callback: function(callback: any, value: any, meta: any) {
        // 파일 선택기를 열기 위한 input 요소 생성
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        
        input.onchange = function() {
          if (input.files && input.files[0]) {
            const file = input.files[0];
            
            // FileReader를 사용하여 파일을 blobInfo로 변환
            const reader = new FileReader();
            reader.onload = function () {
              // 파일 정보를 생성하여 handleImageUpload에 전달
              const id = uuid();
              const blobCache = (window as any).tinymce.activeEditor.editorUpload.blobCache;
              const base64 = (reader.result as string).split(',')[1];
              const blobInfo = blobCache.create(id, file, base64);
              
              // 업로드 처리
              handleImageUpload(blobInfo, (progress) => {
                console.log(`Upload progress: ${progress}%`);
              })
                .then(url => callback(url, { title: file.name }))
                .catch(error => console.error('Failed to upload image', error));
            };
            reader.readAsDataURL(file);
          }
        };
        
        input.click();
      }
    };
  }, [handleImageUpload]);
  
  return {
    handleImageUpload,
    getEditorConfig
  }
}

export default useSaveEditor;