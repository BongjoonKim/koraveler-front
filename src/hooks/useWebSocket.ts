// src/hooks/useWebSocket.ts (STOMP 버전)
import { useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../appConfig/AuthProvider';
import {
  socketConnectedAtom,
  selectedChannelAtom,
  typingUsersAtom
} from '../stores/messengerStore/messengerStore';

export const useWebSocket = () => {
  const stompClientRef = useRef<Client | null>(null);
  const [, setIsConnected] = useAtom(socketConnectedAtom);
  const { accessToken } = useAuth();
  const [selectedChannel] = useAtom(selectedChannelAtom);
  const [, setTypingUsers] = useAtom(typingUsersAtom);
  const queryClient = useQueryClient();
  const subscriptionsRef = useRef<Map<string, any>>(new Map());
  
  useEffect(() => {
    if (!accessToken) return;
    
    // STOMP 클라이언트 생성
    const client = new Client({
      webSocketFactory: () => new SockJS(`${process.env.REACT_APP_BACKEND_URI}/ws`),
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`
      },
      debug: (str) => {
        console.log('STOMP:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });
    
    stompClientRef.current = client;
    
    client.onConnect = (frame) => {
      console.log('STOMP Connected:', frame);
      setIsConnected(true);
      
      // 전역 에러 구독
      client.subscribe('/user/queue/errors', (message) => {
        console.error('WebSocket Error:', message.body);
      });
    };
    
    client.onDisconnect = () => {
      console.log('STOMP Disconnected');
      setIsConnected(false);
      subscriptionsRef.current.clear();
    };
    
    client.onStompError = (frame) => {
      console.error('STOMP Error:', frame);
      setIsConnected(false);
    };
    
    client.activate();
    
    return () => {
      subscriptionsRef.current.forEach((subscription) => {
        subscription.unsubscribe();
      });
      subscriptionsRef.current.clear();
      client.deactivate();
      setIsConnected(false);
    };
  }, [accessToken, setIsConnected]);
  
  // 채널 구독/구독해제
  useEffect(() => {
    const client = stompClientRef.current;
    if (!client || !client.connected || !selectedChannel) return;
    
    const channelId = selectedChannel.id;
    
    // 이전 구독 해제
    subscriptionsRef.current.forEach((subscription, key) => {
      if (key.includes('channel/')) {
        subscription.unsubscribe();
        subscriptionsRef.current.delete(key);
      }
    });
    
    // 새 채널 메시지 구독
    const messageSubscription = client.subscribe(
      `/topic/channel/${channelId}/messages`,
      (message) => {
        const newMessage = JSON.parse(message.body);
        
        // 메시지 목록 업데이트
        queryClient.setQueryData(['messages', channelId], (old: any) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page: any, index: number) =>
              index === 0
                ? { ...page, messages: [newMessage, ...page.messages] }
                : page
            ),
          };
        });
        
        // 채널 목록의 lastMessage 업데이트
        queryClient.setQueryData(['channels', 'my'], (old: any) => {
          if (!old) return old;
          return {
            ...old,
            channels: old.channels.map((channel: any) =>
              channel.id === channelId
                ? {
                  ...channel,
                  lastMessage: newMessage,
                  lastMessageAt: newMessage.createdAt
                }
                : channel
            ),
          };
        });
      }
    );
    
    // 타이핑 이벤트 구독
    const typingSubscription = client.subscribe(
      `/topic/channel/${channelId}/typing`,
      (message) => {
        const typingEvent = JSON.parse(message.body);
        
        setTypingUsers(prev => {
          if (typingEvent.isTyping) {
            return [...prev.filter(u => u !== typingEvent.userId), typingEvent.userId];
          } else {
            return prev.filter(u => u !== typingEvent.userId);
          }
        });
        
        // 3초 후 자동으로 타이핑 상태 제거
        if (typingEvent.isTyping) {
          setTimeout(() => {
            setTypingUsers(prev => prev.filter(u => u !== typingEvent.userId));
          }, 3000);
        }
      }
    );
    
    subscriptionsRef.current.set(`channel/${channelId}/messages`, messageSubscription);
    subscriptionsRef.current.set(`channel/${channelId}/typing`, typingSubscription);
    
  }, [selectedChannel, queryClient, setTypingUsers]);
  
  const sendMessage = (messageData: {
    channelId: string;
    message: string;
    messageType: string;
    parentMessageId?: string;
    attachments?: any[];
    mentionedUserIds?: string[];
  }) => {
    const client = stompClientRef.current;
    if (!client || !client.connected) {
      console.error('STOMP client not connected');
      return;
    }
    
    client.publish({
      destination: `/app/chat/${messageData.channelId}/send`,
      body: JSON.stringify(messageData),
    });
  };
  
  const startTyping = (channelId: string) => {
    const client = stompClientRef.current;
    if (!client || !client.connected) return;
    
    client.publish({
      destination: `/app/chat/${channelId}/typing`,
      body: JSON.stringify({ isTyping: true }),
    });
  };
  
  const stopTyping = (channelId: string) => {
    const client = stompClientRef.current;
    if (!client || !client.connected) return;
    
    client.publish({
      destination: `/app/chat/${channelId}/typing`,
      body: JSON.stringify({ isTyping: false }),
    });
  };
  
  return {
    sendMessage,
    startTyping,
    stopTyping,
    isConnected: stompClientRef.current?.connected || false
  };
};