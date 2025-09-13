// src/hooks/useChatManager.ts
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import type { Channel, Message, ChannelMember } from '../types/messenger/messengerTypes';
import {
  selectedChannelAtom,
  messagesAtom,
  channelMembersAtom,
  messageInputAtom,
  mentionedUsersAtom,
  socketConnectedAtom,
  currentUserAtom,
  addMessageAtom
} from '../stores/messengerStore/messengerStore';
import {
  useChannelMembers,
  useChannelMessages,
  useMarkAsRead,
  useMultipleFileUpload,
  useMyChannels,
  useSendMessage
} from "./useMessengerQueries";
import { useCurrentUser } from './useCurrentUser'; // 추가

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
}

export const useChatManager = (): ChatManagerReturn => {
  // Atoms
  const [selectedChannel, setSelectedChannel] = useAtom(selectedChannelAtom);
  const [messages, setMessages] = useAtom(messagesAtom);
  const [channelMembers, setChannelMembers] = useAtom(channelMembersAtom);
  const [messageInput, setMessageInput] = useAtom(messageInputAtom);
  const [mentionedUsers, setMentionedUsers] = useAtom(mentionedUsersAtom);
  const [isSocketConnected] = useAtom(socketConnectedAtom);
  const [, addMessage] = useAtom(addMessageAtom);
  
  // 현재 사용자 정보 가져오기
  const currentUser = useCurrentUser();
  
  // Queries
  const { data: channelsData } = useMyChannels();
  const channelId = selectedChannel?.id ?? null;
  const { data: messagesData } = useChannelMessages(channelId);
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
  
  // 메시지 데이터 동기화
  useEffect(() => {
    if (messagesData?.messages && currentUser) {
      const messagesWithFlags = messagesData.messages.map(msg => ({
        ...msg,
        isMyMessage: msg.userId === currentUser.id
      }));
      setMessages(messagesWithFlags);
    }
  }, [messagesData, currentUser?.id, setMessages]);
  
  // 멤버 데이터 동기화
  useEffect(() => {
    if (membersData) {
      setChannelMembers(membersData);
    }
  }, [membersData, setChannelMembers]);
  
  const handleSendMessage = (): void => {
    // 유효성 검사
    if (!messageInput.trim() || !selectedChannel || !currentUser) {
      if (!currentUser) {
        console.warn('사용자 정보를 불러오는 중입니다...');
      }
      return;
    }
    
    const tempId = `temp-${Date.now()}`;
    const messageText = messageInput.trim();
    const mentionedUsersList = [...mentionedUsers];
    
    // 낙관적 업데이트용 임시 메시지
    const tempMessage: Message = {
      id: tempId,
      channelId: selectedChannel.id,
      message: messageText,
      userId: currentUser.id,
      userNickname: currentUser.nickname || currentUser.username,
      userAvatarUrl: currentUser.avatarUrl,
      messageType: 'TEXT',
      status: 'SENT',
      isEdited: false,
      isPinned: false,
      isSystemMessage: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reactions: [],
      attachments: [],
      mentionedUserIds: mentionedUsersList,
      isMyMessage: true
    };
    
    // 즉시 UI 업데이트
    setMessages(prev => [...prev, tempMessage]);
    
    // 입력 필드 초기화
    setMessageInput('');
    setMentionedUsers([]);
    
    // 서버로 전송
    sendMessageMutation.mutate(
      {
        channelId: selectedChannel.id,
        message: messageText,
        messageType: 'TEXT',
        mentionedUserIds: mentionedUsersList,
        clientId: tempId
      },
      {
        onSuccess: (response) => {
          // 임시 메시지를 실제 메시지로 교체
          setMessages(prev =>
            prev.map(msg =>
              msg.id === tempId
                ? { ...response.data, isMyMessage: true }
                : msg
            )
          );
        },
        onError: (error) => {
          // 실패 시 메시지 상태 업데이트
          setMessages(prev =>
            prev.map(msg =>
              msg.id === tempId
                ? { ...msg, status: 'FAILED' as const }
                : msg
            )
          );
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
    channelMembers,
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
  };
};