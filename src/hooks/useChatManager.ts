// src/hooks/useChatManager.ts
import { useAtom } from 'jotai';
import {useEffect, useMemo, useRef} from 'react';
import type { Channel, Message, ChannelMember } from '../types/messenger/messengerTypes';
import {
  selectedChannelAtom,
  messageInputAtom,
  mentionedUsersAtom,
  socketConnectedAtom,
} from '../stores/messengerStore/messengerStore';
import {
  useChannelMembers,
  useChannelMessages,
  useMarkAsRead,
  useMultipleFileUpload,
  useMyChannels,
  useSendMessage
} from "./useMessengerQueries";
import { useCurrentUser } from './useCurrentUser';

interface ChatManagerReturn {
  selectedChannel: Channel | null;
  setSelectedChannel: (channel: Channel | null) => void;
  messages: Message[];
  channelMembers: ChannelMember[];
  messageInput: string;
  setMessageInput: (input: string) => void;
  mentionedUsers: string[];
  setMentionedUsers: (users: string[]) => void;
  isSocketConnected: boolean;
  channels: Channel[];
  handleSendMessage: () => void;
  handleFileUpload: (files: File[]) => void;
  isSendingMessage: boolean;
  isUploadingFiles: boolean;
  isLoadingMessages: boolean;
  isFetchingMore : boolean;
  hasMoreMessages : boolean;
  // fetchMoreMessages: () => void;
  refetchMessages: () => void;
  fetchNextPage: () => void;
}

export const useChatManager = (): ChatManagerReturn => {
  // Atoms (메시지는 제거)
  const [selectedChannel, setSelectedChannel] = useAtom(selectedChannelAtom);
  const [messageInput, setMessageInput] = useAtom(messageInputAtom);
  const [mentionedUsers, setMentionedUsers] = useAtom(mentionedUsersAtom);
  const [isSocketConnected] = useAtom(socketConnectedAtom);
  
  // 메세지 새로 조회하기
  const prevMessagesRef = useRef<Message[]>([]);
  const prevTotalCntRef = useRef<number>(0);
  
  
  // 현재 사용자 정보
  const currentUser = useCurrentUser();
  
  // Queries
  const { data: channelsData } = useMyChannels();
  
  // 메시지는 TanStack Query로만 관리
  const {
    data: messagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingMessages,
    refetch: refetchMessages
  } = useChannelMessages(selectedChannel?.id ?? null);
  
  // console.log("selectedChannelId in useChatManager", selectedChannel?.id)
  
  const { data: membersData } = useChannelMembers(selectedChannel?.id ?? null);
  
  // Mutations
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkAsRead();
  const fileUploadMutation = useMultipleFileUpload();
  
  const messages = useMemo(() => {
    if (!messagesData?.pages) return prevMessagesRef.current;
    
    const allMessages = messagesData.pages
      .slice()
      .reverse()
      .flatMap(page => page.messages || []);
    
    const currentTotalCnt = allMessages.length;
    const prevTotalCnt = prevTotalCntRef.current;
    
    // 페이지 수가 같으면 기존 배열 반환 (변경 없음)
    if (currentTotalCnt === prevTotalCnt && prevMessagesRef.current.length > 0) {
      return prevMessagesRef.current;
    }
    
    prevTotalCntRef.current = currentTotalCnt;
    prevMessagesRef.current = allMessages;
    // console.log("allMessages", allMessages)
    return allMessages;
  }, [messagesData]);
  
  // 채널 변경 시 읽음 처리
  useEffect(() => {
    if (selectedChannel) {
      markAsReadMutation.mutate({ channelId: selectedChannel.id });
      prevMessagesRef.current = [];
      prevTotalCntRef.current = 0;
    }
  }, [selectedChannel?.id]);
  
  const handleSendMessage = (): void => {
    if (!messageInput.trim() || !selectedChannel || !currentUser) {
      if (!currentUser) {
        console.warn('사용자 정보를 불러오는 중입니다...');
      }
      return;
    }
    
    const messageText = messageInput.trim();
    const mentionedUsersList = [...mentionedUsers];
    const clientId = `temp-${Date.now()}`;
    
    // 입력 필드 초기화 (낙관적 업데이트)
    setMessageInput('');
    setMentionedUsers([]);
    
    // 서버로 전송
    sendMessageMutation.mutate(
      {
        channelId: selectedChannel.id,
        message: messageText,
        messageType: 'TEXT',
        mentionedUserIds: mentionedUsersList,
        clientId
      },
      {
        onSuccess: () => {
          // 성공 시 메시지 목록 새로고침
          refetchMessages();
        },
        onError: (error) => {
          // 실패 시 입력 필드 복구
          setMessageInput(messageText);
          setMentionedUsers(mentionedUsersList);
          console.error('메시지 전송 실패:', error);
        }
      }
    );
  };
  
  const handleFileUpload = (files: File[]): void => {
    if (!selectedChannel || !currentUser) return;
    
    fileUploadMutation.mutate(files, {
      onSuccess: (uploadedFiles) => {
        console.log('파일 업로드 성공:', uploadedFiles);
        // 파일 업로드 후 메시지 목록 새로고침
        refetchMessages();
      },
      onError: (error) => {
        console.error('파일 업로드 실패:', error);
      }
    });
  };
  
  return {
    selectedChannel,
    setSelectedChannel,
    messages,
    channelMembers: membersData || [],
    messageInput,
    setMessageInput,
    mentionedUsers,
    setMentionedUsers,
    isSocketConnected,
    channels: channelsData?.channels || [],
    handleSendMessage,
    handleFileUpload,
    isSendingMessage: sendMessageMutation.isPending,
    isUploadingFiles: fileUploadMutation.isPending,
    isLoadingMessages,
    isFetchingMore : isFetchingNextPage,
    hasMoreMessages: hasNextPage ?? false,
    refetchMessages,
    fetchNextPage,
  };
};