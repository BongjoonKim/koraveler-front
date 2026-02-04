// src/hooks/useCommentLikeQueries.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuthEP from "../utils/useAuthEP";
import {
  toggleCommentLike,
  getCommentLikeStatus,
  getCommentLikeStatuses,
  CommentLikeDTO,
  LikeStatusesResponse,
} from "../endpoints/comment-like-endpoints";
import { commentKeys } from "./useCommentQueries";

// ============ Query Keys ============

export const commentLikeKeys = {
  all: ["commentLikes"] as const,
  status: (commentId: string) => [...commentLikeKeys.all, "status", commentId] as const,
  statuses: (commentIds: string[]) => [...commentLikeKeys.all, "statuses", commentIds.sort().join(",")] as const,
};

// ============ 단일 댓글 좋아요 상태 조회 ============

export const useCommentLikeStatus = (commentId?: string) => {
  
  return useQuery<CommentLikeDTO>({
    queryKey: commentLikeKeys.status(commentId!),
    queryFn: async () => {
      const res = await getCommentLikeStatus({
        params: { commentId }
      })
      return res.data;
    },
    enabled: !!commentId,
    staleTime: 1000 * 60 * 2, // 2분
  });
};

// ============ 여러 댓글 좋아요 상태 일괄 조회 ============

export const useCommentLikeStatuses = (commentIds: string[]) => {
  
  return useQuery<LikeStatusesResponse>({
    queryKey: commentLikeKeys.statuses(commentIds),
    queryFn: async () => {
      const res = await getCommentLikeStatuses({
        params: {
          commentIds
        }
      })
      return res.data;
    },
    enabled: commentIds.length > 0,
    staleTime: 1000 * 60 * 2, // 2분
  });
};

// ============ 좋아요 토글 ============

export const useToggleCommentLike = (documentId: string) => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  
  return useMutation<CommentLikeDTO, Error, { commentId: string; parentId?: string }>({
    mutationFn: async ({ commentId }) => {
      const res = await authEP({
        func: toggleCommentLike,
        params: { commentId },
      });
      return res.data;
    },
    onSuccess: (data, variables) => {
      // 해당 댓글의 좋아요 상태 캐시 업데이트
      queryClient.setQueryData(
        commentLikeKeys.status(variables.commentId),
        data
      );
      
      // 댓글 목록도 갱신 (likeCount 반영)
      queryClient.invalidateQueries({
        queryKey: commentKeys.root(documentId),
      });
      
      // 대댓글이면 해당 부모의 replies도 갱신
      if (variables.parentId) {
        queryClient.invalidateQueries({
          queryKey: commentKeys.replies(variables.parentId),
        });
      }
      
      // 일괄 조회 캐시도 무효화
      queryClient.invalidateQueries({
        queryKey: commentLikeKeys.all,
        predicate: (query) =>
          query.queryKey[0] === "commentLikes" &&
          query.queryKey[1] === "statuses",
      });
    },
  });
};