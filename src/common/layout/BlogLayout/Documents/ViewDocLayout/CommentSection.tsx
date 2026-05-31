// src/common/layout/BlogLayout/Documents/ViewDocLayout/CommentSection.tsx

import React from "react";
import { Box, Button, Spinner, Text, VStack } from "@chakra-ui/react";
import useCommentSection from "./useCommentSection";
import CreateComment from "../DocComment/CreateComment/CreateComment";
import EditComment from "../DocComment/EditComment/EditComment";
import DocComment from "../DocComment/DocComment";
import { CommentDTO } from "../../../../../types/documents/CommentDTO";

export interface CommentSectionProps {
  documentId: string;
}

function CommentSection({ documentId }: CommentSectionProps) {
  const {
    currentUser,
    comments,
    totalCount,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    loadedReplies,
    expandedComments,
    handleToggleReplies,
    handleLoadReplies,
    replyTarget,
    handleStartReply,
    handleCancelReply,
    handleCreateSuccess,
    editingCommentId,
    handleStartEdit,
    handleCancelEdit,
    handleUpdateSuccess,
    handleDelete,
    handleHide,
    handleLike,
    handleLoadMore,
  } = useCommentSection({ documentId });
  
  // 댓글 아이템 렌더링 (재귀)
  const renderComment = (comment: CommentDTO, parentId?: string) => {
    const isEditing = editingCommentId === comment.id;
    const isExpanded = expandedComments.has(comment.id);
    const replies = loadedReplies[comment.id] || [];
    
    // 수정 모드
    if (isEditing) {
      return (
        <EditComment
          key={comment.id}
          comment={comment}
          currentUser={
            currentUser
              ? {
                id: currentUser.id,
                name: currentUser.username,
                profileImg: currentUser.avatarUrl,
              }
              : undefined
          }
          onUpdateSuccess={handleUpdateSuccess}
          onCancel={handleCancelEdit}
        />
      );
    }
    
    return (
      <Box key={comment.id}>
        {/* 댓글 본문 */}
        <DocComment
          comment={comment}
          currentUserId={currentUser?.id}
          onReply={(commentId, targetDepth) =>
            handleStartReply(commentId, targetDepth, comment.userName)
          }
          onEdit={() => handleStartEdit(comment.id)}
          onDelete={() => handleDelete(comment.id, parentId)}
          onHide={() => handleHide(comment.id, parentId)}
          onLike={() => handleLike(comment.id, comment.parentId)}
          isExpanded={expandedComments.has(comment.id)}
          onToggleReplies={handleToggleReplies}  // 이 줄 추가
        />
        
        {/* 대댓글 펼침 영역 */}
        {comment.depth < 2 && isExpanded && replies.length > 0 && (
          <VStack align="stretch" gap={0} ml={{ base: 4, md: 8 }}>
            {replies.map((reply) => renderComment(reply, comment.id))}
          </VStack>
        )}
        
        {/* 답글 작성 폼 (이 댓글에 대한 답글 작성 중일 때) */}
        {replyTarget?.parentId === comment.id && (
          <CreateComment
            documentId={documentId}
            parentId={replyTarget.parentId}
            depth={replyTarget.depth}
            replyToUserName={replyTarget.userName}
            currentUser={
              currentUser
                ? {
                  id: currentUser.id,
                  name: currentUser.username,
                  profileImg: currentUser.avatarUrl,
                }
                : undefined
            }
            onSubmitSuccess={handleCreateSuccess}
            onCancel={handleCancelReply}
            isCompact
          />
        )}
      </Box>
    );
  };
  
  return (
    <Box borderTop="1px solid" borderColor="whiteAlpha.100" mt={8}>
      {/* 헤더 */}
      <Box py={4} px={4}>
        <Text fontSize="lg" fontWeight="600" style={{ color: "#ffffff" }}>
          댓글 {totalCount > 0 && `${totalCount}개`}
        </Text>
      </Box>
      
      {/* 댓글 작성 폼 (최상위) */}
      <CreateComment
        documentId={documentId}
        currentUser={
          currentUser
            ? {
              id: currentUser.id,
              name: currentUser.username,
              profileImg: currentUser.avatarUrl,
            }
            : undefined
        }
        onSubmitSuccess={handleCreateSuccess}
      />
      
      {/* 댓글 목록 */}
      <VStack align="stretch" gap={0}>
        {isLoading ? (
          <Box py={8} textAlign="center">
            <Spinner size="lg" color="#7fb89a" />
          </Box>
        ) : comments.length === 0 ? (
          <Box py={8} textAlign="center">
            <Text style={{ color: "#94a3a0" }}>아직 댓글이 없습니다. 첫 댓글을 작성해보세요!</Text>
          </Box>
        ) : (
          comments.map((comment) => renderComment(comment))
        )}
      </VStack>

      {/* 더보기 버튼 */}
      {hasNextPage && (
        <Box py={4} textAlign="center">
          <Button
            variant="ghost"
            color="#b6d4c1"
            _hover={{ bg: "rgba(46, 87, 62, 0.18)", color: "#d8ead8" }}
            onClick={handleLoadMore}
            loading={isFetchingNextPage}
            disabled={isFetchingNextPage}
          >
            댓글 더보기
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default CommentSection;