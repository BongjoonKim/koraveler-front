// src/common/layout/BlogLayout/Documents/DocComment/EditComment/EditComment.ts

import { useRef, useState, useCallback, useEffect } from "react";
import { Editor } from "@tiptap/react";
import {CommentDTO} from "../../../../../../types/documents/CommentDTO";
import useFileUploadInDoc from "../../../../../../hooks/useFileUploadInDoc";

export interface UseEditCommentProps {
  comment: CommentDTO;
  onUpdateSuccess?: (comment: CommentDTO) => void;
  onCancel?: () => void;
}

export default function useEditComment({
                                         comment,
                                         onUpdateSuccess,
                                         onCancel,
                                       }: UseEditCommentProps) {
  const editorRef = useRef<Editor | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  
  // 댓글용 파일 업로드 훅
  const { handleImageUpload, handleVideoUpload, clearUploadedList } =
    useFileUploadInDoc({
      pathPrefix: `comments/${comment.documentId}`,
    });
  
  // 에디터가 준비되면 기존 내용 로드
  useEffect(() => {
    if (editorRef.current && comment.content && !isEditorReady) {
      editorRef.current.commands.setContent(comment.content);
      setIsEditorReady(true);
    }
  }, [comment.content, isEditorReady]);
  
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
    setIsEditorReady(false);
    clearUploadedList();
  }, [clearUploadedList]);
  
  // 수정 데이터 생성
  const buildUpdateData = useCallback((): Partial<CommentDTO> | null => {
    const content = getContent();
    if (!content) {
      return null;
    }
    
    // 내용이 변경되지 않았으면 null 반환
    if (content === comment.content) {
      return null;
    }
    
    return {
      id: comment.id,
      documentId: comment.documentId,
      content,
    };
  }, [comment.id, comment.documentId, comment.content, getContent]);
  
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
  
  // 수정 성공 후 처리
  const handleUpdateComplete = useCallback(
    (updatedComment: CommentDTO) => {
      clearEditor();
      onUpdateSuccess?.(updatedComment);
    },
    [clearEditor, onUpdateSuccess]
  );
  
  return {
    editorRef,
    isSubmitting,
    isEditorReady,
    handleImageUpload,
    handleVideoUpload,
    getContent,
    buildUpdateData,
    handleCancel,
    startSubmit,
    endSubmit,
    handleUpdateComplete,
  };
}