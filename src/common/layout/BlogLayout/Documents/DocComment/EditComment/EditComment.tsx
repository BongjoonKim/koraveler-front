// src/common/layout/BlogLayout/Documents/ViewDocLayout/EditComment.tsx

import React from "react";
import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import {CommentDTO} from "../../../../../../types/documents/CommentDTO";
import useEditComment from "./useEditComment";
import CusAvatar from "../../../../../elements/CusAvatar";
import TipTapEditor from "../../../../../elements/CusEditor/TipTapEditor";

export interface EditCommentProps {
  comment: CommentDTO;
  currentUser?: {
    id: string;
    name?: string;
    profileImg?: string;
  };
  onUpdate?: (comment: Partial<CommentDTO>) => Promise<CommentDTO>;
  onCancel?: () => void;
}

function EditComment({
                       comment,
                       currentUser,
                       onUpdate,
                       onCancel,
                     }: EditCommentProps) {
  const {
    editorRef,
    isSubmitting,
    handleImageUpload,
    handleVideoUpload,
    buildUpdateData,
    handleCancel,
    startSubmit,
    endSubmit,
    handleUpdateComplete,
  } = useEditComment({
    comment,
    onCancel,
  });
  
  // 수정 제출
  const handleSubmit = async () => {
    const updateData = buildUpdateData();
    
    // 변경사항이 없으면 취소와 동일하게 처리
    if (!updateData) {
      handleCancel();
      return;
    }
    
    startSubmit();
    
    try {
      const updatedComment = await onUpdate?.(updateData);
      if (updatedComment) {
        handleUpdateComplete(updatedComment);
      }
    } catch (error) {
      console.error("댓글 수정 실패:", error);
    } finally {
      endSubmit();
    }
  };
  
  // 권한 체크 (본인 댓글만 수정 가능)
  if (!currentUser?.id || currentUser.id !== comment.userId) {
    return null;
  }
  
  const indentLevel = Math.min(comment.depth ?? 0, 2);
  
  return (
    <Box
      ml={{ base: `${indentLevel}rem`, md: `${indentLevel * 2}rem` }}
      p={4}
      bg="blue.50"
      borderRadius="md"
      border="1px solid"
      borderColor="blue.200"
    >
      <HStack align="flex-start" gap={3}>
        <CusAvatar
          size="md"
          name={currentUser.name || currentUser.id}
          src={currentUser.profileImg}
        />
        <VStack flex={1} align="stretch" gap={3}>
          <HStack justify="space-between">
            <Text fontSize="sm" fontWeight="600">
              {comment.userName || currentUser.name || currentUser.id}
            </Text>
            <Text fontSize="xs" color="blue.600">
              수정 중
            </Text>
          </HStack>
          <Box
            border="1px solid"
            borderColor="blue.300"
            borderRadius="md"
            overflow="hidden"
            bg="white"
          >
            <TipTapEditor
              ref={editorRef}
              initialValue={comment.content}
              placeholder="댓글을 수정하세요..."
              handleImageUpload={handleImageUpload}
              handleVideoUpload={handleVideoUpload}
            />
          </Box>
          <HStack justify="flex-end" gap={2}>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              size="sm"
              colorScheme="blue"
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              수정 완료
            </Button>
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );
}

export default EditComment;