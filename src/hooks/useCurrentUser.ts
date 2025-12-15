// src/hooks/useCurrentUser.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../appConfig/AuthProvider';
import { getLoginUser } from '../endpoints/login-endpoints';
import useAuthEP from '../utils/useAuthEP';
import type { UserSummary } from '../types/messenger/messengerTypes';

interface UseCurrentUserReturn  {
  data : UserSummary | null;
  isLoading : boolean;
  isError : boolean;
}

export const useCurrentUser = (): UseCurrentUserReturn => {
  const {accessToken, isInitialized} = useAuth();
  const authEP = useAuthEP();
  
  // 로그인한 사용자 정보 조회
  const {data, isLoading, isError} = useQuery({
    queryKey: ['currentUser', accessToken],
    queryFn: async () => {
      if (!accessToken) {
        return null;
      }
      
      try {
        const response = await authEP({func: getLoginUser});
        console.log("사용자 정보 조회 성공:", response.data);
        
        // UserSummary 형태로 변환하여 반환
        const userSummary: UserSummary = {
          id: response.data.userId || response.data.id || '',
          username: response.data.username || response.data.userId || '',
          nickname: response.data.nickname || response.data.userName || response.data.username || '',
          avatarUrl: response.data.profileImage || response.data.avatarUrl || null,
          roles: response.data.roles || [],
          isOnline: true,
        };
        
        return userSummary;
      } catch (error: any) {
        console.error('사용자 정보 조회 실패:', error);
        // AUTHENTICATION_FAILED 에러인 경우 null 반환
        if (error.message === 'AUTHENTICATION_FAILED') {
          return null;
        }
        throw error; // 다른 에러는 재시도를 위해 throw
      }
    },
    enabled: isInitialized && !!accessToken,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 20, // 0분
    refetchOnWindowFocus: true, // 창 포커스 시 재조회
    refetchOnReconnect: true,
    retry: (failureCount, error) => {
      // AUTHENTICATION_FAILED는 재시도하지 않음
      if (error?.message === 'AUTHENTICATION_FAILED') {
        return false;
      }
      return failureCount < 2;
    },
  });
  
  return {
   data : data ?? null,
   isLoading : !isInitialized || isLoading,
   isError
  }
};