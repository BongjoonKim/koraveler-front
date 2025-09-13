// src/types/messenger/messengerTypes.ts

export interface Channel {
  id: string;
  name: string;
  description?: string;
  channelType: 'PUBLIC' | 'PRIVATE' | 'DIRECT_MESSAGE' | 'GROUP' | 'ANNOUNCEMENT';
  avatarUrl?: string;
  topic?: string;
  tags?: string[];
  memberCount: number;
  lastMessageAt?: string;
  isArchived: boolean;
  isReadOnly: boolean;
  createdAt: string;
  updatedAt: string;
  isMember?: boolean;
  isMuted?: boolean;
  unreadMessageCount?: number;
  myRole?: string;
  lastMessage?: Message;
}

export interface Message {
  id: string;
  channelId: string;
  message: string;
  userId: string;
  userNickname?: string;
  userAvatarUrl?: string;
  messageType: 'TEXT' | 'IMAGE' | 'FILE' | 'AUDIO' | 'VIDEO' | 'SYSTEM' | 'EMOJI_ONLY' | 'VOICE_NOTE';
  status: 'SENT' | 'DELIVERED' | 'READ' | 'DELETED' | 'EDITED' | 'FAILED';
  parentMessageId?: string;
  parentMessage?: Message;
  attachments?: MessageAttachment[];
  thumbnailUrl?: string;
  isEdited: boolean;
  isPinned: boolean;
  mentionedUserIds?: string[];
  mentionedUsers?: UserSummary[];
  isSystemMessage: boolean;
  reactions?: MessageReaction[];
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
  author?: UserSummary;
  replyCount?: number;
  isMyMessage?: boolean;
}

export interface MessageAttachment {
  id: string;
  fileName: string;
  originalFileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  width?: number;
  height?: number;
  duration?: number;
}

export interface MessageReaction {
  emoji: string;
  count: number;
  users: UserSummary[];
  isMyReaction: boolean;
}

// API 응답 래퍼 타입
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// 페이지네이션 응답 타입
export interface PaginatedResponse<T> {
  items: T[];
  hasNext: boolean;
  nextCursor?: string;
  totalCount: number;
}

// 메시지 관련 응답 타입들
export interface MessageListApiResponse extends ApiResponse<MessageListResponse> {}

export interface ChannelListApiResponse extends ApiResponse<ChannelListResponse> {}

export interface MessageApiResponse extends ApiResponse<Message> {}

export interface ChannelApiResponse extends ApiResponse<Channel> {}

export interface ChannelMemberListApiResponse extends ApiResponse<ChannelMember[]> {}

// 파일 업로드 응답
export interface FileUploadResponse {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export interface ChannelMember {
  id: string;
  userId: string;
  nickname?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED' | 'LEFT' | 'PENDING_APPROVAL';
  joinedAt: string;
  lastSeenAt: string;
  lastReadMessageId?: string;
  notificationLevel: 'ALL' | 'MENTIONS_ONLY' | 'NONE';
  isMuted: boolean;
  mutedUntil?: string;
  user: UserSummary;
  roleId?: string;
  roleName?: string;
  isOnline: boolean;
}

export interface UserSummary {
  id: string;
  username: string;
  nickname?: string;
  avatarUrl?: string;
  isOnline: boolean;
}

export interface ChannelListResponse {
  channels: Channel[];
  totalCount: number;
  hasNext: boolean;
  nextCursor?: string;    // cursor 기반 페이징용 (선택적)
  currentPage?: number;   // ✅ 추가: 현재 페이지 번호
  totalPages?: number;    // ✅ 추가: 전체 페이지 수
}

// MessageListResponse 수정
export interface MessageListResponse {
  messages: Message[];
  hasNext: boolean;
  nextCursor?: string;    // cursor 기반 페이징용 (선택적)
  currentPage?: number;   // ✅ 추가: 현재 페이지 번호
  totalPages?: number;    // ✅ 추가: 전체 페이지 수
  totalCount: number;
}

// 요청 타입들
export interface ChannelCreateRequest {
  name: string;
  description?: string;
  channelType: Channel['channelType'];
  password?: string;
  requiresApproval?: boolean;
  maxMembers?: number;
  topic?: string;
  tags?: string[];
  initialMemberIds?: string[];
}

export interface ChannelUpdateRequest {
  name?: string;
  description?: string;
  topic?: string;
  tags?: string[];
  avatarUrl?: string;
  isReadOnly?: boolean;
  maxMembers?: number;
}

export interface MessageCreateRequest {
  channelId: string;
  message: string;
  messageType: Message['messageType'];
  parentMessageId?: string;
  attachments?: AttachmentRequest[];
  mentionedUserIds?: string[];
  clientId?: string;
}

export interface AttachmentRequest {
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  width?: number;
  height?: number;
  duration?: number;
}

export interface MessageUpdateRequest {
  message: string;
}

export interface MessageReactionRequest {
  emoji: string;
  isAdd: boolean;
}

// MessageSearchRequest 타입 수정
export interface MessageSearchRequest {
  keyword?: string;
  userId?: string;
  messageType?: Message['messageType'];
  startDate?: string;
  endDate?: string;
  hasAttachments?: boolean;
  isPinned?: boolean;
  page?: number;        // ✅ 추가: 페이지 번호
  size?: number;
  cursor?: string;
  sortBy?: string;
  sortDirection?: string;
}

// PageRequest 타입 수정
export interface PageRequest {
  page?: number;        // ✅ 추가: 페이지 번호 (0부터 시작)
  size?: number;
  cursor?: string;      // cursor 기반 페이징도 지원 (선택적)
  sortBy?: string;
  sortDirection?: string;
}

// WebSocket 이벤트 타입들
export interface WebSocketMessage {
  type: 'MESSAGE' | 'TYPING' | 'USER_JOINED' | 'USER_LEFT' | 'CHANNEL_UPDATED';
  data: any;
  channelId?: string;
  userId?: string;
  timestamp: string;
}

export interface TypingEvent {
  userId: string;
  username: string;
  channelId: string;
  isTyping: boolean;
}

// 에러 타입
export interface ChatError {
  code: string;
  message: string;
  details?: Record<string, string>;
  timestamp: string;
}