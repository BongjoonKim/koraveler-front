// src/hooks/useTravelMessenger.ts
import {useState, useRef, useEffect, useCallback, useLayoutEffect} from 'react';
import { useAtom } from 'jotai';
import { createToaster } from '@chakra-ui/react';
import {
  selectedChannelAtom,
  showMemberListAtom
} from '../stores/messengerStore/messengerStore';
import { useChatManager } from './useChatManager';
import { useWebSocket } from './useWebSocket';
import { useCreateChannel } from './useMessengerQueries';
import type {Channel, Message} from '../types/messenger/messengerTypes';
import {useCurrentUser} from "./useCurrentUser";
import {useNavigate} from "react-router-dom";
import moment from "moment";

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
  const [isMobile, setIsMobile] = useState(false);
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  
  // Hooks
  const {
    channels,
    messages,
    isLoadingMessages,
    isFetchingMore,
    hasMoreMessages,
    fetchNextPage,
    refetchMessages,
    handleSendMessage,
    isSendingMessage
  } = useChatManager();
  
  const { startTyping, stopTyping } = useWebSocket();
  const createChannelMutation = useCreateChannel();
  
  // 메세지 스크롤 감지를 위한 ref
  const scrollContainerRef = useRef<HTMLDivElement>(null!);
  const prevScrollDataRef = useRef<{ height: number; top: number } | null>(null);
  const isInitialLoadRef = useRef(true);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null!);
  
  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    // 초기 로드 시 맨 아래로
    if (isInitialLoadRef.current && messages.length > 0) {
      container.scrollTop = container.scrollHeight;
      isInitialLoadRef.current = false;
      return;
    }
    
    // 이전 메시지 로드 후 스크롤 위치 복원
    if (prevScrollDataRef.current) {
      const { height: prevHeight } = prevScrollDataRef.current;
      const newHeight = container.scrollHeight;
      const heightDiff = newHeight - prevHeight;
      
      if (heightDiff > 0) {
        container.scrollTop = heightDiff;
      }
      prevScrollDataRef.current = null;
    }
  }, [messages])
  
  // 이전 메시지 로드
  const fetchMoreMessages = useCallback(() => {
    if (!hasMoreMessages || isFetchingMore) return;
    
    const container = scrollContainerRef.current;
    if (container) {
      // 현재 스크롤 상태 저장
      prevScrollDataRef.current = {
        height: container.scrollHeight,
        top: container.scrollTop,
      };
    }
    
    fetchNextPage();
  }, [hasMoreMessages, isFetchingMore, fetchNextPage]);
  
  // 무한 스크롤 이벤트 핸들러
  useEffect(() => {
    const trigger = loadMoreTriggerRef.current;
    if (!trigger) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInitialLoadRef.current) {
          fetchMoreMessages();
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(trigger);
    return () => observer.disconnect();
  }, [fetchMoreMessages]);
  // 화면 크기 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // 초기 체크
    checkMobile();
    
    // resize 이벤트 리스너
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // 모바일에서 채널 선택 시 멤버 리스트 닫기
  useEffect(() => {
    if (isMobile && selectedChannel) {
      setShowMemberList(false);
    }
  }, [isMobile, selectedChannel, setShowMemberList]);
  
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
  
  // ref 초기화
  useEffect(() => {
    // 메세지 스크롤 감지를 위한 ref
    isInitialLoadRef.current = true;
    // const scrollContainerRef = useRef<HTMLDivElement>(null!);
    // const prevScrollDataRef = useRef<{ height: number; top: number } | null>(null);
    // const loadMoreTriggerRef = useRef<HTMLDivElement>(null!);
  }, [selectedChannel]);
  
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
    // console.log("채널 선택 ", channel.id,channel)
    setSelectedChannel(channel);
  }, [selectedChannel]);
  
  // 채널 필터링
  const filteredChannels = channels.filter((channel) =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // 모달 관련 핸들러
  const handleOpenCreateModal = useCallback(() => {
    if (currentUser) {
      setShowCreateModal(true);
    } else {
      navigate("/login")
    }
  }, [currentUser]);
  
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
  
  // 모바일에서 표시할 화면 결정
  const shouldShowSidebar = !isMobile || !selectedChannel;
  const shouldShowChat = !isMobile || selectedChannel;
  
  const isSameDay = (inx: number, oldOneDate ?: string, newOneDate ?: string) => {
    // console.log("isSameDay, oldOneDate", oldOneDate)
    // console.log("isSameDay, newOneDate", newOneDate);
    // console.log("moment(newOneDate)",     moment.duration(moment(newOneDate).diff(moment(oldOneDate))).asDays()
    // )
    // moment(newOneDate).subtract(oldOneDate)
    if (inx === 0) {
      return true;
    }
    return !(moment.duration(moment(newOneDate).diff(moment(oldOneDate))).asDays() > 1);
  }
  
  return {
    // Refs
    messagesEndRef,
    scrollContainerRef,
    loadMoreTriggerRef,
    
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
    isFetchingMore,
    hasMoreMessages,
    fetchMoreMessages,
    isSendingMessage,
    isMobile,
    shouldShowSidebar,
    shouldShowChat,
    
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
    isSameDay,
  };
};