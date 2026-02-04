// src/hooks/useDocumentLikeQueries.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuthEP from "../utils/useAuthEP";
import {
  DocumentLikeDTO,
  getDocumentLikeStatus,
  getDocumentLikeStatuses,
  toggleDocumentLike,
} from "../endpoints/document-like-endpoints";

// Query Keys
export const documentLikeKeys = {
  all: ["documentLikes"] as const,
  status: (documentId: string) => [...documentLikeKeys.all, "status", documentId] as const,
  statuses: (documentIds: string[]) => [...documentLikeKeys.all, "statuses", documentIds] as const,
};

// 단일 문서 좋아요 상태 조회
export const useDocumentLikeStatus = (documentId?: string) => {
  const authEP = useAuthEP();
  
  return useQuery<DocumentLikeDTO>({
    queryKey: documentLikeKeys.status(documentId!),
    queryFn: async () => {
      const res = await authEP({
        func: getDocumentLikeStatus,
        params: { documentId },
      });
      return res.data;
    },
    enabled: !!documentId,
    staleTime: 1000 * 60 * 5, // 5분
  });
};

// 여러 문서 좋아요 상태 일괄 조회 (문서 목록용)
export const useDocumentLikeStatuses = (documentIds: string[]) => {
  const authEP = useAuthEP();
  
  return useQuery<{ likedDocumentIds: string[] }>({
    queryKey: documentLikeKeys.statuses(documentIds),
    queryFn: async () => {
      const res = await authEP({
        func: getDocumentLikeStatuses,
        reqBody: { documentIds },
      });
      return res.data;
    },
    enabled: documentIds.length > 0,
    staleTime: 1000 * 60 * 5,
  });
};

// 좋아요 토글 Mutation
export const useToggleDocumentLike = (documentId: string) => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  
  return useMutation<DocumentLikeDTO, Error, void>({
    mutationFn: async () => {
      const res = await authEP({
        func: toggleDocumentLike,
        params: { documentId },
      });
      return res.data;
    },
    onSuccess: (data) => {
      // 캐시 직접 업데이트 (optimistic update)
      queryClient.setQueryData<DocumentLikeDTO>(
        documentLikeKeys.status(documentId),
        data
      );
    },
    onError: () => {
      // 에러 시 캐시 무효화하여 다시 fetch
      queryClient.invalidateQueries({
        queryKey: documentLikeKeys.status(documentId),
      });
    },
  });
};