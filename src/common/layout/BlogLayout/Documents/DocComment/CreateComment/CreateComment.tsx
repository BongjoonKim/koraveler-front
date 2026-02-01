// src/common/layout/BlogLayout/Documents/DocComment/CreateComment/CreateComment.tsx
import React from "react";
import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import useCreateComment from "./useCreateComment";
import { CommentDTO } from "../../../../../../types/documents/CommentDTO";
import CusAvatar from "../../../../../elements/CusAvatar";
import TipTapEditor from "../../../../../elements/CusEditor/TipTapEditor";
import CommentEditor from "../../../../../elements/CusEditor/CommentEditor";

export interface CreateCommentProps {
  documentId: string;
  parentId?: string;
  depth?: number;
  replyToUserName?: string;
  currentUser?: {
    id: string;
    name?: string;
    profileImg?: string;
  };
  onSubmitSuccess?: (comment: CommentDTO) => void;
  onCancel?: () => void;
  isCompact?: boolean;
}

function CreateComment({
                         documentId,
                         parentId,
                         depth = 0,
                         replyToUserName,
                         currentUser,
                         onSubmitSuccess,
                         onCancel,
                         isCompact = false,
                       }: CreateCommentProps) {
  const {
    editorRef,
    isSubmitting,
    isFocused,
    handleFocus,
    handleImageUpload,
    handleVideoUpload,
    handleSubmit,
    handleCancel,
  } = useCreateComment({
    documentId,
    parentId,
    depth,
    onSubmitSuccess,
    onCancel,
  });
  
  // 로그인하지 않은 경우
  if (!currentUser?.id) {
    return (
      <Box p={4} bg="gray.50" borderRadius="md" textAlign="center">
        <Text color="gray.500" fontSize="sm">
          댓글을 작성하려면 로그인이 필요합니다.
        </Text>
      </Box>
    );
  }
  
  const placeholderText = replyToUserName
    ? `@${replyToUserName}에게 답글 작성...`
    : isCompact
      ? "답글을 작성하세요..."
      : "댓글을 작성하세요...";
  
  // 간소화 모드 (대댓글)
  if (isCompact) {
    return (
      <Box
        ml={{ base: `${Math.min(depth, 2)}rem`, md: `${Math.min(depth, 2) * 2}rem` }}
        mt={2}
        p={3}
        bg="gray.50"
        borderRadius="md"
      >
        <HStack align="flex-start" gap={3}>
          <CusAvatar
            size="sm"
            name={currentUser.name || currentUser.id}
            src={currentUser.profileImg}
          />
          <VStack flex={1} align="stretch" gap={2}>
            <Box
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              overflow="hidden"
              bg="white"
              minH="80px"
              display={"flex"}
              flexDirection={"column"}
              flex={1}
            >
              <CommentEditor
                ref={editorRef}
                placeholder={placeholderText}
                handleImageUpload={handleImageUpload}
              />
            </Box>
            <HStack justify="flex-end" gap={2}>
              <Button size="xs" variant="ghost" onClick={handleCancel}>
                취소
              </Button>
              <Button
                size="xs"
                colorScheme="blue"
                onClick={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                답글
              </Button>
            </HStack>
          </VStack>
        </HStack>
      </Box>
    );
  }
  
  // 기본 모드
  return (
    <Box p={4} borderBottom="1px solid" borderColor="gray.200">
      <HStack align="flex-start" gap={3} height={"20rem"}>
        <CusAvatar
          size="md"
          name={currentUser.name || currentUser.id}
          src={currentUser.profileImg}
        />
        <VStack flex={1} align="stretch" gap={3} height={"100%"}>
          <Text fontSize="sm" fontWeight="600">
            {currentUser.name || currentUser.id}
          </Text>
          <Box
            border="1px solid"
            borderColor={isFocused ? "blue.400" : "gray.200"}
            borderRadius="md"
            overflow="hidden"
            transition="border-color 0.2s"
            onFocus={handleFocus}
            display={"flex"}
            flexDirection={"column"}
            flex={1}
          >
            <CommentEditor
              ref={editorRef}
              placeholder={placeholderText}
              handleImageUpload={handleImageUpload}
            />
          </Box>
          <HStack justify="flex-end" gap={2}>
            <Button size="sm" variant="ghost" onClick={handleCancel}>
              취소
            </Button>
            <Button
              size="sm"
              colorScheme="blue"
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              댓글 작성
            </Button>
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );
}

export default CreateComment;