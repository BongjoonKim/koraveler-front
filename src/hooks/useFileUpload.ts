// src/hooks/useFileUpload.ts
//
// 에디터 파일(이미지·비디오) 업로드 공용 훅.
// 기존에는 각 호출처가 s3Utils.uploadFile 로 브라우저에서 AWS 키를 써
// S3 에 직접 업로드했으나, 키가 번들에 노출되는 문제로 백엔드 경유로 전환한다.
//
// 레이어 규칙: component → 이 훅(useFileUpload) → endpoints(uploadBlogFile)
// 인증은 useAuthEP() 경유 필수.

import {useCallback} from "react";
import useAuthEP from "../utils/useAuthEP";
import {uploadBlogFile} from "../endpoints/file-endpoints";

export default function useFileUpload() {
  const authEP = useAuthEP();

  // fileKey(S3 object key)와 File 을 받아 업로드하고 공개 URL 을 반환한다.
  const upload = useCallback(
    async (fileKey: string, file: File): Promise<string> => {
      const res = await authEP({
        func: uploadBlogFile,
        params: {fileKey, file},
      });
      return res.data.url;
    },
    [authEP]
  );

  return {upload};
}
