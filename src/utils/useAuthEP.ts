// src/utils/useAuthEP.ts

import { useAuth } from "../appConfig/AuthProvider";
import { useQueryClient } from '@tanstack/react-query';
import {useCurrentUserActions} from "../hooks/useCurrentUser";

interface AxiosProps {
  func?: any;
  params?: any;
  reqBody?: any;
}

export interface FuncProps {
  accessToken?: any;
  params?: any;
  reqBody?: any;
}

export default function useAuthEP() {
  const { accessToken, refreshTokenIfNeeded } = useAuth();
  const queryClient = useQueryClient();
  const {refreshCurrentUser} = useCurrentUserActions();
  
  return async (props: AxiosProps) => {
    try {
      // 1차 시도: 현재 accessToken으로
      if (accessToken) {
        try {
          return await props.func({
            accessToken: accessToken,
            params: props?.params,
            reqBody: props?.reqBody
          });
        } catch (error: any) {
          // 401 에러인 경우 토큰 갱신 시도
          if (error.response?.status === 401) {
            console.log('[useAuthEP] 401 error, attempting refresh...');
            throw new Error('TOKEN_EXPIRED');
          }
          throw error;
        }
      }
      
      // accessToken이 없으면 갱신 시도
      throw new Error('ACCESSTOKEN_NULL');
      
    } catch (e: any) {
      console.log('[useAuthEP] Error:', e.message);
      
      // 토큰 갱신 시도
      const newAccessToken = await refreshTokenIfNeeded();
      
      if (newAccessToken) {
        // 토큰이 갱신되었으므로 사용자 정보도 새로고침
        console.log('[useAuthEP] Token refreshed, invalidating user cache');
        
        // 기존 currentUser 캐시 무효화
        await queryClient.invalidateQueries({
          queryKey: ['currentUser'],
          exact: false // 모든 currentUser 관련 쿼리 무효화
        });
        
        // 새 토큰으로 재시도
        const result = await props.func({
          accessToken: newAccessToken,
          params: props?.params,
          reqBody: props?.reqBody
        });
        
        // 토큰 갱신 후 성공했으면 currentUser 쿼리 즉시 실행
        console.log("현재 사용자 유저 갱신되나")
        await refreshCurrentUser()
        
        return result;
      }
      
      // 갱신 실패 시 에러
      console.error('[useAuthEP] Authentication failed');
      
      // 인증 실패 시 사용자 정보 초기화
      queryClient.removeQueries({ queryKey: ['currentUser'] });
      
      throw new Error('AUTHENTICATION_FAILED');
    }
  };
}