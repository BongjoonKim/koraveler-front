// src/utils/useAuthEP.ts

import { useAuth } from "../appConfig/AuthProvider";

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
        // 새 토큰으로 재시도
        return await props.func({
          accessToken: newAccessToken,
          params: props?.params,
          reqBody: props?.reqBody
        });
      }
      
      // 갱신 실패 시 에러
      console.error('[useAuthEP] Authentication failed');
      throw new Error('AUTHENTICATION_FAILED');
    }
  };
}