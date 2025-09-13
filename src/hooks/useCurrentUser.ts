// src/hooks/useCurrentUser.ts
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../appConfig/AuthProvider';
import { currentUserAtom } from '../stores/messengerStore/messengerStore';
import { getLoginUser } from '../endpoints/login-endpoints';
import useAuthEP from '../utils/useAuthEP';
import type { UserSummary } from '../types/messenger/messengerTypes'; // 타입 import 추가

export const useCurrentUser = (): UserSummary | null => {  // 반환 타입 명시
  const { accessToken } = useAuth();
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const authEP = useAuthEP();
  
  // 로그인한 사용자 정보 조회
  const { data: userData } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      if (!accessToken) return null;
      try {
        const response = await authEP({ func: getLoginUser });
        return response.data;
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        return null;
      }
    },
    enabled: !!accessToken && !currentUser,
    staleTime: 1000 * 60 * 30, // 30분
  });
  
  // currentUserAtom 업데이트
  useEffect(() => {
    if (userData && !currentUser) {
      const userSummary: UserSummary = {
        id: userData.userId || userData.id || '',
        username: userData.username || userData.userId || '',
        nickname: userData.nickname || userData.userName,
        avatarUrl: userData.profileImage || userData.avatarUrl,
        isOnline: true
      };
      setCurrentUser(userSummary);
    }
  }, [userData, currentUser, setCurrentUser]);
  
  return currentUser;
};