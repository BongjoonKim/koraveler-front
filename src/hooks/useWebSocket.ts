// src/hooks/useWebSocket.ts
import { useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../appConfig/AuthProvider';
import { useCurrentUser } from './useCurrentUser';
import {
  socketConnectedAtom,
  selectedChannelAtom,
  typingUsersAtom,
  triggerMessageRefetchAtom,
} from '../stores/messengerStore/messengerStore';

export const useWebSocket = () => {
  const stompClientRef = useRef<Client | null>(null);
  const [, setIsConnected] = useAtom(socketConnectedAtom);
  const [selectedChannel] = useAtom(selectedChannelAtom);
  const [, setTypingUsers] = useAtom(typingUsersAtom);
  const [, triggerMessageRefetch] = useAtom(triggerMessageRefetchAtom);
  const { accessToken } = useAuth();
  const {data : currentUser} = useCurrentUser();
  const queryClient = useQueryClient();
  const subscriptionsRef = useRef<Map<string, any>>(new Map());
  
  // WebSocket 연결
  useEffect(() => {
    if (!accessToken) return;
    
    // 방법 1: URL 파라미터로 토큰 전달
    const wsUrl = `${process.env.REACT_APP_BACKEND_URI}/ws?token=${encodeURIComponent(accessToken)}`;
    
    const client = new Client({
      // 방법 1 사용 시
      webSocketFactory: () => new SockJS(wsUrl),
      
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`  // STOMP 레벨 인증용
      },
      // debug: (str) => console.log('STOMP:', str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      
      // 연결 실패 시 재시도 로직
      beforeConnect: () => {
        console.log('WebSocket 연결 시도...');
      },
      
      onStompError: (frame) => {
        console.error('STOMP 에러:', frame.headers['message']);
        console.error('에러 본문:', frame.body);
        
        // 인증 에러인 경우 재연결 시도하지 않음
        if (frame.headers['message']?.includes('auth') ||
          frame.headers['message']?.includes('401') ||
          frame.headers['message']?.includes('403')) {
          console.error('인증 실패. WebSocket 연결을 중단합니다.');
          client.deactivate();
        }
      }
    });
    
    stompClientRef.current = client;
    
    client.onConnect = () => {
      console.log('WebSocket 연결 성공');
      setIsConnected(true);
      
      // 에러 큐 구독
      client.subscribe('/user/queue/errors', (message) => {
        console.error('WebSocket 에러:', message.body);
      });
    };
    
    client.onDisconnect = () => {
      console.log('WebSocket 연결 해제');
      setIsConnected(false);
      subscriptionsRef.current.clear();
    };
    
    client.onWebSocketError = (error) => {
      console.error('WebSocket 에러:', error);
    };
    
    client.activate();
    
    return () => {
      subscriptionsRef.current.forEach(sub => sub.unsubscribe());
      subscriptionsRef.current.clear();
      client.deactivate();
    };
  }, [accessToken, setIsConnected]);
  
  // 사용자 개인 채널 이벤트 구독 (항상)
  useEffect(() => {
    const client = stompClientRef.current;
    
    if (!client?.connected || !currentUser) return;
    
    // 이전 사용자 정보의 구독 해제
    subscriptionsRef.current.forEach((sub, key) => {
      if (key.startsWith("user/")) {
        sub.unsubscribe();
        subscriptionsRef.current.delete(key);
      }
    })
    
    // 채널 생성 이벤트
    const channelCreatedSub = client.subscribe(
      `/topic/user/${currentUser.id}/channel-created`,
      (message) => {
        const event = JSON.parse(message.body);
        console.log('새 채널 생성됨:', event);
        
        queryClient.invalidateQueries({
          queryKey: ['channels', 'my']
        });
      }
    );
    
    // 채널 참여 이벤트
    const channelJoinedSub = client.subscribe(
      `/topic/user/${currentUser.id}/channel-joined`,
      (message) => {
        const event = JSON.parse(message.body);
        console.log('채널 참여:', event);
        
        queryClient.invalidateQueries({
          queryKey: ['channels', 'my']
        });
      }
    );
    
    // 채널 탈퇴 이벤트
    const channelLeftSub = client.subscribe(
      `/topic/user/${currentUser.id}/channel-left`,
      (message) => {
        const event = JSON.parse(message.body);
        console.log('채널 탈퇴:', event);
        
        queryClient.invalidateQueries({
          queryKey: ['channels', 'my']
        });
        
        if (selectedChannel?.id === event.channelId) {
          console.log('현재 채널에서 탈퇴했습니다.');
        }
      }
    );
    
    subscriptionsRef.current.set('user/channel-created', channelCreatedSub);
    subscriptionsRef.current.set('user/channel-joined', channelJoinedSub);
    subscriptionsRef.current.set('user/channel-left', channelLeftSub);
  }, [currentUser?.id, queryClient, selectedChannel?.id])
  
  // 채널 구독
  useEffect(() => {
    const client = stompClientRef.current;
    if (!client?.connected || !selectedChannel || !currentUser) return;
    
    const channelId = selectedChannel.id;
    
    // 이전 구독 해제
    subscriptionsRef.current.forEach((sub, key) => {
      if (key.startsWith('channel/')) {
        sub.unsubscribe();
        subscriptionsRef.current.delete(key);
      }
    });
    
    // 메시지 구독
    const messageSubscription = client.subscribe(
      `/topic/channel/${channelId}/new-message`,
      (message) => {
        const newMessage = JSON.parse(message.body);
        
        // 내가 보낸 메시지는 무시 (이미 낙관적 업데이트로 처리됨)
        if (newMessage.userId === currentUser.id) {
          return;
        }
        
        // 메시지 목록 refetch 트리거
        queryClient.invalidateQueries({
          queryKey: ['messages', channelId]
        });
        
        // 채널 목록도 업데이트 (마지막 메시지, 읽지 않은 수 등)
        queryClient.invalidateQueries({
          queryKey: ['channels', 'my']
        });
        
        // WebSocket 이벤트 트리거 (선택사항 - UI 업데이트용)
        triggerMessageRefetch(channelId);
      }
    );
    
    // 타이핑 이벤트 구독
    const typingSubscription = client.subscribe(
      `/topic/channel/${channelId}/typing`,
      (message) => {
        const typingEvent = JSON.parse(message.body);
        
        if (typingEvent.userId !== currentUser.id) {
          setTypingUsers(prev => {
            if (typingEvent.isTyping) {
              return [...prev.filter(id => id !== typingEvent.userId), typingEvent.userId];
            }
            return prev.filter(id => id !== typingEvent.userId);
          });
        }
      }
    );
    
    // 메시지 업데이트 이벤트 구독
    const updateSubscription = client.subscribe(
      `/topic/channel/${channelId}/message-updated`,
      (message) => {
        const updateEvent = JSON.parse(message.body);
        
        // 메시지 목록 refetch
        queryClient.invalidateQueries({
          queryKey: ['messages', channelId]
        });
        
        // 채널 목록도 업데이트 (마지막 메시지, 읽지 않은 수 등)
        queryClient.invalidateQueries({
          queryKey: ['channels', 'my']
        });
      }
    );
    
    // 메시지 삭제 이벤트 구독
    const deleteSubscription = client.subscribe(
      `/topic/channel/${channelId}/message-deleted`,
      (message) => {
        const deleteEvent = JSON.parse(message.body);
        
        // 메시지 목록 refetch
        queryClient.invalidateQueries({
          queryKey: ['messages', channelId]
        });
        
        // 채널 목록도 업데이트 (마지막 메시지, 읽지 않은 수 등)
        queryClient.invalidateQueries({
          queryKey: ['channels', 'my']
        });
      }
    );
    
    // 채널 업데이트 구독
    const channelUpdatedSub = client.subscribe(
      `/topic/channel/${channelId}/channel-updated`,
      (message) => {
        const event = JSON.parse(message.body);
        console.log('채널 업데이트됨:', event);
        
        queryClient.invalidateQueries({
          queryKey: ['channels', channelId]
        });
        
        queryClient.invalidateQueries({
          queryKey: ['channels', 'my']
        });
      }
    );

    // 채널 삭제/아카이브 구독
    const channelDeletedSub = client.subscribe(
      `/topic/channel/${channelId}/channel-deleted`,
      (message) => {
        const event = JSON.parse(message.body);
        console.log('채널 삭제/아카이브됨:', event);
        
        queryClient.invalidateQueries({
          queryKey: ['channels', 'my']
        });
      }
    );

    // 채널 아카이브 구독
    const channelArchivedSub = client.subscribe(
      `/topic/channel/${channelId}/channel-archived`,
      (message) => {
        const event = JSON.parse(message.body);
        console.log('채널 아카이브됨:', event);
        
        queryClient.invalidateQueries({
          queryKey: ['channels', channelId]
        });
        
        queryClient.invalidateQueries({
          queryKey: ['channels', 'my']
        });
      }
    );

    // 멤버 참여 구독
    const memberJoinedSub = client.subscribe(
      `/topic/channel/${channelId}/member-joined`,
      (message) => {
        const event = JSON.parse(message.body);
        console.log('새 멤버 참여:', event);
        
        queryClient.invalidateQueries({
          queryKey: ['channels', channelId]
        });
        
        queryClient.invalidateQueries({
          queryKey: ['channels', 'my']
        });
        
        queryClient.invalidateQueries({
          queryKey: ['members', channelId]
        });
      }
    );

    // 멤버 탈퇴 구독
    const memberLeftSub = client.subscribe(
      `/topic/channel/${channelId}/member-left`,
      (message) => {
        const event = JSON.parse(message.body);
        console.log('멤버 탈퇴:', event);
        
        queryClient.invalidateQueries({
          queryKey: ['channels', channelId]
        });
        
        queryClient.invalidateQueries({
          queryKey: ['channels', 'my']
        });
        
        queryClient.invalidateQueries({
          queryKey: ['members', channelId]
        });
      }
    );

    // 채널 설정 업데이트 구독
    const settingsUpdatedSub = client.subscribe(
      `/topic/channel/${channelId}/settings-updated`,
      (message) => {
        const event = JSON.parse(message.body);
        console.log('채널 설정 업데이트됨:', event);
        
        queryClient.invalidateQueries({
          queryKey: ['channels', channelId]
        });
      }
    );
    
    // ✅ 추가: 멤버 추가 구독
    const memberAddedSub = client.subscribe(
      `/topic/channel/${channelId}/member-added`,
      (message) => {
        console.log("멤버 추가")
        const event = JSON.parse(message.body);
        console.log('멤버 추가됨:', event);
        
        queryClient.invalidateQueries({
          queryKey: ['channels', channelId]
        });
        
        queryClient.invalidateQueries({
          queryKey: ['channels', 'my']
        });
        
        queryClient.invalidateQueries({
          queryKey: ['members', channelId]
        });
      }
    );

// ✅ 추가: 멤버 제거 구독
    const memberRemovedSub = client.subscribe(
      `/topic/channel/${channelId}/member-removed`,
      (message) => {
        const event = JSON.parse(message.body);
        console.log('멤버 제거됨:', event);
        
        queryClient.invalidateQueries({
          queryKey: ['channels', channelId]
        });
        
        queryClient.invalidateQueries({
          queryKey: ['channels', 'my']
        });
        
        queryClient.invalidateQueries({
          queryKey: ['members', channelId]
        });
      }
    );

    //멤버 역할 변경 구독
    const memberRoleUpdatedSub = client.subscribe(
      `/topic/channel/${channelId}/member-role-updated`,
      (message) => {
        const event = JSON.parse(message.body);
        console.log('멤버 역할 변경됨:', event);
        
        queryClient.invalidateQueries({
          queryKey: ['members', channelId]
        });
        
        queryClient.invalidateQueries({
          queryKey: ['channels', channelId]
        });
      }
    );

    // 멤버 음소거 구독
    const memberMutedSub = client.subscribe(
      `/topic/channel/${channelId}/member-muted`,
      (message) => {
        const event = JSON.parse(message.body);
        console.log('멤버 음소거됨:', event);
        
        queryClient.invalidateQueries({
          queryKey: ['members', channelId]
        });
      }
    );

    // 멤버 음소거 해제 구독
    const memberUnmutedSub = client.subscribe(
      `/topic/channel/${channelId}/member-unmuted`,
      (message) => {
        const event = JSON.parse(message.body);
        console.log('멤버 음소거 해제됨:', event);
        
        queryClient.invalidateQueries({
          queryKey: ['channel-members', channelId]
        });
      }
    );

    // 멤버 상태 변경 구독
    const memberStatusUpdatedSub = client.subscribe(
      `/topic/channel/${channelId}/member-status-updated`,
      (message) => {
        const event = JSON.parse(message.body);
        console.log('멤버 상태 변경됨:', event);
        
        queryClient.invalidateQueries({
          queryKey: ['channel-members', channelId]
        });
        
        queryClient.invalidateQueries({
          queryKey: ['channel', channelId]
        });
      }
    );
    
    subscriptionsRef.current.set(`channel/${channelId}/messages`, messageSubscription);
    subscriptionsRef.current.set(`channel/${channelId}/typing`, typingSubscription);
    subscriptionsRef.current.set(`channel/${channelId}/updates`, updateSubscription);
    subscriptionsRef.current.set(`channel/${channelId}/deletes`, deleteSubscription);
    
    subscriptionsRef.current.set(`channel/${channelId}/channel-updated`, channelUpdatedSub);
    subscriptionsRef.current.set(`channel/${channelId}/channel-deleted`, channelDeletedSub);
    subscriptionsRef.current.set(`channel/${channelId}/channel-archived`, channelArchivedSub);
    subscriptionsRef.current.set(`channel/${channelId}/member-joined`, memberJoinedSub);
    subscriptionsRef.current.set(`channel/${channelId}/member-left`, memberLeftSub);
    subscriptionsRef.current.set(`channel/${channelId}/settings-updated`, settingsUpdatedSub);
    
    subscriptionsRef.current.set(`channel/${channelId}/member-added`, memberAddedSub);
    subscriptionsRef.current.set(`channel/${channelId}/member-removed`, memberRemovedSub);
    subscriptionsRef.current.set(`channel/${channelId}/member-role-updated`, memberRoleUpdatedSub);
    subscriptionsRef.current.set(`channel/${channelId}/member-muted`, memberMutedSub);
    subscriptionsRef.current.set(`channel/${channelId}/member-unmuted`, memberUnmutedSub);
    subscriptionsRef.current.set(`channel/${channelId}/member-status-updated`, memberStatusUpdatedSub);
    
  }, [selectedChannel?.id, currentUser?.id, queryClient, setTypingUsers, triggerMessageRefetch]);
  
  const startTyping = (channelId: string) => {
    const client = stompClientRef.current;
    if (!client?.connected) return;
    
    client.publish({
      destination: `/app/chat/${channelId}/typing`,
      body: JSON.stringify({ isTyping: true }),
    });
  };
  
  const stopTyping = (channelId: string) => {
    const client = stompClientRef.current;
    if (!client?.connected) return;
    
    client.publish({
      destination: `/app/chat/${channelId}/typing`,
      body: JSON.stringify({ isTyping: false }),
    });
  };
  
  // 메시지 전송 (WebSocket 직접 전송 - 선택사항)
  // const sendMessageViaWebSocket = (channelId: string, message: any) => {
  //   const client = stompClientRef.current;
  //   if (!client?.connected) return;
  //
  //   client.publish({
  //     destination: `/app/chat/${channelId}/send`,
  //     body: JSON.stringify(message),
  //   });
  // };
  
  return {
    startTyping,
    stopTyping,
    // sendMessageViaWebSocket,
    isConnected: stompClientRef.current?.connected || false
  };
};