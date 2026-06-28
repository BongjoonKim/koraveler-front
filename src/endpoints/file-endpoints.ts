import {request} from "../appConfig/request-response";
import {AxiosResponse} from "axios";
import {FuncProps} from "../utils/useAuthEP";

export interface FileUploadResponse {
  url: string;
}

// 에디터 이미지·비디오 업로드 (백엔드 경유 → S3).
// 브라우저에서 AWS 키로 직접 업로드하던 것을 대체한다.
// params: { file: File, fileKey: string }
export async function uploadBlogFile(props: FuncProps) {
  const formData = new FormData();
  formData.append("file", props.params.file);
  formData.append("fileKey", props.params.fileKey);
  return (await request.post("api/v1/files", formData, {
    headers: {
      Authorization: `Bearer ${props.accessToken}`,
      "Content-Type": "multipart/form-data",
    },
  })) as AxiosResponse<FileUploadResponse>;
}
