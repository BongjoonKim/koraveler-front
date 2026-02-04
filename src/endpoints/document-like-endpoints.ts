// src/endpoints/document-like-endpoints.ts
import { FuncProps } from "../utils/useAuthEP";
import { request } from "../appConfig/request-response";
import { AxiosResponse } from "axios";

// DocumentLike 응답 타입
export interface DocumentLikeDTO {
  id?: string;
  documentId: string;
  usersId?: string;
  createdAt?: string;
  isLiked: boolean;
  likeCount: number;
}

// 좋아요 토글 (로그인 필수)
export async function toggleDocumentLike(props: FuncProps) {
  return (await request.post(
    `api/v1/documents/${props.params.documentId}/like`,
    {},
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`,
      },
    }
  )) as AxiosResponse<DocumentLikeDTO>;
}

// 특정 문서의 좋아요 상태 조회 (비로그인 허용)
export async function getDocumentLikeStatus(props: FuncProps) {
  const config = props.accessToken
    ? { headers: { Authorization: `Bearer ${props.accessToken}` } }
    : {};
  
  return (await request.get(
    `api/v1/documents/ps/${props.params.documentId}/like`,
    config
  )) as AxiosResponse<DocumentLikeDTO>;
}

// 여러 문서의 좋아요 상태 일괄 조회 (비로그인 허용)
export async function getDocumentLikeStatuses(props: FuncProps) {
  const config = props.accessToken
    ? { headers: { Authorization: `Bearer ${props.accessToken}` } }
    : {};
  
  return (await request.post(
    `api/v1/documents/ps/likes/status`,
    { documentIds: props.reqBody.documentIds },
    config
  )) as AxiosResponse<{ likedDocumentIds: string[] }>;
}