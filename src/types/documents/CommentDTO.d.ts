export interface CommentDTO {
  id : string;
  documentId : string;
  userId : string;
  userName ?: string;
  userProfileImg ?: string;
  content: string;
  parentId?: string;
  depth : number;
  isDeleted: boolean;
  isEdited: boolean;
  created?: string;
  updated?: string;
  replies?: CommentDTO[];
  likeCount?: number;
  replyCount?: number;
  isLikedByMe?: boolean;
  amIWriter?: boolean;
}