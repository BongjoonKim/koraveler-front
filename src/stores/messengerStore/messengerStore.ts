// src/stores/messengerStore/messengerStore.ts
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// 타입 정의
interface Channel {
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

interface Message {
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

interface MessageAttachment {
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

interface MessageReaction {
  emoji: string;
  count: number;
  users: UserSummary[];
  isMyReaction: boolean;
}

interface ChannelMember {
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

interface UserSummary {
  id: string;
  username: string;
  nickname?: string;
  avatarUrl?: string;
  isOnline: boolean;
}

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  message: Message | null;
}

interface FileUploadProgress {
  [fileId: string]: {
    file: File;
    progress: number;
    status: 'uploading' | 'completed' | 'failed';
    url?: string;
  };
}

interface VoiceRecording {
  isRecording: boolean;
  audioBlob?: Blob;
  duration: number;
  recordingStartTime?: number;
}

interface SearchState {
  query: string;
  filters: {
    messageType?: Message['messageType'];
    userId?: string;
    hasAttachments?: boolean;
    isPinned?: boolean;
    startDate?: string;
    endDate?: string;
  };
  results: Message[];
  isLoading: boolean;
}

// =========================
// 기본 상태 Atoms
// =========================

// 현재 사용자 정보 (로컬 스토리지에 저장)
export const currentUserAtom = atomWithStorage<UserSummary | null>('currentUser', null);

// 선택된 채널
export const selectedChannelAtom = atom<Channel | null>(null);

// 채널 목록
export const channelsAtom = atom<Channel[]>([]);

// 현재 채널의 메시지 목록
export const messagesAtom = atom<Message[]>([]);

// 현재 채널의 멤버 목록
export const channelMembersAtom = atom<ChannelMember[]>([]);

// WebSocket 연결 상태
export const socketConnectedAtom = atom<boolean>(false);

// =========================
// UI 상태 Atoms
// =========================

// 메시지 입력
export const messageInputAtom = atom<string>('');

// 멘션된 사용자들
export const mentionedUsersAtom = atom<string[]>([]);

// 이모지 피커 표시 여부
export const showEmojiPickerAtom = atom<boolean>(false);

// 첨부파일 메뉴 표시 여부
export const showAttachmentsAtom = atom<boolean>(false);

// 멤버 리스트 사이드바 표시 여부
export const showMemberListAtom = atom<boolean>(false);

// 채널 생성 모달 표시 여부
export const showCreateChannelAtom = atom<boolean>(false);

// 채널 설정 모달 표시 여부
export const showChannelSettingsAtom = atom<boolean>(false);

// 사용자 프로필 모달 표시 여부
export const showUserProfileAtom = atom<boolean>(false);

// 검색 모달 표시 여부
export const showSearchModalAtom = atom<boolean>(false);

// 음성 녹음 모달 표시 여부
export const showVoiceRecorderAtom = atom<boolean>(false);

// =========================
// 실시간 상태 Atoms
// =========================

// 현재 타이핑 중인 사용자들
export const typingUsersAtom = atom<string[]>([]);

// 각 채널별 안읽은 메시지 수
export const unreadCountsAtom = atom<Record<string, number>>({});

// 온라인 사용자 목록
export const onlineUsersAtom = atom<Set<string>>(new Set<string>());

// =========================
// 인터랙션 상태 Atoms
// =========================

// 컨텍스트 메뉴 상태
export const contextMenuAtom = atom<ContextMenuState>({
  visible: false,
  x: 0,
  y: 0,
  message: null
});

// 현재 편집 중인 메시지 ID
export const editingMessageIdAtom = atom<string | null>(null);

// 현재 답글 대상 메시지
export const replyToMessageAtom = atom<Message | null>(null);

// =========================
// 검색 관련 Atoms
// =========================

// 검색 상태
export const searchStateAtom = atom<SearchState>({
  query: '',
  filters: {},
  results: [],
  isLoading: false
});

// 검색 히스토리 (로컬 스토리지에 저장)
export const searchHistoryAtom = atomWithStorage<string[]>('searchHistory', []);

// =========================
// 파일 업로드 관련 Atoms
// =========================

// 현재 업로드 중인 파일들
export const uploadingFilesAtom = atom<File[]>([]);

// 파일 업로드 진행률
export const uploadProgressAtom = atom<FileUploadProgress>({});

// 드래그 앤 드롭 상태
export const isDraggingFileAtom = atom<boolean>(false);

// =========================
// 음성 녹음 관련 Atoms
// =========================

// 음성 녹음 상태
export const voiceRecordingAtom = atom<VoiceRecording>({
  isRecording: false,
  duration: 0
});

// =========================
// 설정 관련 Atoms (로컬 스토리지 저장)
// =========================

// 사용자 설정
export const userSettingsAtom = atomWithStorage('userSettings', {
  // 테마 설정
  theme: 'light' as 'light' | 'dark' | 'system',
  
  // 알림 설정
  notifications: {
    desktop: true,
    sound: true,
    mentions: true,
    directMessages: true
  },
  
  // 채팅 설정
  chat: {
    sendOnEnter: true,
    showTimestamps: true,
    compactMode: false,
    showAvatars: true,
    fontSize: 'medium' as 'small' | 'medium' | 'large'
  },
  
  // 언어 설정
  language: 'ko' as 'ko' | 'en',
  
  // 개인정보 설정
  privacy: {
    showOnlineStatus: true,
    allowDirectMessages: true,
    showReadReceipts: true
  }
});

// =========================
// Derived Atoms (계산된 값들)
// =========================

// 현재 채널의 총 안읽은 메시지 수
export const totalUnreadCountAtom = atom((get) => {
  const unreadCounts = get(unreadCountsAtom);
  return Object.values(unreadCounts).reduce((total, count) => total + count, 0);
});

// 현재 채널의 온라인 멤버 수
export const onlineMemberCountAtom = atom((get) => {
  const members = get(channelMembersAtom);
  return members.filter(member => member.isOnline).length;
});

// 검색 결과가 있는지 여부
export const hasSearchResultsAtom = atom((get) => {
  const searchState = get(searchStateAtom);
  return searchState.results.length > 0;
});

// 현재 채널에서 내가 멘션되었는지 여부
export const hasMentionsAtom = atom((get) => {
  const messages = get(messagesAtom);
  const currentUser = get(currentUserAtom);
  
  if (!currentUser) return false;
  
  return messages.some(message =>
    message.mentionedUserIds?.includes(currentUser.id) ||
    message.message.includes(`@${currentUser.username}`)
  );
});

// 현재 업로드 중인 파일이 있는지 여부
export const hasUploadingFilesAtom = atom((get) => {
  const uploadingFiles = get(uploadingFilesAtom);
  return uploadingFiles.length > 0;
});

// 현재 타이핑 중인 다른 사용자들 (자신 제외)
export const otherTypingUsersAtom = atom((get) => {
  const typingUsers = get(typingUsersAtom);
  const currentUser = get(currentUserAtom);
  
  if (!currentUser) return typingUsers;
  
  return typingUsers.filter(username => username !== currentUser.username);
});

// =========================
// Action Atoms (상태 업데이트 액션들)
// =========================

// 메시지 추가 액션
export const addMessageAtom = atom(
  null,
  (get, set, message: Message) => {
    const currentMessages = get(messagesAtom);
    
    // 중복 메시지 방지
    if (currentMessages.some(m => m.id === message.id)) {
      return;
    }
    
    // 메시지를 시간순으로 정렬하여 추가
    const newMessages = [...currentMessages, message].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    
    set(messagesAtom, newMessages);
    
    // 현재 사용자가 보낸 메시지가 아니면 안읽은 수 증가
    const currentUser = get(currentUserAtom);
    const selectedChannel = get(selectedChannelAtom);
    
    if (currentUser && selectedChannel && message.userId !== currentUser.id) {
      const unreadCounts = get(unreadCountsAtom);
      set(unreadCountsAtom, {
        ...unreadCounts,
        [message.channelId]: (unreadCounts[message.channelId] || 0) + 1
      });
    }
  }
);

// 메시지 업데이트 액션
export const updateMessageAtom = atom(
  null,
  (get, set, updatedMessage: Message) => {
    const currentMessages = get(messagesAtom);
    const newMessages = currentMessages.map(message =>
      message.id === updatedMessage.id ? updatedMessage : message
    );
    set(messagesAtom, newMessages);
  }
);

// 메시지 삭제 액션
export const deleteMessageAtom = atom(
  null,
  (get, set, messageId: string) => {
    const currentMessages = get(messagesAtom);
    const newMessages = currentMessages.filter(message => message.id !== messageId);
    set(messagesAtom, newMessages);
  }
);

// 채널 읽음 처리 액션
export const markChannelAsReadAtom = atom(
  null,
  (get, set, channelId: string) => {
    const unreadCounts = get(unreadCountsAtom);
    const newUnreadCounts = { ...unreadCounts };
    delete newUnreadCounts[channelId];
    set(unreadCountsAtom, newUnreadCounts);
  }
);

// 타이핑 시작 액션
export const startTypingAtom = atom(
  null,
  (get, set, username: string) => {
    const currentTypingUsers = get(typingUsersAtom);
    if (!currentTypingUsers.includes(username)) {
      set(typingUsersAtom, [...currentTypingUsers, username]);
    }
  }
);

// 타이핑 중지 액션
export const stopTypingAtom = atom(
  null,
  (get, set, username: string) => {
    const currentTypingUsers = get(typingUsersAtom);
    set(typingUsersAtom, currentTypingUsers.filter(user => user !== username));
  }
);

// 사용자 온라인 상태 업데이트 액션
export const updateUserOnlineStatusAtom = atom(
  null,
  (get, set, userId: string, isOnline: boolean) => {
    const onlineUsers = get(onlineUsersAtom);
    const newOnlineUsers = new Set(onlineUsers);
    
    if (isOnline) {
      newOnlineUsers.add(userId);
    } else {
      newOnlineUsers.delete(userId);
    }
    
    set(onlineUsersAtom, newOnlineUsers);
    
    // 채널 멤버 목록의 온라인 상태도 업데이트
    const channelMembers = get(channelMembersAtom);
    const updatedMembers = channelMembers.map(member =>
      member.userId === userId ? { ...member, isOnline } : member
    );
    set(channelMembersAtom, updatedMembers);
  }
);

// 검색 쿼리 업데이트 액션
export const updateSearchQueryAtom = atom(
  null,
  (get, set, query: string) => {
    const currentSearchState = get(searchStateAtom);
    set(searchStateAtom, {
      ...currentSearchState,
      query
    });
    
    // 검색 히스토리에 추가 (중복 제거)
    if (query.trim() && query.length >= 2) {
      const searchHistory = get(searchHistoryAtom);
      const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 10);
      set(searchHistoryAtom, newHistory);
    }
  }
);

// 파일 업로드 진행률 업데이트 액션
export const updateUploadProgressAtom = atom(
  null,
  (get, set, fileId: string, progress: Partial<FileUploadProgress[string]>) => {
    const currentProgress = get(uploadProgressAtom);
    set(uploadProgressAtom, {
      ...currentProgress,
      [fileId]: {
        ...currentProgress[fileId],
        ...progress
      }
    });
  }
);

// =========================
// 초기화 및 정리 액션들
// =========================

// 채널 변경 시 상태 초기화
export const changeChannelAtom = atom(
  null,
  (get, set, channel: Channel | null) => {
    set(selectedChannelAtom, channel);
    set(messagesAtom, []);
    set(channelMembersAtom, []);
    set(typingUsersAtom, []);
    set(messageInputAtom, '');
    set(mentionedUsersAtom, []);
    set(editingMessageIdAtom, null);
    set(replyToMessageAtom, null);
    set(contextMenuAtom, { visible: false, x: 0, y: 0, message: null });
    
    // 현재 채널의 안읽은 메시지 수 초기화
    if (channel) {
      set(markChannelAsReadAtom, channel.id);
    }
  }
);

// 로그아웃 시 모든 상태 초기화
export const logoutAtom = atom(
  null,
  (get, set) => {
    set(currentUserAtom, null);
    set(selectedChannelAtom, null);
    set(channelsAtom, []);
    set(messagesAtom, []);
    set(channelMembersAtom, []);
    set(socketConnectedAtom, false);
    set(typingUsersAtom, []);
    set(unreadCountsAtom, {});
    set(onlineUsersAtom, new Set());
    set(messageInputAtom, '');
    set(mentionedUsersAtom, []);
    set(uploadingFilesAtom, []);
    set(uploadProgressAtom, {});
    set(searchStateAtom, { query: '', filters: {}, results: [], isLoading: false });
  }
);

export default {
  // 기본 상태
  currentUserAtom,
  selectedChannelAtom,
  channelsAtom,
  messagesAtom,
  channelMembersAtom,
  socketConnectedAtom,
  
  // UI 상태
  messageInputAtom,
  mentionedUsersAtom,
  showEmojiPickerAtom,
  showAttachmentsAtom,
  showMemberListAtom,
  showCreateChannelAtom,
  showChannelSettingsAtom,
  showUserProfileAtom,
  showSearchModalAtom,
  showVoiceRecorderAtom,
  
  // 실시간 상태
  typingUsersAtom,
  unreadCountsAtom,
  onlineUsersAtom,
  
  // 인터랙션 상태
  contextMenuAtom,
  editingMessageIdAtom,
  replyToMessageAtom,
  
  // 검색
  searchStateAtom,
  searchHistoryAtom,
  
  // 파일 업로드
  uploadingFilesAtom,
  uploadProgressAtom,
  isDraggingFileAtom,
  
  // 음성 녹음
  voiceRecordingAtom,
  
  // 설정
  userSettingsAtom,
  
  // Derived atoms
  totalUnreadCountAtom,
  onlineMemberCountAtom,
  hasSearchResultsAtom,
  hasMentionsAtom,
  hasUploadingFilesAtom,
  otherTypingUsersAtom,
  
  // Action atoms
  addMessageAtom,
  updateMessageAtom,
  deleteMessageAtom,
  markChannelAsReadAtom,
  startTypingAtom,
  stopTypingAtom,
  updateUserOnlineStatusAtom,
  updateSearchQueryAtom,
  updateUploadProgressAtom,
  changeChannelAtom,
  logoutAtom
};