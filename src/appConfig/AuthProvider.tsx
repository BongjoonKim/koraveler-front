// src/appConfig/AuthProvider.tsx

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface AuthContextType {
  accessToken: string | null | undefined;
  setAccessToken: (token: string | null | undefined) => void;
  clearAuth: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Context에서 토큰을 가져오는 함수 타입
type TokenGetter = () => {
  accessToken: string | null | undefined;
  setAccessToken: (token: string | null | undefined) => void;
};

// 전역 토큰 getter 함수를 저장할 변수
let globalTokenGetter: TokenGetter | null = null;

// 토큰 getter를 설정하는 함수
export const setTokenGetter = (getter: TokenGetter) => {
  globalTokenGetter = getter;
};

// refreshToken을 sessionStorage에서 관리하는 유틸리티
export const refreshTokenStorage = {
  get: (): string | null => {
    try {
      const token = sessionStorage.getItem('refreshToken');
      return token;
    } catch (error) {
      console.error('Failed to get refresh token from sessionStorage:', error);
      return null;
    }
  },
  
  set: (token: string | null) => {
    try {
      if (token) {
        sessionStorage.setItem('refreshToken', token);
      } else {
        sessionStorage.removeItem('refreshToken');
      }
    } catch (error) {
      console.error('Failed to set refresh token in sessionStorage:', error);
    }
  },
  
  clear: () => {
    try {
      sessionStorage.removeItem('refreshToken');
    } catch (error) {
      console.error('Failed to clear refresh token from sessionStorage:', error);
    }
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // accessToken은 메모리에만 저장 (보안상 새로고침 시 사라짐)
  const [accessToken, setAccessToken] = useState<string | null | undefined>(null);
  
  // 컴포넌트 마운트 시 refreshToken이 있으면 자동으로 accessToken 발급
  useEffect(() => {
    const initializeAuth = async () => {
      const refreshToken = refreshTokenStorage.get();
      
      if (refreshToken && !accessToken) {
        try {
          // refreshToken으로 새 accessToken 발급 시도
          const { udtRefreshToken } = await import('../endpoints/login-endpoints');
          const res = await udtRefreshToken(refreshToken);
          
          if (res.data) {
            setAccessToken(res.data.accessToken);
            // 새로운 refreshToken이 왔다면 업데이트
            if (res.data.refreshToken) {
              refreshTokenStorage.set(res.data.refreshToken);
            }
          } else {
            // refreshToken이 만료된 경우
            refreshTokenStorage.clear();
          }
        } catch (error) {
          console.error('Failed to refresh token on mount:', error);
          refreshTokenStorage.clear();
        }
      }
    };
    
    initializeAuth();
  }, []); // 최초 마운트 시 한 번만 실행
  
  // Context 값이 변경될 때마다 endpointUtils에 getter 함수 설정
  useEffect(() => {
    setTokenGetter(() => ({ accessToken, setAccessToken }));
  }, [accessToken]);
  
  // 로그아웃 시 모든 인증 정보 제거
  const clearAuth = () => {
    setAccessToken(null);
    refreshTokenStorage.clear();
  };
  
  return (
    <AuthContext.Provider value={{
      accessToken,
      setAccessToken,
      clearAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};