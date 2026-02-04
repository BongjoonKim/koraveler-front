import { request } from "../appConfig/request-response";
import { AxiosResponse } from "axios";
import { FuncProps } from "../utils/useAuthEP";

export interface CommentLikeDTO {
  id?: string;
  commentId: string;
  usersId?: string;
  createdAt?: string;
  isLiked: boolean;
  likeCount: number;
}

export interface LikeStatusesResponse {
  likedCommentIds: string[];
}

// 좋아요 토글 (로그인 필수)
export async function toggleCommentLike(props: FuncProps) {
  return (await request.post(
    `api/v1/comments/${props.params.commentId}/like`,
    {},
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`,
      },
    }
  )) as AxiosResponse<CommentLikeDTO>;
}

// 특정 댓글의 좋아요 상태 조회 (비로그인 허용)
export async function getCommentLikeStatus(props: FuncProps) {
  const config = props.accessToken
    ? { headers: { Authorization: `Bearer ${props.accessToken}` } }
    : {};
  
  return (await request.get(
    `api/v1/comments/ps/${props.params.commentId}/like`,
    config
  )) as AxiosResponse<CommentLikeDTO>;
}

// 여러 댓글의 좋아요 상태 일괄 조회 (비로그인 허용)
export async function getCommentLikeStatuses(props: FuncProps) {
  const config = props.accessToken
    ? { headers: { Authorization: `Bearer ${props.accessToken}` } }
    : {};
  
  return (await request.post(
    `api/v1/comments/ps/likes/status`,
    { commentIds: props.reqBody.commentIds },
    config
  )) as AxiosResponse<LikeStatusesResponse>;
}