import {Box, HStack, IconButton, Menu, Text, VStack} from "@chakra-ui/react";
import {CommentDTO} from "../../../../../types/documents/CommentDTO";
import CusAvatar from "../../../../elements/CusAvatar";
import React from "react";
import moment from "moment";
import {FiMoreHorizontal} from "react-icons/fi";
import TipTabEditor from "../../../../elements/CusEditor/TipTabEditor";
import TipTapViewer from "../../../../elements/CusEditor/TipTapViewer";

export interface DocCommentProps {
  comment?: CommentDTO;
  onReply?: (commentId: string, targetDepth: number) => void;
  onEdit?: (commentId: string) => void;
  onDelete?: (commentId: string) => void;
  onHide?: (commentId: string) => void;
  onLike?: (commentId: string) => void;
  onLoadReplies?: (commentId: string) => void;
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
  currentUserId
}: DocCommentProps) {
  const indentLevel = Math.min(comment?.depth ?? 0, 2);
  
  return (
    <Box ml={{ base: `${indentLevel}rem`, md: `${indentLevel * 2}rem` }}
      borderBottom="1px solid"
      borderColor="gray.200"
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
          <VStack  align={"flex-start"}>
            <Text fontWeight={"600"} fontSize={"sm"}>
              {comment?.userName || "sdsdf"}
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
          {comment?.amIWriter || true && (
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
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>
          )}
        </HStack>
      </Box>
      {/* 댓글 내용 */}
      <Box fontSize="sm" lineHeight="tall">
        <TipTapViewer contents={comment?.content || "sdfsdfsdfsdfsdfsdf"} />
      </Box>
    </Box>
  )
}

export default DocComment;