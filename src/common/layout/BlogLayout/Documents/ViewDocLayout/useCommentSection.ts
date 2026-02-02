// src/common/layout/BlogLayout/Documents/ViewDocLayout/useCommentSection.ts

import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "../../../../../hooks/useCurrentUser";
import {
  useCreateComment,
  useDeleteComment,
  useHideComment,
  useUnhideComment,
  useRootComments,
  useUpdateComment,
  commentKeys,
} from "../../../../../hooks/useCommentQueries";
import { CommentDTO } from "../../../../../types/documents/CommentDTO";
import useAuthEP from "../../../../../utils/useAuthEP";
import { getReplies } from "../../../../../endpoints/comment-endpoints";
import {useAtom} from "jotai";
import {expandedCommentsAtom} from "../../../../../stores/jotai/jotai";

export interface UseCommentSectionProps {
  documentId: string;
}

export interface ReplyTarget {
  parentId: string;
  depth: number;
  userName?: string;
}

export default function useCommentSection({ documentId }: UseCommentSectionProps) {
  const { data: currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const authEP = useAuthEP();
  
  // 답글 작성 대상
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);
  
  // 수정 중인 댓글 ID
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  
  // 대댓글 로딩된 목록 (parentId -> replies)
  const [loadedReplies, setLoadedReplies] = useState<Record<string, CommentDTO[]>>({});
  
  // 대댓글 펼침 상태
  const [expandedComments, setExpandedComments] = useAtom(expandedCommentsAtom)
  
  // ============ 조회 (React Query) ============
  
  const {
    data: commentPages,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useRootComments(documentId);
  
  // 전체 댓글 목록 (페이지 병합)
  const comments = commentPages?.pages.flatMap((page) => page.comments) ?? [];
  const totalCount = commentPages?.pages[0]?.totalCount ?? 0;
  
  // ============ Mutations ============
  
  const createMutation = useCreateComment(documentId);
  const updateMutation = useUpdateComment(documentId);
  const deleteMutation = useDeleteComment(documentId);
  const hideMutation = useHideComment(documentId);
  const unhideMutation = useUnhideComment(documentId);
  
  // ============ 대댓글 로드 ============
  
  const handleLoadReplies = useCallback(
    async (parentId: string) => {
      try {
        const res = await getReplies({
          params: { parentId },
        })
        setLoadedReplies((prev) => ({
          ...prev,
          [parentId]: res.data,
        }));
      } catch (error) {
        console.error("대댓글 로드 실패:", error);
      }
    },
    [authEP]
  );
  
  // ============ 대댓글 토글 ============
  
  const handleToggleReplies = useCallback(
    (commentId: string, replyCount?: number) => {
      console.log("commentId", commentId)
      
      setExpandedComments((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(commentId)) {
          newSet.delete(commentId);
        } else {
          newSet.add(commentId);
          // 아직 로드되지 않았고 대댓글이 있으면 로드
          if (!loadedReplies[commentId] && replyCount && replyCount > 0) {
            handleLoadReplies(commentId);
          }
        }
        return newSet;
      });
    },
    [loadedReplies, handleLoadReplies, expandedComments]
  );
  
  // ============ 답글 작성 시작 ============
  
  const handleStartReply = useCallback(
    (parentId: string, targetDepth: number, userName?: string) => {
      // depth 2에서 답글 달면 → 실제 parentId는 depth 1 댓글의 id
      // targetDepth는 이미 호출 측(DocComment)에서 계산되어 옴
      setReplyTarget({ parentId, depth: targetDepth, userName });
      setEditingCommentId(null); // 수정 모드 해제
    },
    []
  );
  
  // ============ 답글 작성 취소 ============
  
  const handleCancelReply = useCallback(() => {
    setReplyTarget(null);
  }, []);
  
  // ============ 댓글 생성 성공 콜백 ============
  
  const handleCreateSuccess = useCallback(
    (created: CommentDTO) => {
      setReplyTarget(null);
      // 대댓글인 경우 해당 부모의 replies 갱신
      if (created.parentId) {
        handleLoadReplies(created.parentId);
        // 펼침 상태 유지
        setExpandedComments((prev) => new Set(prev).add(created.parentId!));
      }
    },
    [handleLoadReplies, expandedComments]
  );
  
  // ============ 수정 모드 시작 ============
  
  const handleStartEdit = useCallback((commentId: string) => {
    setEditingCommentId(commentId);
    setReplyTarget(null); // 답글 모드 해제
  }, []);
  
  // ============ 수정 취소 ============
  
  const handleCancelEdit = useCallback(() => {
    setEditingCommentId(null);
  }, []);
  
  // ============ 수정 성공 콜백 ============
  
  const handleUpdateSuccess = useCallback(
    (updated: CommentDTO) => {
      setEditingCommentId(null);
      // 대댓글이면 해당 부모의 replies 갱신
      if (updated.parentId) {
        handleLoadReplies(updated.parentId);
      }
    },
    [handleLoadReplies]
  );
  
  // ============ 삭제 ============
  
  const handleDelete = useCallback(
    (commentId: string, parentId?: string) => {
      
      deleteMutation.mutate(
        { commentId, parentId },
        {
          onSuccess: () => {
            if (parentId) {
              handleLoadReplies(parentId);
            }
          },
        }
      );
    },
    [deleteMutation, handleLoadReplies]
  );
  
  // ============ 숨김 처리 ============
  
  const handleHide = useCallback(
    (commentId: string, parentId?: string) => {
      hideMutation.mutate(
        { commentId, parentId },
        {
          onSuccess: () => {
            if (parentId) {
              handleLoadReplies(parentId);
            }
          },
        }
      );
    },
    [hideMutation, handleLoadReplies]
  );
  
  // ============ 숨김 해제 ============
  
  const handleUnhide = useCallback(
    (commentId: string, parentId?: string) => {
      unhideMutation.mutate(
        { commentId, parentId },
        {
          onSuccess: () => {
            if (parentId) {
              handleLoadReplies(parentId);
            }
          },
        }
      );
    },
    [unhideMutation, handleLoadReplies]
  );
  
  // ============ 좋아요 (추후 구현) ============
  
  const handleLike = useCallback((commentId?: string) => {
    // TODO: 좋아요 API 연결
    console.log("좋아요:", commentId);
  }, []);
  
  // ============ 더보기 (무한스크롤) ============
  
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  
  return {
    // 유저 정보
    currentUser,
    
    // 댓글 목록
    comments,
    totalCount,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    
    // 대댓글 관련
    loadedReplies,
    expandedComments,
    handleToggleReplies,
    handleLoadReplies,
    
    // 답글 작성
    replyTarget,
    handleStartReply,
    handleCancelReply,
    handleCreateSuccess,
    
    // 수정
    editingCommentId,
    handleStartEdit,
    handleCancelEdit,
    handleUpdateSuccess,
    
    // 삭제/숨김
    handleDelete,
    handleHide,
    handleUnhide,
    
    // 좋아요
    handleLike,
    
    // 페이지네이션
    handleLoadMore,
    
    // Mutation 상태
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}