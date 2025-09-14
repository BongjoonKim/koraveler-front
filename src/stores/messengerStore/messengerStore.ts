// src/stores/messengerStore/messengerStore.ts
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type {
  UserSummary,
  Channel,
  Message,
  ChannelMember
} from '../../types/messenger/messengerTypes';

// =========================
// 기본 상태 Atoms (메시지 관련 제거)
// =========================

// 현재 사용자 정보 (로컬 스토리지에 저장)
export const currentUserAtom = atomWithStorage<UserSummary | null>('currentUser', null);

// 선택된 채널
export const selectedChannelAtom = atom<Channel | null>(null);

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

// 온라인 사용자 목록
export const onlineUsersAtom = atom<Set<string>>(new Set<string>());

// =========================
// 인터랙션 상태 Atoms
// =========================

// 컨텍스트 메뉴 상태
export const contextMenuAtom = atom<{
  visible: boolean;
  x: number;
  y: number;
  message: Message | null;
}>({
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
export const searchStateAtom = atom<{
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
}>({
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
export const uploadProgressAtom = atom<Record<string, {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'failed';
  url?: string;
}>>({});

// 드래그 앤 드롭 상태
export const isDraggingFileAtom = atom<boolean>(false);

// =========================
// 음성 녹음 관련 Atoms
// =========================

// 음성 녹음 상태
export const voiceRecordingAtom = atom<{
  isRecording: boolean;
  audioBlob?: Blob;
  duration: number;
  recordingStartTime?: number;
}>({
  isRecording: false,
  duration: 0
});

// =========================
// 설정 관련 Atoms (로컬 스토리지 저장)
// =========================

// 사용자 설정
export const userSettingsAtom = atomWithStorage('userSettings', {
  theme: 'light' as 'light' | 'dark' | 'system',
  notifications: {
    desktop: true,
    sound: true,
    mentions: true,
    directMessages: true
  },
  chat: {
    sendOnEnter: true,
    showTimestamps: true,
    compactMode: false,
    showAvatars: true,
    fontSize: 'medium' as 'small' | 'medium' | 'large'
  },
  language: 'ko' as 'ko' | 'en',
  privacy: {
    showOnlineStatus: true,
    allowDirectMessages: true,
    showReadReceipts: true
  }
});

// =========================
// WebSocket 이벤트 처리 Atoms
// =========================

// WebSocket 메시지 수신 이벤트
export const websocketMessageReceivedAtom = atom<{
  channelId: string;
  messageId: string;
  timestamp: number;
} | null>(null);

// WebSocket 메시지 업데이트 이벤트
export const websocketMessageUpdatedAtom = atom<{
  channelId: string;
  messageId: string;
  timestamp: number;
} | null>(null);

// WebSocket 메시지 삭제 이벤트
export const websocketMessageDeletedAtom = atom<{
  channelId: string;
  messageId: string;
  timestamp: number;
} | null>(null);

// =========================
// Derived Atoms (계산된 값들)
// =========================

// 현재 타이핑 중인 다른 사용자들 (자신 제외)
export const otherTypingUsersAtom = atom((get) => {
  const typingUsers = get(typingUsersAtom);
  const currentUser = get(currentUserAtom);
  
  if (!currentUser) return typingUsers;
  
  return typingUsers.filter(username => username !== currentUser.username);
});

// 검색 결과가 있는지 여부
export const hasSearchResultsAtom = atom((get) => {
  const searchState = get(searchStateAtom);
  return searchState.results.length > 0;
});

// 현재 업로드 중인 파일이 있는지 여부
export const hasUploadingFilesAtom = atom((get) => {
  const uploadingFiles = get(uploadingFilesAtom);
  return uploadingFiles.length > 0;
});

// =========================
// Action Atoms (UI 액션들)
// =========================

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
  (get, set, fileId: string, progress: Partial<{
    file: File;
    progress: number;
    status: 'uploading' | 'completed' | 'failed';
    url?: string;
  }>) => {
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

// 채널 변경 시 UI 상태 초기화
export const changeChannelAtom = atom(
  null,
  (get, set, channel: Channel | null) => {
    set(selectedChannelAtom, channel);
    set(typingUsersAtom, []);
    set(messageInputAtom, '');
    set(mentionedUsersAtom, []);
    set(editingMessageIdAtom, null);
    set(replyToMessageAtom, null);
    set(contextMenuAtom, { visible: false, x: 0, y: 0, message: null });
  }
);

// 로그아웃 시 모든 상태 초기화
export const logoutAtom = atom(
  null,
  (get, set) => {
    set(currentUserAtom, null);
    set(selectedChannelAtom, null);
    set(socketConnectedAtom, false);
    set(typingUsersAtom, []);
    set(onlineUsersAtom, new Set());
    set(messageInputAtom, '');
    set(mentionedUsersAtom, []);
    set(uploadingFilesAtom, []);
    set(uploadProgressAtom, {});
    set(searchStateAtom, { query: '', filters: {}, results: [], isLoading: false });
  }
);

// WebSocket 메시지 수신 트리거
export const triggerMessageRefetchAtom = atom(
  null,
  (get, set, channelId: string) => {
    // WebSocket 메시지 수신 시 타임스탬프 업데이트
    set(websocketMessageReceivedAtom, {
      channelId,
      messageId: '',
      timestamp: Date.now()
    });
  }
);