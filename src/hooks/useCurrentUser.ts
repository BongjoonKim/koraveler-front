// src/hooks/useCurrentUser.ts
import { useEffect, useCallback } from 'react';
import { useAtom } from 'jotai';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../appConfig/AuthProvider';
import { currentUserAtom } from '../stores/messengerStore/messengerStore';
import { getLoginUser } from '../endpoints/login-endpoints';
import useAuthEP from '../utils/useAuthEP';
import type { UserSummary } from '../types/messenger/messengerTypes';

export const useCurrentUser = (): UserSummary | null => {
  const { accessToken } = useAuth();
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  
  // 로그인한 사용자 정보 조회
  const { data: userData, isSuccess, isError, isFetching, refetch } = useQuery({
    queryKey: ['currentUser', accessToken],
    queryFn: async () => {
      if (!accessToken) {
        return null;
      }
      
      try {
        const response = await authEP({ func: getLoginUser });
        console.log("사용자 정보 조회 성공:", response.data);
        return response.data;
      } catch (error : any) {
        console.error('사용자 정보 조회 실패:', error);
        // AUTHENTICATION_FAILED 에러인 경우 null 반환
        if (error.message === 'AUTHENTICATION_FAILED') {
          return null;
        }
        throw error; // 다른 에러는 재시도를 위해 throw
      }
    },
    enabled: !!accessToken,
    staleTime: 0, // 즉시 stale 처리하여 항상 최신 데이터 fetch
    gcTime: 1000 * 60 * 10, // 10분
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
  
  // 수동으로 사용자 정보 새로고침
  const refreshCurrentUser = useCallback(async () => {
    if (accessToken) {
      await queryClient.invalidateQueries({ queryKey: ['currentUser', accessToken] });
      await refetch();
    }
  }, [accessToken, queryClient, refetch]);
  
  // accessToken 변경 시 처리
  useEffect(() => {
    if (!accessToken) {
      // 로그아웃 시 즉시 처리
      setCurrentUser(null);
      queryClient.removeQueries({ queryKey: ['currentUser'] });
      queryClient.cancelQueries({ queryKey: ['currentUser'] });
      console.log("토큰 없음: 사용자 정보 초기화");
    } else {
      // 로그인 시 즉시 재조회
      refreshCurrentUser();
    }
  }, [accessToken]); // refreshCurrentUser는 의존성에서 제외 (무한 루프 방지)
  
  // userData 업데이트 처리
  useEffect(() => {
    // 로딩 중이면 처리하지 않음
    if (isFetching) return;
    
    if (isSuccess && userData && accessToken) {
      const userSummary: UserSummary = {
        id: userData.userId || userData.id || '',
        username: userData.username || userData.userId || '',
        nickname: userData.nickname || userData.userName || userData.username || '',
        avatarUrl: userData.profileImage || userData.avatarUrl || null,
        isOnline: true
      };
      
      // 데이터가 실제로 변경된 경우에만 업데이트
      if (JSON.stringify(currentUser) !== JSON.stringify(userSummary)) {
        setCurrentUser(userSummary);
        console.log("사용자 정보 설정:", userSummary);
      }
    } else if ((isError || (isSuccess && !userData)) && accessToken) {
      if (currentUser !== null) {
        setCurrentUser(null);
        console.log("사용자 정보 조회 실패: null로 설정");
      }
    }
  }, [userData, isSuccess, isError, accessToken, isFetching]); // currentUser와 setCurrentUser는 제외
  
  return currentUser;
};

// 로그인/로그아웃 시 명시적으로 호출할 수 있는 유틸리티 함수
export const useCurrentUserActions = () => {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();
  
  const refreshCurrentUser = useCallback(async () => {
    if (accessToken) {
      await queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      await queryClient.refetchQueries({ queryKey: ['currentUser'] });
    }
  }, [accessToken, queryClient]);
  
  const clearCurrentUser = useCallback(() => {
    queryClient.removeQueries({ queryKey: ['currentUser'] });
    queryClient.cancelQueries({ queryKey: ['currentUser'] });
  }, [queryClient]);
  
  return { refreshCurrentUser, clearCurrentUser };
};