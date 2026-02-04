// ============ Query Keys ============

import {useInfiniteQuery, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {CommentPageDTO} from "../types/documents/PaginationDTO";
import useAuthEP from "../utils/useAuthEP";
import {
  createComment,
  deleteComment,
  getReplies,
  getRootComments,
  hideComment, unhideComment,
  updateComment
} from "../endpoints/comment-endpoints";
import {CommentDTO} from "../types/documents/CommentDTO";

export const commentKeys = {
  all: ["comments"] as const,
  root: (documentId: string) => [...commentKeys.all, "root", documentId] as const,
  replies: (parentId: string) => [...commentKeys.all, "replies", parentId] as const,
};

// 1depth 댓글 무한스크롤 조회
export const useRootComments = (documentId?: string, size: number=10) => {
  const authEP = useAuthEP();
  
  return useInfiniteQuery<CommentPageDTO>({
    queryKey: commentKeys.root(documentId!),
    queryFn: async ({pageParam = 0}) => {
      const res = await getRootComments({
        params : {
          documentId,
          page: pageParam,
          size,
          sort: "desc"
        }
      })
      return res.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasNext ? allPages.length : undefined;
    },
    enabled: !!documentId,
    staleTime: 1000 * 60 * 2 // 2분
  })
}

// 대댓글 조회
export const useReplies = (parentId ?: string) => {
  const authEP = useAuthEP();
  
  return useQuery<CommentDTO[]>({
    queryKey: commentKeys.replies(parentId!),
    queryFn: async () => {
      const res = await getReplies({
        params : {
          parentId
        }
      })
      return res.data
    },
    enabled: false, // 수동 호출
    staleTime: 1000 * 60 * 2,
  })
}

// ============ 댓글 생성 ============

export const useCreateComment = (documentId: string) => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  
  return useMutation<CommentDTO, Error, Partial<CommentDTO>>({
    mutationFn: async (commentData) => {
      const res = await authEP({
        func: createComment,
        reqBody: commentData,
      });
      return res.data;
    },
    onSuccess: (created, variables) => {
      if (!variables.parentId) {
        // 1depth 댓글 → root 목록 갱신
        queryClient.invalidateQueries({
          queryKey: commentKeys.root(documentId),
        });
      } else {
        // 대댓글 → 해당 부모의 replies 갱신
        queryClient.invalidateQueries({
          queryKey: commentKeys.replies(variables.parentId),
        });
        // root도 갱신 (replyCount 반영)
        queryClient.invalidateQueries({
          queryKey: commentKeys.root(documentId),
        });
      }
    },
  });
};

// ============ 댓글 수정 ============

export const useUpdateComment = (documentId: string) => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  
  return useMutation<CommentDTO, Error, Partial<CommentDTO>>({
    mutationFn: async (commentData) => {
      const res = await authEP({
        func: updateComment,
        params: { commentId: commentData.id },
        reqBody: commentData,
      });
      return res.data;
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.root(documentId),
      });
      // 대댓글이면 해당 부모의 replies도 갱신
      if (updated.parentId) {
        queryClient.invalidateQueries({
          queryKey: commentKeys.replies(updated.parentId),
        });
      }
    },
  });
};

// ============ 댓글 삭제 ============

export const useDeleteComment = (documentId: string) => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, { commentId: string; parentId?: string }>({
    mutationFn: async ({ commentId }) => {
      const res = await authEP({
        func: deleteComment,
        params: { commentId },
      });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.root(documentId),
      });
      if (variables.parentId) {
        queryClient.invalidateQueries({
          queryKey: commentKeys.replies(variables.parentId),
        });
      }
    },
  });
};

// ============ 댓글 숨김 ============

export const useHideComment = (documentId: string) => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  
  return useMutation<CommentDTO, Error, { commentId: string; parentId?: string }>({
    mutationFn: async ({ commentId }) => {
      const res = await authEP({
        func: hideComment,
        params: { commentId },
      });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.root(documentId),
      });
      if (variables.parentId) {
        queryClient.invalidateQueries({
          queryKey: commentKeys.replies(variables.parentId),
        });
      }
    },
  });
};

// ============ 댓글 공개 ============

export const useUnhideComment = (documentId: string) => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  
  return useMutation<CommentDTO, Error, { commentId: string; parentId?: string }>({
    mutationFn: async ({ commentId }) => {
      const res = await authEP({
        func: unhideComment,
        params: { commentId },
      });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.root(documentId),
      });
      if (variables.parentId) {
        queryClient.invalidateQueries({
          queryKey: commentKeys.replies(variables.parentId),
        });
      }
    },
  });
};
