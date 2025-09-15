// src/hooks/useTravelMessenger.ts
import { useState, useRef, useEffect, useCallback } from 'react';
import { useAtom } from 'jotai';
import { createToaster } from '@chakra-ui/react';
import {
  selectedChannelAtom,
  showMemberListAtom
} from '../stores/messengerStore/messengerStore';
import { useChatManager } from './useChatManager';
import { useWebSocket } from './useWebSocket';
import { useCreateChannel } from './useMessengerQueries';
import type { Channel } from '../types/messenger/messengerTypes';

const toaster = createToaster({
  placement: 'top-right',
});

interface NewChannelData {
  name: string;
  description: string;
  channelType: 'PUBLIC' | 'PRIVATE' | 'DIRECT_MESSAGE' | 'GROUP' | 'ANNOUNCEMENT';
}

export const useTravelMessenger = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Jotai atoms
  const [selectedChannel, setSelectedChannel] = useAtom(selectedChannelAtom);
  const [showMemberList, setShowMemberList] = useAtom(showMemberListAtom);
  
  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newChannelData, setNewChannelData] = useState<NewChannelData>({
    name: '',
    description: '',
    channelType: 'GROUP'
  });
  
  // Hooks
  const {
    channels,
    messages,
    isLoadingMessages,
    refetchMessages,
    handleSendMessage,
    isSendingMessage
  } = useChatManager();
  
  const { startTyping, stopTyping } = useWebSocket();
  const createChannelMutation = useCreateChannel();
  
  // 메시지 자동 스크롤
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // WebSocket 메시지 수신 시 refetch
  useEffect(() => {
    const handleWebSocketMessage = () => {
      refetchMessages();
    };
    
    // WebSocket 이벤트 리스너는 useWebSocket 훅에서 처리
    return () => {
      // cleanup
    };
  }, [refetchMessages]);
  
  useEffect(() => {
    return () => {
      setSelectedChannel(null)
    }
  }, [])
  
  // 채널 생성 핸들러
  const handleCreateChannel = useCallback(async () => {
    if (!newChannelData.name.trim()) {
      toaster.create({
        title: '채널명을 입력해주세요',
        status: 'warning',
        duration: 2000
      });
      return;
    }
    
    try {
      await createChannelMutation.mutateAsync(newChannelData);
      setShowCreateModal(false);
      setNewChannelData({ name: '', description: '', channelType: 'GROUP' });
      toaster.create({
        title: '채널이 생성되었습니다',
        status: 'success',
        duration: 2000
      });
    } catch (error) {
      console.error('채널 생성 에러:', error);
      toaster.create({
        title: '채널 생성에 실패했습니다',
        status: 'error',
        duration: 2000
      });
    }
  }, [newChannelData, createChannelMutation]);
  
  // 채널 선택 핸들러
  const handleChannelSelect = useCallback((channel: Channel) => {
    setSelectedChannel(channel);
  }, [setSelectedChannel]);
  
  // 채널 필터링
  const filteredChannels = channels.filter((channel) =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // 모달 관련 핸들러
  const handleOpenCreateModal = useCallback(() => {
    setShowCreateModal(true);
  }, []);
  
  const handleCloseCreateModal = useCallback(() => {
    setShowCreateModal(false);
    setNewChannelData({ name: '', description: '', channelType: 'GROUP' });
  }, []);
  
  const handleUpdateChannelData = useCallback((field: string, value: any) => {
    setNewChannelData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);
  
  // 멤버 리스트 토글
  const toggleMemberList = useCallback(() => {
    setShowMemberList(prev => !prev);
  }, [setShowMemberList]);
  
  return {
    // Refs
    messagesEndRef,
    
    // State
    selectedChannel,
    showMemberList,
    searchQuery,
    showCreateModal,
    newChannelData,
    filteredChannels,
    
    // Chat data
    messages,
    isLoadingMessages,
    isSendingMessage,
    
    // Handlers
    handleChannelSelect,
    handleCreateChannel,
    handleOpenCreateModal,
    handleCloseCreateModal,
    handleUpdateChannelData,
    toggleMemberList,
    setSearchQuery,
    setShowMemberList,
    
    // Utils
    createChannelMutation,
    startTyping,
    stopTyping,
  };
};