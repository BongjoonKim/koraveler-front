// src/common/layout/BlogLayout/Documents/DocComment/CreateComment/useCreateComment.ts

import { useRef, useState, useCallback } from "react";
import { Editor } from "@tiptap/react";
import { CommentDTO } from "../../../../../../types/documents/CommentDTO";
import useFileUploadInDoc from "../../../../../../hooks/useFileUploadInDoc";
import { useCreateComment as useCreateCommentMutation } from "../../../../../../hooks/useCommentQueries";

export interface UseCreateCommentProps {
  documentId: string;
  parentId?: string;
  depth?: number;
  onSubmitSuccess?: (comment: CommentDTO) => void;
  onCancel?: () => void;
}

export default function useCreateComment({
                                           documentId,
                                           parentId,
                                           depth = 0,
                                           onSubmitSuccess,
                                           onCancel,
                                         }: UseCreateCommentProps) {
  const editorRef = useRef<Editor | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  
  // React Query mutation
  const createMutation = useCreateCommentMutation(documentId);
  
  // 댓글용 파일 업로드 훅 (경로: comments/{documentId})
  const { handleImageUpload, handleVideoUpload, clearUploadedList } =
    useFileUploadInDoc({
      pathPrefix: `comments/${documentId}`,
    });
  
  // 에디터 포커스 핸들러
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);
  
  // 에디터 내용 가져오기
  const getContent = useCallback(() => {
    const editor = editorRef.current;
    if (!editor || editor.isEmpty) {
      return null;
    }
    const content = editor.getHTML();
    if (!content || content === "<p></p>") {
      return null;
    }
    return content;
  }, []);
  
  // 에디터 초기화
  const clearEditor = useCallback(() => {
    const editor = editorRef.current;
    if (editor) {
      editor.commands.clearContent();
    }
    setIsFocused(false);
    clearUploadedList();
  }, [clearUploadedList]);
  
  // 댓글 제출 — mutation 직접 호출
  const handleSubmit = useCallback(async () => {
    const content = getContent();
    if (!content) return;
    
    const commentData: Partial<CommentDTO> = {
      documentId,
      content,
      parentId,
      depth,
    };
    
    createMutation.mutate(commentData, {
      onSuccess: (createdComment) => {
        clearEditor();
        onSubmitSuccess?.(createdComment);
      },
    });
  }, [documentId, parentId, depth, getContent, createMutation, clearEditor, onSubmitSuccess]);
  
  // 취소 핸들러
  const handleCancel = useCallback(() => {
    clearEditor();
    onCancel?.();
  }, [clearEditor, onCancel]);
  
  return {
    editorRef,
    isSubmitting: createMutation.isPending,
    isFocused,
    handleFocus,
    handleImageUpload,
    handleVideoUpload,
    getContent,
    clearEditor,
    handleSubmit,
    handleCancel,
  };
}