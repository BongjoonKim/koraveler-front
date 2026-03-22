import { useState, useCallback, useEffect, useRef, useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { createToaster } from "@chakra-ui/react";
import { selectedChannelAtom, showMemberListAtom } from "../../../../stores/messengerStore/messengerStore";
import { useChatManager } from "../../../../hooks/useChatManager";
import { useWebSocket } from "../../../../hooks/useWebSocket";
import {
  useGetTravelChannels,
  useCreateTravelChannel,
  useDeleteTravelChannel,
} from "../../../../hooks/useTravelChannelQueries";
import { useGetTravel } from "../../../../hooks/useTravelQueries";
import type { TravelChannelResponse, TravelChannelCreateRequest } from "../../../../types/travel/travelChannelTypes";
import type { Channel } from "../../../../types/messenger/messengerTypes";
import moment from "moment";

const toaster = createToaster({ placement: "top-right" });

export const useTravelChat = () => {
  const { travelId } = useParams<{ travelId: string }>();
  const navigate = useNavigate();

  // Jotai atoms
  const [selectedChannel, setSelectedChannel] = useAtom(selectedChannelAtom);
  const [showMemberList, setShowMemberList] = useAtom(showMemberListAtom);

  // Local state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedTravelChannel, setSelectedTravelChannel] = useState<TravelChannelResponse | null>(null);

  // Travel & Channel 데이터
  const { data: travel } = useGetTravel(travelId);
  const { data: travelChannels, isLoading: isLoadingChannels } = useGetTravelChannels(travelId);
  const createChannelMutation = useCreateTravelChannel(travelId || "");
  const deleteChannelMutation = useDeleteTravelChannel(travelId || "");

  // Chat manager (기존 messenger 재사용)
  const {
    messages,
    isLoadingMessages,
    isFetchingMore,
    hasMoreMessages,
    fetchNextPage,
    refetchMessages,
    handleSendMessage,
    isSendingMessage,
  } = useChatManager();

  const { startTyping, stopTyping } = useWebSocket();

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null!);
  const prevScrollDataRef = useRef<{ height: number; top: number } | null>(null);
  const isInitialLoadRef = useRef(true);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null!);
  const lastMessageIdRef = useRef<string | null>(null);

  // 스크롤 관리 (useTravelMessenger 패턴 동일)
  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (!lastMessageIdRef.current && messages.length > 0) {
      lastMessageIdRef.current = messages.slice(-1)[0]?.id ?? null;
    }

    if (isInitialLoadRef.current && messages.length > 0) {
      container.scrollTop = container.scrollHeight;
      isInitialLoadRef.current = false;
      return;
    } else if (messages.length > 0 && lastMessageIdRef.current) {
      if (messages.slice(-1)[0].id !== lastMessageIdRef.current) {
        container.scrollTop = container.scrollHeight;
        isInitialLoadRef.current = false;
        lastMessageIdRef.current = messages.slice(-1)[0].id;
        return;
      }
    }

    if (prevScrollDataRef.current) {
      const { height: prevHeight } = prevScrollDataRef.current;
      const newHeight = container.scrollHeight;
      const heightDiff = newHeight - prevHeight;
      if (heightDiff > 0) {
        container.scrollTop = heightDiff;
      }
      prevScrollDataRef.current = null;
    }
  }, [messages]);

  // 이전 메시지 로드
  const fetchMoreMessages = useCallback(() => {
    if (!hasMoreMessages || isFetchingMore) return;
    const container = scrollContainerRef.current;
    if (container) {
      prevScrollDataRef.current = {
        height: container.scrollHeight,
        top: container.scrollTop,
      };
    }
    fetchNextPage();
  }, [hasMoreMessages, isFetchingMore, fetchNextPage]);

  // 무한 스크롤
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

  // 반응형
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 모바일에서 채널 선택 시 멤버 리스트 닫기
  useEffect(() => {
    if (isMobile && selectedChannel) {
      setShowMemberList(false);
    }
  }, [isMobile, selectedChannel, setShowMemberList]);

  // ref 초기화 (채널 변경 시)
  useEffect(() => {
    isInitialLoadRef.current = true;
    lastMessageIdRef.current = null;
  }, [selectedChannel]);

  // 언마운트 시 selectedChannel 초기화
  useEffect(() => {
    return () => {
      setSelectedChannel(null);
    };
  }, []);

  // TravelChannelResponse → Channel 변환
  const toChannel = useCallback((tc: TravelChannelResponse): Channel => {
    return {
      id: tc.channelId,
      name: tc.channelName,
      description: tc.channelDescription || "",
      channelType: "GROUP",
      memberCount: tc.memberCount || 0,
      lastMessageAt: tc.lastMessageAt,
      isArchived: false,
      isReadOnly: false,
      createdAt: tc.createdAt || "",
      updatedAt: tc.updatedAt || "",
    } as Channel;
  }, []);

  // 채널 선택
  const handleChannelSelect = useCallback(
    (travelChannel: TravelChannelResponse) => {
      setSelectedTravelChannel(travelChannel);
      setSelectedChannel(toChannel(travelChannel));
    },
    [setSelectedChannel, toChannel]
  );

  // 채널 생성
  const handleCreateChannel = useCallback(
    async (request: TravelChannelCreateRequest) => {
      if (!request.name.trim()) {
        toaster.create({ title: "채널명을 입력해주세요", status: "warning", duration: 2000 });
        return;
      }
      try {
        await createChannelMutation.mutateAsync(request);
        setShowCreateModal(false);
        toaster.create({ title: "채널이 생성되었습니다", status: "success", duration: 2000 });
      } catch (error) {
        toaster.create({ title: "채널 생성에 실패했습니다", status: "error", duration: 2000 });
      }
    },
    [createChannelMutation]
  );

  // 채널 삭제
  const handleDeleteChannel = useCallback(
    async (travelChannelId: string) => {
      try {
        await deleteChannelMutation.mutateAsync(travelChannelId);
        setSelectedChannel(null);
        setSelectedTravelChannel(null);
        toaster.create({ title: "채널이 삭제되었습니다", status: "success", duration: 2000 });
      } catch (error) {
        toaster.create({ title: "채널 삭제에 실패했습니다", status: "error", duration: 2000 });
      }
    },
    [deleteChannelMutation, setSelectedChannel]
  );

  // 뒤로가기
  const handleBack = useCallback(() => {
    if (isMobile && selectedChannel) {
      setSelectedChannel(null);
      setSelectedTravelChannel(null);
    } else {
      navigate(`/travel/dashboard/${travelId}`);
    }
  }, [isMobile, selectedChannel, setSelectedChannel, navigate, travelId]);

  const shouldShowSidebar = !isMobile || !selectedChannel;
  const shouldShowChat = !isMobile || selectedChannel;

  const isSameDay = (inx: number, oldOneDate?: string, newOneDate?: string) => {
    if (inx === 0) return true;
    return !(moment.duration(moment(newOneDate).diff(moment(oldOneDate))).asDays() > 1);
  };

  return {
    // Params
    travelId,
    travel,

    // Refs
    messagesEndRef,
    scrollContainerRef,
    loadMoreTriggerRef,

    // State
    selectedChannel,
    selectedTravelChannel,
    showMemberList,
    showCreateModal,
    isMobile,
    shouldShowSidebar,
    shouldShowChat,

    // Data
    travelChannels: travelChannels || [],
    isLoadingChannels,
    messages,
    isLoadingMessages,
    isFetchingMore,
    hasMoreMessages,
    isSendingMessage,

    // Handlers
    handleChannelSelect,
    handleCreateChannel,
    handleDeleteChannel,
    handleBack,
    setShowCreateModal,
    setShowMemberList,

    // Mutations
    createChannelMutation,
    deleteChannelMutation,

    // Utils
    startTyping,
    stopTyping,
    isSameDay,
  };
};
