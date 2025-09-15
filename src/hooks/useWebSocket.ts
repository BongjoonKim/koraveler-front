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
  const currentUser = useCurrentUser();
  const queryClient = useQueryClient();
  const subscriptionsRef = useRef<Map<string, any>>(new Map());
  
  // WebSocket 연결
  useEffect(() => {
    if (!accessToken) return;
    
    // 방법 1: URL 파라미터로 토큰 전달
    const wsUrl = `${process.env.REACT_APP_BACKEND_URI}/ws?token=${encodeURIComponent(accessToken)}`;
    
    // 방법 2: 커스텀 SockJS 옵션으로 헤더 설정 (SockJS 3.0+ 필요)
    const sockJsOptions = {
      transportOptions: {
        xhr: {
          beforeSend: (xhr: XMLHttpRequest) => {
            xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
          }
        }
      }
    };
    
    const client = new Client({
      // 방법 1 사용 시
      webSocketFactory: () => new SockJS(wsUrl),
      
      // 방법 2 사용 시 (SockJS 버전에 따라 작동 안 할 수 있음)
      // webSocketFactory: () => new SockJS(`${process.env.REACT_APP_BACKEND_URI}/ws`, null, sockJsOptions),
      
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
      `/topic/channel/${channelId}/messages`,
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
      `/topic/channel/${channelId}/message-updates`,
      (message) => {
        const updateEvent = JSON.parse(message.body);
        
        // 메시지 목록 refetch
        queryClient.invalidateQueries({
          queryKey: ['messages', channelId]
        });
      }
    );
    
    // 메시지 삭제 이벤트 구독
    const deleteSubscription = client.subscribe(
      `/topic/channel/${channelId}/message-deletes`,
      (message) => {
        const deleteEvent = JSON.parse(message.body);
        
        // 메시지 목록 refetch
        queryClient.invalidateQueries({
          queryKey: ['messages', channelId]
        });
      }
    );
    
    subscriptionsRef.current.set(`channel/${channelId}/messages`, messageSubscription);
    subscriptionsRef.current.set(`channel/${channelId}/typing`, typingSubscription);
    subscriptionsRef.current.set(`channel/${channelId}/updates`, updateSubscription);
    subscriptionsRef.current.set(`channel/${channelId}/deletes`, deleteSubscription);
    
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
  const sendMessageViaWebSocket = (channelId: string, message: any) => {
    const client = stompClientRef.current;
    if (!client?.connected) return;
    
    client.publish({
      destination: `/app/chat/${channelId}/send`,
      body: JSON.stringify(message),
    });
  };
  
  return {
    startTyping,
    stopTyping,
    sendMessageViaWebSocket,
    isConnected: stompClientRef.current?.connected || false
  };
};