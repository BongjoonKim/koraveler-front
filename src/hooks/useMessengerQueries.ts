// src/hooks/useMessengerQueries.ts (수정된 버전)
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import useAuthEP from '../utils/useAuthEP';
import {
  getMyChannels,
  getPublicChannels,
  searchChannels,
  getChannel,
  createChannel,
  updateChannel,
  deleteChannel,
  joinChannel,
  leaveChannel,
  getChannelMessages,
  sendMessage,
  updateMessage,
  deleteMessage,
  addReaction,
  pinMessage,
  unpinMessage,
  markAsRead,
  markChannelAsRead,
  getChannelMembers,
  getOnlineMembers,
  addMember,
  removeMember,
  updateMyNickname,
  updateNotificationSettings,
  muteMember,
  unmuteMember,
  banMember,
  unbanMember,
  uploadFile,
  uploadMultipleFiles, getReplies, getMentionedMessages,
} from '../endpoints/messenger-endpoints';
import {
  Channel, ChannelApiResponse,
  ChannelListApiResponse, ChannelListResponse,
  ChannelMember, ChannelMemberListApiResponse,
  Message,
  MessageListApiResponse, MessageListResponse
} from "../types/messenger/messengerTypes";

// ===== 일반 쿼리들 (타입 명시) =====

// 내 채널 목록 조회
export const useMyChannels = (params?: { size?: number; sortBy?: string; sortDirection?: string }) => {
  const authEP = useAuthEP();
  
  return useQuery<ChannelListApiResponse['data']>({
    queryKey: ['channels', 'my', params],
    queryFn: async () => {
      const response: ChannelListApiResponse = await authEP({
        func: getMyChannels,
        params
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5분
    refetchOnMount: 'always', // 컴포넌트 마운트 시마다 새로고침
    
  });
};

// 공개 채널 목록 조회
export const usePublicChannels = (params?: { size?: number; sortBy?: string; sortDirection?: string }) => {
  const authEP = useAuthEP();
  
  return useQuery<ChannelListApiResponse['data']>({
    queryKey: ['channels', 'public', params],
    queryFn: async () => {
      const response: ChannelListApiResponse = await authEP({
        func: getPublicChannels,
        params
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

// 채널 검색
export const useSearchChannels = (keyword: string, params?: { size?: number; cursor?: string }) => {
  const authEP = useAuthEP();
  
  return useQuery<ChannelListApiResponse['data']>({
    queryKey: ['channels', 'search', keyword, params],
    queryFn: async () => {
      const response: ChannelListApiResponse = await authEP({
        func: searchChannels,
        params: { keyword, ...params }
      });
      return response.data;
    },
    enabled: keyword.length > 2,
  });
};

// 채널 상세 조회
export const useChannel = (channelId: string | null) => {
  const authEP = useAuthEP();
  
  return useQuery<Channel>({
    queryKey: ['channels', channelId],
    queryFn: async () => {
      const response: ChannelApiResponse = await authEP({
        func: getChannel,
        params: { channelId: channelId! }
      });
      return response.data;
    },
    enabled: !!channelId,
  });
};

// 채널 멤버 목록 조회
export const useChannelMembers = (channelId: string | null) => {
  const authEP = useAuthEP();
  
  return useQuery<ChannelMember[]>({
    queryKey: ['members', channelId],
    queryFn: async () => {
      const response: ChannelMemberListApiResponse = await authEP({
        func: getChannelMembers,
        params: { channelId: channelId! }
      });
      return response.data;
    },
    enabled: !!channelId,
  });
};

// 온라인 멤버 조회
export const useOnlineMembers = (channelId: string | null) => {
  const authEP = useAuthEP();
  
  return useQuery<ChannelMember[]>({
    queryKey: ['members', 'online', channelId],
    queryFn: async () => {
      const response: ChannelMemberListApiResponse = await authEP({
        func: getOnlineMembers,
        params: { channelId: channelId! }
      });
      return response.data;
    },
    enabled: !!channelId,
    refetchInterval: 30000, // 30초마다 새로고침
  });
};

// 채널 생성 뮤테이션
export const useCreateChannel = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  console.log("여기도 오나")
  return useMutation({
    mutationFn: (data: {
      name: string;
      description?: string;
      channelType: Channel['channelType'];
      password?: string;
      requiresApproval?: boolean;
      maxMembers?: number;
      topic?: string;
      tags?: string[];
      initialMemberIds?: string[];
    }) => authEP({ func: createChannel, params: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channels', 'my'] });
    },
  });
};

// 채널 수정 뮤테이션
export const useUpdateChannel = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ channelId, data }: { channelId: string; data: any }) =>
      authEP({ func: updateChannel, params: { channelId, data } }),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(['channels', variables.channelId], response);
      queryClient.invalidateQueries({ queryKey: ['channels', 'my'] });
    },
  });
};

// 채널 삭제 뮤테이션
export const useDeleteChannel = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (channelId: string) =>
      authEP({ func: deleteChannel, params: { channelId } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channels', 'my'] });
    },
  });
};

// 채널 참여 뮤테이션
export const useJoinChannel = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ channelId, data }: { channelId: string; data?: any }) =>
      authEP({ func: joinChannel, params: { channelId, data } }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['channels', 'my'] });
      queryClient.setQueryData(['channels', response.data.id], response);
    },
  });
};

// 채널 탈퇴 뮤테이션
export const useLeaveChannel = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (channelId: string) =>
      authEP({ func: leaveChannel, params: { channelId } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channels', 'my'] });
    },
  });
};

// ===== 메시지 관련 훅 =====

// useMessengerQueries.ts
export const useChannelMessages = (channelId: string | null) => {
  const authEP = useAuthEP();
  
  return useQuery<MessageListResponse>({
    queryKey: ['messages', channelId],
    queryFn: async () => {
      const response = await authEP({
        func: getChannelMessages,
        params: {
          channelId: channelId!,
          page: 0,  // 일단 첫 페이지만
          size: 50
        }
      });
      return response.data;
    },
    enabled: !!channelId,
    staleTime: 1000 * 60 * 5,
  });
};

// 답글 조회 (무한 스크롤)
export const useReplies = (parentMessageId: string | null) => {
  const authEP = useAuthEP();
  
  return useInfiniteQuery({
    queryKey: ['replies', parentMessageId],
    queryFn: async ({ pageParam }: { pageParam: string | null }) => {
      const response: MessageListApiResponse = await authEP({
        func: getReplies,
        params: { parentMessageId: parentMessageId!, cursor: pageParam, size: 20 }
      });
      return response.data;
    },
    enabled: !!parentMessageId,
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.nextCursor : undefined;
    },
  });
};

// 멘션된 메시지 조회 (무한 스크롤)
export const useMentionedMessages = () => {
  const authEP = useAuthEP();
  
  return useInfiniteQuery({
    queryKey: ['mentions'],
    queryFn: async ({ pageParam }: { pageParam: string | null }) => {
      const response: MessageListApiResponse = await authEP({
        func: getMentionedMessages,
        params: { cursor: pageParam, size: 20 }
      });
      return response.data;
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.nextCursor : undefined;
    },
  });
};

// 메시지 전송 뮤테이션
// src/hooks/useMessengerQueries.ts
export const useSendMessage = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: {
      channelId: string;
      message: string;
      messageType: Message['messageType'];
      parentMessageId?: string;
      attachments?: any[];
      mentionedUserIds?: string[];
      clientId?: string;
    }) => authEP({ func: sendMessage, params: data }),
    
    onSuccess: (response, variables) => {
      // 채널의 메시지 목록 업데이트 (임시 메시지 교체)
      queryClient.setQueryData(
        ['messages', variables.channelId],
        (old: MessageListResponse | undefined) => {
          if (!old) {
            return {
              messages: [response.data],
              hasNext: false,
              totalCount: 1
            };
          }
          
          // clientId로 임시 메시지 찾아서 교체
          const existingIndex = old.messages.findIndex(
            msg => msg.id === variables.clientId
          );
          
          if (existingIndex >= 0) {
            const newMessages = [...old.messages];
            newMessages[existingIndex] = response.data;
            return { ...old, messages: newMessages };
          }
          
          // 임시 메시지가 없으면 끝에 추가
          return {
            ...old,
            messages: [...old.messages, response.data],
            totalCount: old.totalCount + 1
          };
        }
      );
      
      // 채널 목록 업데이트
      queryClient.setQueryData(
        ['channels', 'my'],
        (old: ChannelListResponse | undefined) => {
          if (!old) return old;
          
          return {
            ...old,
            channels: old.channels.map((channel: Channel) =>
              channel.id === variables.channelId
                ? {
                  ...channel,
                  lastMessage: response.data,
                  lastMessageAt: response.data.createdAt,
                  unreadMessageCount: 0
                }
                : channel
            )
          };
        }
      );
    }
  });
};

// 메시지 수정 뮤테이션
export const useUpdateMessage = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ messageId, data }: { messageId: string; data: { message: string } }) =>
      authEP({ func: updateMessage, params: { messageId, data } }),
    onSuccess: (response, variables) => {
      // 메시지 목록에서 해당 메시지 업데이트
      queryClient.setQueryData(['messages'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            messages: page.messages.map((msg: Message) =>
              msg.id === variables.messageId ? response.data : msg
            ),
          })),
        };
      });
    },
  });
};

// 메시지 삭제 뮤테이션
export const useDeleteMessage = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (messageId: string) =>
      authEP({ func: deleteMessage, params: { messageId } }),
    onSuccess: (_, messageId) => {
      // 메시지 목록에서 해당 메시지 제거
      queryClient.setQueryData(['messages'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            messages: page.messages.filter((msg: Message) => msg.id !== messageId),
          })),
        };
      });
    },
  });
};

// 메시지 반응 뮤테이션
export const useAddReaction = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ messageId, data }: { messageId: string; data: { emoji: string; isAdd: boolean } }) =>
      authEP({ func: addReaction, params: { messageId, data } }),
    onSuccess: (response, variables) => {
      // 메시지 반응 업데이트
      queryClient.setQueryData(['messages'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            messages: page.messages.map((msg: Message) =>
              msg.id === variables.messageId
                ? response.data
                : msg
            ),
          })),
        };
      });
    },
  });
};

// 메시지 고정/해제 뮤테이션
export const usePinMessage = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ messageId, pin }: { messageId: string; pin: boolean }) =>
      pin
        ? authEP({ func: pinMessage, params: { messageId } })
        : authEP({ func: unpinMessage, params: { messageId } }),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(['messages'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            messages: page.messages.map((msg: Message) =>
              msg.id === variables.messageId
                ? response.data
                : msg
            ),
          })),
        };
      });
    },
  });
};

// 읽음 처리 뮤테이션
export const useMarkAsRead = () => {
  const authEP = useAuthEP();
  
  return useMutation({
    mutationFn: ({ channelId, messageId }: { channelId: string; messageId?: string }) =>
      messageId
        ? authEP({ func: markAsRead, params: { messageId, channelId } })
        : authEP({ func: markChannelAsRead, params: { channelId } }),
  });
};

// ===== 채널 멤버 관련 훅 =====

// 멤버 추가 뮤테이션
export const useAddMember = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ channelId, userId }: { channelId: string; userId: string }) =>
      authEP({ func: addMember, params: { channelId, userId } }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['members', variables.channelId] });
    },
  });
};

// 멤버 제거 뮤테이션
export const useRemoveMember = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ channelId, userId }: { channelId: string; userId: string }) =>
      authEP({ func: removeMember, params: { channelId, userId } }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['members', variables.channelId] });
    },
  });
};

// 내 닉네임 변경 뮤테이션
export const useUpdateMyNickname = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ channelId, nickname }: { channelId: string; nickname: string }) =>
      authEP({ func: updateMyNickname, params: { channelId, nickname } }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['members', variables.channelId] });
    },
  });
};

// 알림 설정 변경 뮤테이션
export const useUpdateNotificationSettings = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ channelId, level, enabled }: {
      channelId: string;
      level: ChannelMember['notificationLevel'];
      enabled: boolean
    }) =>
      authEP({ func: updateNotificationSettings, params: { channelId, level, enabled } }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['members', variables.channelId] });
    },
  });
};

// 파일 업로드 뮤테이션
export const useFileUpload = () => {
  const authEP = useAuthEP();
  
  return useMutation({
    mutationFn: (file: File) =>
      authEP({ func: uploadFile, params: { file } }),
    onSuccess: (response) => {
      console.log('File uploaded:', response.data);
    },
  });
};

// 여러 파일 업로드 뮤테이션
export const useMultipleFileUpload = () => {
  const authEP = useAuthEP();
  
  return useMutation({
    mutationFn: (files: File[]) =>
      authEP({ func: uploadMultipleFiles, params: { files } }),
    onSuccess: (response) => {
      console.log('Files uploaded:', response.data);
    },
  });
};