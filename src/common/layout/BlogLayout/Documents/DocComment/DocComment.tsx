import {Box, HStack, IconButton, Menu, Text, VStack} from "@chakra-ui/react";
import {CommentDTO} from "../../../../../types/documents/CommentDTO";
import CusAvatar from "../../../../elements/CusAvatar";
import React from "react";
import moment from "moment";
import {FiHeart, FiMessageCircle, FiMoreHorizontal} from "react-icons/fi";
import TipTapViewer from "../../../../elements/CusEditor/TipTapViewer";
import {FaHeart} from "react-icons/fa";

export interface DocCommentProps {
  comment?: CommentDTO;
  onReply?: (commentId: string, targetDepth: number) => void;
  onEdit?: (commentId: string) => void;
  onDelete?: (commentId: string) => void;
  onHide?: (commentId: string) => void;
  onLike?: (commentId: string, parentId?: string) => void;
  onLoadReplies?: (commentId: string) => void;
  onToggleReplies?: (commentId: string, replyCount?: number) => void; // 추가
  isExpanded?: boolean; // 추가 - 부모에서 expandedComments.has(comment.id) 전달
  currentUserId?: string;
}

function DocComment({
                      comment,
                      onReply,
                      onEdit,
                      onDelete,
                      onHide,
                      onLike,
                      onLoadReplies,
                      onToggleReplies, // 추가
                      isExpanded = false, // 추가
                      currentUserId
                    }: DocCommentProps) {
  const indentLevel = Math.min(comment?.depth ?? 0, 2);
  
  console.log("comment : ", comment);
  
  // 삭제된 댓글 표시
  if (comment?.isDeleted) {
    return (
      <Box ml={{ base: `${indentLevel}rem`, md: `${indentLevel * 2}rem` }}>
        <Box p={4} bg="gray.50" borderRadius="md">
          <Text color="gray.500" fontStyle="italic">
            삭제된 댓글입니다.
          </Text>
        </Box>
      </Box>
    );
  }
  
  // 답글 달기 핸들러 - depth 2면 부모(depth 1)에 달리도록
  const handleReply = () => {
    if (!comment) {
      return;
    }
    if (comment.depth >= 2 && comment.parentId) {
      // depth 2 댓글에 답글 → 부모(depth 1)의 대댓글로
      onReply?.(comment.parentId, 2);
    } else {
      // depth 0, 1 댓글에 답글
      onReply?.(comment.id, comment.depth + 1);
    }
  };
  
  // expandedComments를 통한 토글 - 부모 컴포넌트의 handler 호출
  const handleToggleReplies = () => {
    if (!comment) {
      return;
    }
    onToggleReplies?.(comment.id, comment.replyCount);
  };
  
  return (
    <Box ml={{ base: `${indentLevel}rem`, md: `${indentLevel * 2}rem` }}
         borderBottom="1px solid"
         borderColor="gray.200"
         padding={"1rem"}
    >
      <Box
        display={"flex"}
        gap={3}
        py={2}
        alignItems={"center"}
        w={"full"}
      >
        <CusAvatar
          size="md"
          name={comment?.userId || comment?.userName}
        />
        <HStack justify={"space-between"} w={"full"} py={2}>
          <VStack align={"flex-start"}>
            <Text fontWeight={"600"} fontSize={"sm"}>
              {comment?.userId}
            </Text>
            <Text color="gray.500" fontSize="xs">
              {moment(comment?.created).format("YYYY.MM.DD")}
            </Text>
            {comment?.isEdited && (
              <Text color="gray.400" fontSize="xs">
                (Edited)
              </Text>
            )}
          </VStack>
          {comment?.amIWriter && (
            <Menu.Root>
              <Menu.Trigger asChild>
                <IconButton
                  aria-label="더보기"
                  variant="ghost"
                  size="xs"
                >
                  <FiMoreHorizontal />
                </IconButton>
              </Menu.Trigger>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item value="edit" onClick={() => onEdit?.(comment?.id ?? "")}>
                    Edit
                  </Menu.Item>
                  <Menu.Item value="delete" onClick={() => onDelete?.(comment?.id ?? "")}>
                    Delete
                  </Menu.Item>
                  <Menu.Item value="hide" onClick={() => onHide?.(comment?.id ?? "")}>
                    Hide
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>
          )}
        </HStack>
      </Box>
      
      {/* 댓글 내용 */}
      <Box fontSize="sm" lineHeight="tall">
        <TipTapViewer contents={comment?.content} />
      </Box>
      
      <HStack gap={4} pt={1}>
        {/* 좋아요 */}
        <HStack
          gap={1}
          cursor="pointer"
          onClick={() => onLike?.(comment?.id!, comment?.parentId)}
          color={comment?.isLikedByMe ? "red.500" : "gray.500"}
          _hover={{ color: "red.400" }}
        >
          {comment?.isLikedByMe ? <FaHeart size={14} /> : <FiHeart size={14} />}
          {(comment?.likeCount ?? 0) > 0 && (
            <Text fontSize="xs">{comment?.likeCount}</Text>
          )}
        </HStack>
        
        {/* 답글 달기 */}
        {currentUserId && (
          <HStack
            gap={1}
            cursor="pointer"
            onClick={handleReply}
            color="gray.500"
            _hover={{ color: "blue.400" }}
          >
            <FiMessageCircle size={14} />
            <Text fontSize="xs">답글</Text>
          </HStack>
        )}
        
        {/* 대댓글 보기 토글 (depth 0, 1만) */}
        {comment && comment.depth < 2 && (comment.replyCount ?? 0) > 0 && (
          <Text
            fontSize="xs"
            color="blue.500"
            cursor="pointer"
            onClick={handleToggleReplies}
            _hover={{ textDecoration: "underline" }}
          >
            {isExpanded
              ? "답글 숨기기"
              : `답글 ${comment.replyCount}개 보기`
            }
          </Text>
        )}
      </HStack>
    </Box>
  )
}

export default DocComment;