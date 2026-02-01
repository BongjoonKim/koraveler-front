// src/endpoints/comment-endpoints.ts
import {FuncProps} from "../utils/useAuthEP";
import {request} from "../appConfig/request-response";
import {AxiosResponse} from "axios";
import {CommentDTO} from "../types/documents/CommentDTO";
import {CommentPageDTO} from "../types/documents/PaginationDTO";

export async function createComment(props: FuncProps) {
  return (await request.post("api/v1/comments", props.reqBody, {
    headers: {
      Authorization: `Bearer ${props.accessToken}`
    }
  })) as AxiosResponse<CommentDTO>
}

// 댓글 수정 (로그인 필수, 본인만)
export async function updateComment(props: FuncProps) {
  return (await request.put(
    `api/v1/comments/${props.params.commentId}`,
    props.reqBody,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`,
      },
    }
  )) as AxiosResponse<CommentDTO>;
}

// 댓글 삭제 (로그인 필수, 본인만)
export async function deleteComment(props: FuncProps) {
  return (await request.delete(
    `api/v1/comments/${props.params.commentId}`,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`,
      },
    }
  )) as AxiosResponse<string>;
}

// 댓글 숨김 처리 (로그인 필수, 본인만)
export async function hideComment(props: FuncProps) {
  return (await request.patch(
    `api/v1/comments/${props.params.commentId}/hide`,
    {},
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`,
      },
    }
  )) as AxiosResponse<CommentDTO>;
}

// 댓글 숨김 해제 (로그인 필수, 본인만)
export async function unhideComment(props: FuncProps) {
  return (await request.patch(
    `api/v1/comments/${props.params.commentId}/unhide`,
    {},
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`,
      },
    }
  )) as AxiosResponse<CommentDTO>;
}

// 1depth 댓글 조회 (비로그인 허용)
export async function getRootComments(props: FuncProps) {
  const config = props.accessToken
    ? { headers: { Authorization: `Bearer ${props.accessToken}` } }
    : {};
  
  return (await request.get(
    `api/v1/comments/ps/document/${props.params.documentId}?page=${props.params?.page || 0}&size=${props.params?.size || 10}&sort=${props.params?.sort || "desc"}`,
    config
  )) as AxiosResponse<CommentPageDTO>;
}

// 대댓글 조회 (비로그인 허용)
export async function getReplies(props: FuncProps) {
  const config = props.accessToken
    ? { headers: { Authorization: `Bearer ${props.accessToken}` } }
    : {};
  
  return (await request.get(
    `api/v1/comments/ps/${props.params.parentId}/replies`,
    config
  )) as AxiosResponse<CommentDTO[]>;
}