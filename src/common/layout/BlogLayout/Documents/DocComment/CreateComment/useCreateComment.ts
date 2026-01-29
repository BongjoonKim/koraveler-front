// src/common/layout/BlogLayout/Documents/DocComment/CreateComment/useCreateComment.ts

import { useRef, useState, useCallback } from "react";
import { Editor } from "@tiptap/react";
import {CommentDTO} from "../../../../../../types/documents/CommentDTO";
import useFileUploadInDoc from "../../../../../../hooks/useFileUploadInDoc";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
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
  
  // 댓글 제출 데이터 생성
  const buildCommentData = useCallback((): Partial<CommentDTO> | null => {
    const content = getContent();
    if (!content) {
      return null;
    }
    
    return {
      documentId,
      content,
      parentId,
      depth,
    };
  }, [documentId, parentId, depth, getContent]);
  
  // 취소 핸들러
  const handleCancel = useCallback(() => {
    clearEditor();
    onCancel?.();
  }, [clearEditor, onCancel]);
  
  // 제출 상태 관리
  const startSubmit = useCallback(() => {
    setIsSubmitting(true);
  }, []);
  
  const endSubmit = useCallback(() => {
    setIsSubmitting(false);
  }, []);
  
  // 제출 성공 후 처리
  const handleSubmitComplete = useCallback(
    (createdComment: CommentDTO) => {
      clearEditor();
      onSubmitSuccess?.(createdComment);
    },
    [clearEditor, onSubmitSuccess]
  );
  
  return {
    editorRef,
    isSubmitting,
    isFocused,
    handleFocus,
    handleImageUpload,
    handleVideoUpload,
    getContent,
    clearEditor,
    buildCommentData,
    handleCancel,
    startSubmit,
    endSubmit,
    handleSubmitComplete,
  };
}