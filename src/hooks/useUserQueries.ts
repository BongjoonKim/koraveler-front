// src/hooks/useUserQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuthEP from '../utils/useAuthEP';
import {getUsers,  searchUsers,
  searchUsersNotInChannel,
  getUserById,} from "../endpoints/users-endpoints";
import {User, UserSearchResponse} from "../types/users/UsersDTO";
// Types


// 사용자 검색 훅
export const useSearchUsers = (keyword: string, excludeChannelId?: string) => {
  const authEP = useAuthEP();
  
  return useQuery<UserSearchResponse>({
    queryKey: ['users', 'search', keyword, excludeChannelId],
    queryFn: async () => {
      // 키워드가 너무 짧으면 빈 결과 반환
      if (!keyword || keyword.length < 2) {
        return { users: [], totalCount: 0, hasNext: false };
      }
      
      try {
        const response = await authEP({
          func: searchUsers,
          params: {
            keyword,
            excludeChannelId,
            size: 20
          }
        });
        
        // API 응답 구조에 따라 조정
        return response.data || { users: [], totalCount: 0, hasNext: false };
      } catch (error) {
        console.error('User search error:', error);
        return { users: [], totalCount: 0, hasNext: false };
      }
    },
    enabled: keyword.length >= 2,
    staleTime: 1000 * 60 * 5, // 5분
    retry: 1,
  });
};

// 채널에 없는 사용자 검색 훅
export const useSearchUsersNotInChannel = (channelId: string, keyword: string) => {
  const authEP = useAuthEP();
  
  return useQuery<UserSearchResponse>({
    queryKey: ['users', 'available', channelId, keyword],
    queryFn: async () => {
      // 키워드가 너무 짧으면 빈 결과 반환
      if (!keyword || keyword.length < 2) {
        return { users: [], totalCount: 0, hasNext: false };
      }
      
      try {
        const response = await authEP({
          func: searchUsersNotInChannel,
          params: {
            channelId,
            keyword,
            size: 20
          }
        });
        
        // API 응답 구조에 따라 조정
        return response.data || { users: [], totalCount: 0, hasNext: false };
      } catch (error) {
        console.error('User search not in channel error:', error);
        return { users: [], totalCount: 0, hasNext: false };
      }
    },
    enabled: !!channelId && keyword.length >= 2,
    staleTime: 1000 * 60 * 5, // 5분
    retry: 1,
  });
};

// 특정 사용자 정보 조회 훅
export const useUser = (userId: string | null) => {
  const authEP = useAuthEP();
  
  return useQuery<User>({
    queryKey: ['users', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      
      try {
        const response = await authEP({
          func: getUserById,
          params: { userId }
        });
        
        return response.data;
      } catch (error) {
        console.error('Get user by ID error:', error);
        throw error;
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 10, // 10분
    retry: 1,
  });
};

// 사용자 목록 조회 훅 (페이징)
export const useUsers = (params?: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string;
}) => {
  const authEP = useAuthEP();
  
  return useQuery<UserSearchResponse>({
    queryKey: ['users', 'list', params],
    queryFn: async () => {
      try {
        const response = await authEP({
          func: getUsers,
          params: {
            page: params?.page || 0,
            size: params?.size || 20,
            sortBy: params?.sortBy || 'createdAt',
            sortDirection: params?.sortDirection || 'desc'
          }
        });
        
        return response.data || { users: [], totalCount: 0, hasNext: false };
      } catch (error) {
        console.error('Get users list error:', error);
        return { users: [], totalCount: 0, hasNext: false };
      }
    },
    staleTime: 1000 * 60 * 5, // 5분
    retry: 1,
  });
};

// 사용자 정보를 ID 리스트로 일괄 조회하는 훅
export const useUsersByIds = (userIds: string[]) => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  
  return useQuery<User[]>({
    queryKey: ['users', 'batch', userIds],
    queryFn: async () => {
      if (!userIds || userIds.length === 0) return [];
      
      try {
        // 캐시에서 먼저 확인
        const cachedUsers: User[] = [];
        const uncachedIds: string[] = [];
        
        for (const userId of userIds) {
          const cached = queryClient.getQueryData<User>(['users', userId]);
          if (cached) {
            cachedUsers.push(cached);
          } else {
            uncachedIds.push(userId);
          }
        }
        
        // 캐시되지 않은 사용자들만 API 호출
        if (uncachedIds.length > 0) {
          const promises = uncachedIds.map(userId =>
            authEP({
              func: getUserById,
              params: { userId }
            })
          );
          
          const responses = await Promise.allSettled(promises);
          
          responses.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value?.data) {
              const user = result.value.data;
              cachedUsers.push(user);
              // 개별 캐시도 업데이트
              queryClient.setQueryData(['users', uncachedIds[index]], user);
            }
          });
        }
        
        return cachedUsers;
      } catch (error) {
        console.error('Get users by IDs error:', error);
        return [];
      }
    },
    enabled: userIds.length > 0,
    staleTime: 1000 * 60 * 10, // 10분
  });
};

// 현재 로그인한 사용자 정보 조회 훅
export const useCurrentUserInfo = () => {
  const authEP = useAuthEP();
  
  return useQuery<User>({
    queryKey: ['users', 'current'],
    queryFn: async () => {
      try {
        // /api/v1/users/me 엔드포인트 사용
        const response = await authEP({
          func: async ({ accessToken }: any) => {
            const { request } = await import('../appConfig/request-response');
            return request.get('/api/v1/users/me', {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            });
          }
        });
        
        return response.data;
      } catch (error) {
        console.error('Get current user info error:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 30, // 30분
    retry: 1,
  });
};

// 사용자 검색 결과 캐시 무효화
export const useInvalidateUserQueries = () => {
  const queryClient = useQueryClient();
  
  return {
    invalidateUserSearch: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'search'] });
    },
    invalidateUserList: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'list'] });
    },
    invalidateUser: (userId: string) => {
      queryClient.invalidateQueries({ queryKey: ['users', userId] });
    },
    invalidateAllUsers: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  };
};

// 사용자 정보 프리페치 훅
export const usePrefetchUser = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  
  return async (userId: string) => {
    await queryClient.prefetchQuery({
      queryKey: ['users', userId],
      queryFn: async () => {
        const response = await authEP({
          func: getUserById,
          params: { userId }
        });
        return response.data;
      },
      staleTime: 1000 * 60 * 10, // 10분
    });
  };
};