// src/common/hooks/useFileUpload.ts

import { useCallback } from "react";
import { useAtom } from "jotai";
import { useRecoilState } from "recoil";
import recoil from "../stores/recoil";
import {uploadedInfo} from "../stores/jotai/jotai";
import {uuid} from "../utils/commonUtils";
import useFileUpload from "./useFileUpload";

export interface UseFileUploadProps {
  // S3 경로 prefix (예: documentId, "comments/documentId" 등)
  pathPrefix: string;
}

export interface UploadedFile {
  blob: Blob;
  key: string;
  type?: "image" | "video";
}

export default function useFileUploadInDoc({ pathPrefix }: UseFileUploadProps) {
  const [uploadedList, setUploadedList] = useAtom<UploadedFile[]>(uploadedInfo);
  const [, setErrorMsg] = useRecoilState(recoil.errMsg);
  const {upload} = useFileUpload();
  
  // 이미지 업로드
  const handleImageUpload = useCallback(
    (blobInfo: any, progress: (percent: number) => void) => {
      return new Promise<string>(async (resolve, reject) => {
        try {
          const blob = blobInfo.blob();
          const fileName = uuid();
          const file = new File([blob], `${fileName}`, { type: blob.type });
          const fileKey = `${pathPrefix}/${fileName}`;
          
          progress(10);
          
          const res = await upload(fileKey, file);
          
          progress(90);
          
          setUploadedList((prev) => [
            ...prev,
            {
              blob,
              key: fileKey,
              type: "image",
            },
          ]);
          
          progress(100);
          resolve(res);
        } catch (e) {
          setErrorMsg({
            status: "error",
            msg: "Image upload failed",
          });
          reject(e);
        }
      });
    },
    [pathPrefix, setUploadedList, setErrorMsg, upload]
  );
  
  // 비디오 업로드
  const handleVideoUpload = useCallback(
    (blobInfo: any, progress: (percent: number) => void) => {
      return new Promise<string>(async (resolve, reject) => {
        try {
          const blob = blobInfo.blob();
          const fileName = uuid();
          
          // 비디오 파일 확장자 추출
          const extension = blob.type.split("/")[1] || "mp4";
          const file = new File([blob], `${fileName}.${extension}`, {
            type: blob.type,
          });
          const fileKey = `${pathPrefix}/${fileName}.${extension}`;
          
          progress(10);
          
          const res = await upload(fileKey, file);
          
          progress(90);
          
          setUploadedList((prev) => [
            ...prev,
            {
              blob,
              key: fileKey,
              type: "video",
            },
          ]);
          
          progress(100);
          resolve(res);
        } catch (e) {
          setErrorMsg({
            status: "error",
            msg: "Video upload failed",
          });
          reject(e);
        }
      });
    },
    [pathPrefix, setUploadedList, setErrorMsg, upload]
  );
  
  // 업로드된 파일 목록 초기화
  const clearUploadedList = useCallback(() => {
    setUploadedList([]);
  }, [setUploadedList]);
  
  return {
    uploadedList,
    handleImageUpload,
    handleVideoUpload,
    clearUploadedList,
  };
}