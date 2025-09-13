// src/utils/useAuthEP.ts

import { udtRefreshToken } from "../endpoints/login-endpoints";
import { useAuth } from "../appConfig/AuthProvider";
import { refreshTokenStorage } from "../appConfig/AuthProvider";

interface AxiosProps {
  func?: any;
  accessToken?: any;
  setAccessToken?: any;
  params?: any;
  reqBody?: any;
}

export interface FuncProps {
  accessToken?: any;
  params?: any;
  reqBody?: any;
}

// Hook 기반 useAuthEP
export default function useAuthEP() {
  const { accessToken, setAccessToken, clearAuth } = useAuth();
  
  return async (props: AxiosProps) => {
    try {
      // accessToken이 있으면 바로 API 호출
      if (accessToken) {
        return await props.func({
          accessToken: accessToken,
          params: props?.params,
          reqBody: props?.reqBody
        });
      } else {
        // accessToken이 없으면 refreshToken으로 재발급 시도
        throw new Error('ACCESSTOKEN_NULL');
      }
    } catch (e: any) {
      // accessToken이 없거나 만료된 경우
      // sessionStorage에서 refreshToken 가져오기
      const refreshToken = refreshTokenStorage.get();
      
      if (refreshToken && refreshToken !== "undefined") {
        try {
          // refreshToken으로 새로운 accessToken 요청
          const res = await udtRefreshToken(refreshToken);
          
          if (res.data) {
            // 새로운 accessToken 저장
            setAccessToken(res.data.accessToken);
            
            // 새로운 refreshToken이 왔다면 sessionStorage 업데이트
            if (res.data.refreshToken) {
              refreshTokenStorage.set(res.data.refreshToken);
            }
            
            // 원래 요청 재시도
            return await props.func({
              accessToken: res.data.accessToken,
              params: props?.params,
              reqBody: props?.reqBody
            });
          } else {
            // 토큰 갱신 실패
            console.error('Token refresh failed: No data received');
            clearAuth();
            throw new Error('REFRESHTOKEN_EXPIRED');
          }
        } catch (refreshError) {
          console.error('Token refresh error:', refreshError);
          clearAuth();
          
          // 로그인 페이지로 리다이렉트 (옵션)
          // window.location.href = '/login';
          
          throw new Error('REFRESHTOKEN_EXPIRED');
        }
      } else {
        // refreshToken이 없는 경우
        console.error('No refresh token available');
        clearAuth();
        
        // 로그인 페이지로 리다이렉트 (옵션)
        // window.location.href = '/login';
        
        throw new Error('REFRESHTOKEN_NOT_FOUND');
      }
    }
  };
}