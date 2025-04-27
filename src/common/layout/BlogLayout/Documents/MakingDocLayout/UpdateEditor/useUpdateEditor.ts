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
      setErrorMsg({
        status : "error",
        msg: "onUploadImg fail"
      })
    }
  }, [uploadedList, props]);
  
  // TinyMCE용 이미지 업로더
  const handleImageUpload = useCallback((blobInfo: any, progress: (percent: number) => void) => {
    return new Promise<string>(async (resolve, reject) => {
      try {
        console.log("여기도 안 오나")
        const blob = blobInfo.blob();
        const fileName = uuid();
        const file = new File([blob], `${fileName}`, { type: blob.type });
        const fileKey = `${props.id}/${fileName}`;
        
        // 진행률 업데이트 (TinyMCE에서 지원)
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
  }, [uploadedList, setUploadedList, setErrorMsg, props]);
  
  // TinyMCE 에디터 설정
  const getEditorConfig = useCallback(() => {
    return {
      height: '100%',
      menubar: true,
      plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table paste code help wordcount'
      ],
      toolbar: 'undo redo | formatselect | ' +
        'bold italic backcolor | alignleft aligncenter ' +
        'alignright alignjustify | bullist numlist outdent indent | ' +
        'removeformat | link image | help',
      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
      // 이미지 업로드 설정
      automatic_uploads: true,
      images_upload_handler: handleImageUpload,
      file_picker_types: 'image',
      file_browser_callback_types: "image",
      
      // 파일 선택 콜백 (선택적)
      file_picker_callback: function(callback: any, value: any, meta: any) {
        // 파일 선택기를 열기 위한 input 요소 생성
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        console.log("수정 사항 확인")
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
    onUploadImg,
    handleImageUpload,
    getEditorConfig
  }
  
  // return {
  //   onUploadImg
  // }
}