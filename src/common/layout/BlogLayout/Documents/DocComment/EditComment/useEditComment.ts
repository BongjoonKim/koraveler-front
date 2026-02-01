// src/common/layout/BlogLayout/Documents/DocComment/EditComment/useEditComment.ts

import { useRef, useState, useCallback, useEffect } from "react";
import { Editor } from "@tiptap/react";
import { CommentDTO } from "../../../../../../types/documents/CommentDTO";
import useFileUploadInDoc from "../../../../../../hooks/useFileUploadInDoc";
import { useUpdateComment } from "../../../../../../hooks/useCommentQueries";

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
  const [isEditorReady, setIsEditorReady] = useState(false);
  
  // React Query mutation
  const updateMutation = useUpdateComment(comment.documentId);
  
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
  
  // 수정 제출 — mutation 직접 호출
  const handleSubmit = useCallback(async () => {
    const content = getContent();
    if (!content) {
      // 내용이 비어있으면 취소와 동일하게 처리
      clearEditor();
      onCancel?.();
      return;
    }
    
    // 내용이 변경되지 않았으면 취소와 동일하게 처리
    if (content === comment.content) {
      clearEditor();
      onCancel?.();
      return;
    }
    
    const updateData: Partial<CommentDTO> = {
      id: comment.id,
      documentId: comment.documentId,
      content,
    };
    
    updateMutation.mutate(updateData, {
      onSuccess: (updatedComment) => {
        clearEditor();
        onUpdateSuccess?.(updatedComment);
      },
    });
  }, [comment.id, comment.documentId, comment.content, getContent, updateMutation, clearEditor, onUpdateSuccess, onCancel]);
  
  // 취소 핸들러
  const handleCancel = useCallback(() => {
    clearEditor();
    onCancel?.();
  }, [clearEditor, onCancel]);
  
  return {
    editorRef,
    isSubmitting: updateMutation.isPending,
    isEditorReady,
    handleImageUpload,
    handleVideoUpload,
    getContent,
    handleSubmit,
    handleCancel,
  };
}