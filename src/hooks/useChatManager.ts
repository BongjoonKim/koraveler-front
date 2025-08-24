// src/hooks/useChatManager.ts - 수정된 버전
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import type { Channel, Message, ChannelMember } from '../types/messenger/messengerTypes';
import {
  selectedChannelAtom,
  messagesAtom,
  channelMembersAtom,
  messageInputAtom,
  mentionedUsersAtom,
  socketConnectedAtom
} from '../stores/messengerStore/messengerStore';
import {
  useChannelMembers,
  useChannelMessages,
  useMarkAsRead,
  useMultipleFileUpload,
  useMyChannels,
  useSendMessage
} from "./useMessengerQueries";

// 반환 타입을 명시적으로 정의
interface ChatManagerReturn {
  // 상태
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
  
  // 액션
  handleSendMessage: () => void;
  handleFileUpload: (files: File[]) => void;
  
  // 뮤테이션 상태
  isSendingMessage: boolean;
  isUploadingFiles: boolean;
}

export const useChatManager = (): ChatManagerReturn => {
  const [selectedChannel, setSelectedChannel] = useAtom(selectedChannelAtom);
  const [messages, setMessages] = useAtom(messagesAtom);
  const [channelMembers, setChannelMembers] = useAtom(channelMembersAtom);
  const [messageInput, setMessageInput] = useAtom(messageInputAtom);
  const [mentionedUsers, setMentionedUsers] = useAtom(mentionedUsersAtom);
  const [isSocketConnected] = useAtom(socketConnectedAtom);
  
  const { data: channelsData } = useMyChannels();
  
  // string | undefined를 string | null로 변환
  const channelId = selectedChannel?.id ?? null;
  const { data: messagesData } = useChannelMessages(channelId);
  const { data: membersData } = useChannelMembers(channelId);
  
  // 모든 뮤테이션을 최상위 레벨에서 선언
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkAsRead();
  const fileUploadMutation = useMultipleFileUpload(); // 여기로 이동
  
  // 선택된 채널이 변경될 때
  useEffect(() => {
    if (selectedChannel) {
      // 안읽은 메시지 읽음 처리
      markAsReadMutation.mutate({ channelId: selectedChannel.id });
    }
  }, [selectedChannel, markAsReadMutation]);
  
  // 메시지 데이터 동기화
  useEffect(() => {
    if (messagesData?.pages) {
      const allMessages = messagesData.pages.flatMap(page => page.messages);
      setMessages(allMessages);
    }
  }, [messagesData, setMessages]);
  
  // 멤버 데이터 동기화
  useEffect(() => {
    if (membersData) {
      setChannelMembers(membersData);
    }
  }, [membersData, setChannelMembers]);
  
  const handleSendMessage = (): void => {
    if (messageInput.trim() && selectedChannel) {
      sendMessageMutation.mutate({
        channelId: selectedChannel.id,
        message: messageInput.trim(),
        messageType: 'TEXT',
        mentionedUserIds: mentionedUsers
      });
      setMessageInput('');
      setMentionedUsers([]);
    }
  };
  
  const handleFileUpload = (files: File[]): void => {
    // Hook을 함수 내부가 아닌 최상위에서 선언했으므로 이제 사용만 함
    fileUploadMutation.mutate(files);
  };
  
  return {
    // 상태
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
    
    // 액션
    handleSendMessage,
    handleFileUpload,
    
    // 뮤테이션 상태
    isSendingMessage: sendMessageMutation.isPending,
    isUploadingFiles: fileUploadMutation.isPending, // 파일 업로드 상태 추가
  };
};