// src/common/layout/BlogLayout/Documents/ViewDocLayout/useCommentSection.ts

import useAuthEP from "../../../../../utils/useAuthEP";
import {useCurrentUser} from "../../../../../hooks/useCurrentUser";
import {useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {
  useCreateComment,
  useDeleteComment,
  useHideComment,
  useRootComments,
  useUpdateComment
} from "../../../../../hooks/useCommentQueries";

export interface UseCommentSectionProps {
  documentId: string;
}

export interface ReplyTarget {
  parentId: string;
  depth: number;
  userName?: string;
}

export default function useCommentSection({documentId} : UseCommentSectionProps) {
  const {data : currentUser} = useCurrentUser();
  const queryClient = useQueryClient();
  const authEP = useAuthEP();
  
  // 답글 작성 대상
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);
  
  // 수정 중인 댓글 ID
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  
  // ============ 조회 (React Query) ============
  
  const {
    data: commentPages,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useRootComments(documentId);
  
  // ============ Mutations ============
  
  const createMutation = useCreateComment(documentId);
  const updateMutation = useUpdateComment(documentId);
  const deleteMutation = useDeleteComment(documentId);
  const hideMutation = useHideComment(documentId);
}