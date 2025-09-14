// src/hooks/useChatManager.ts
import { useAtom } from 'jotai';
import { useEffect } from 'react';
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
  refetchMessages: () => void;
}

export const useChatManager = (): ChatManagerReturn => {
  // Atoms (메시지는 제거)
  const [selectedChannel, setSelectedChannel] = useAtom(selectedChannelAtom);
  const [messageInput, setMessageInput] = useAtom(messageInputAtom);
  const [mentionedUsers, setMentionedUsers] = useAtom(mentionedUsersAtom);
  const [isSocketConnected] = useAtom(socketConnectedAtom);
  
  // 현재 사용자 정보
  const currentUser = useCurrentUser();
  
  // Queries
  const { data: channelsData } = useMyChannels();
  const channelId = selectedChannel?.id ?? null;
  
  // 메시지는 TanStack Query로만 관리
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    refetch: refetchMessages
  } = useChannelMessages(channelId);
  
  const { data: membersData } = useChannelMembers(channelId);
  
  // Mutations
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkAsRead();
  const fileUploadMutation = useMultipleFileUpload();
  
  // 채널 변경 시 읽음 처리
  useEffect(() => {
    if (selectedChannel) {
      markAsReadMutation.mutate({ channelId: selectedChannel.id });
    }
  }, [selectedChannel?.id]);
  
  // 메시지 데이터 가공 (isMyMessage 플래그 추가)
  const messages = messagesData?.messages?.map(msg => ({
    ...msg,
    isMyMessage: currentUser ? msg.userId === currentUser.id : false
  })) || [];
  
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
    messages, // TanStack Query에서 가져온 메시지
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
    refetchMessages,
  };
};