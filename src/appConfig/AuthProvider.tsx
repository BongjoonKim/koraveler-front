// src/appConfig/AuthProvider.tsx

import { createContext, ReactNode, useContext, useEffect, useState, useRef } from "react";

interface AuthContextType {
  accessToken: string | null | undefined;
  setAccessToken: (token: string | null | undefined) => void;
  clearAuth: () => void;
  refreshTokenIfNeeded: () => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// localStorage 사용으로 변경 (sessionStorage는 탭 닫으면 사라짐)
export const refreshTokenStorage = {
  get: (): string | null => {
    try {
      // localStorage로 변경
      const token = localStorage.getItem('refreshToken');
      if (token) {
        // 토큰 유효성 간단 체크
        const parts = token.split('.');
        if (parts.length === 3) {
          return token;
        }
      }
      return null;
    } catch (error) {
      console.error('Failed to get refresh token:', error);
      return null;
    }
  },
  
  set: (token: string | null) => {
    try {
      if (token) {
        localStorage.setItem('refreshToken', token);
        // 디버깅용 로그
        console.log('[Storage] RefreshToken saved');
      } else {
        localStorage.removeItem('refreshToken');
      }
    } catch (error) {
      console.error('Failed to set refresh token:', error);
    }
  },
  
  clear: () => {
    try {
      localStorage.removeItem('refreshToken');
      console.log('[Storage] RefreshToken cleared');
    } catch (error) {
      console.error('Failed to clear refresh token:', error);
    }
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null | undefined>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const refreshingPromise = useRef<Promise<string | null> | null>(null);
  
  // 토큰 갱신 함수 (중복 호출 방지)
  const refreshTokenIfNeeded = async (): Promise<string | null> => {
    // 이미 갱신 중이면 기존 Promise 반환
    if (refreshingPromise.current) {
      return refreshingPromise.current;
    }
    
    const refreshToken = refreshTokenStorage.get();
    
    if (!refreshToken) {
      return null;
    }
    
    // 갱신 Promise 생성
    refreshingPromise.current = (async () => {
      try {
        console.log('[Auth] Refreshing token...');
        const { udtRefreshToken } = await import('../endpoints/login-endpoints');
        const res = await udtRefreshToken(refreshToken);
        
        if (res.data?.accessToken) {
          setAccessToken(res.data.accessToken);
          
          // 새 refreshToken이 있으면 업데이트
          if (res.data.refreshToken) {
            refreshTokenStorage.set(res.data.refreshToken);
          }
          
          console.log('[Auth] Token refreshed successfully');
          return res.data.accessToken;
        }
        
        throw new Error('No access token in response');
      } catch (error) {
        console.error('[Auth] Token refresh failed:', error);
        refreshTokenStorage.clear();
        setAccessToken(null);
        return null;
      } finally {
        // 갱신 완료 후 Promise 초기화
        refreshingPromise.current = null;
      }
    })();
    
    return refreshingPromise.current;
  };
  
  // 초기 인증 체크 (마운트 시 한 번만)
  useEffect(() => {
    const initializeAuth = async () => {
      const refreshToken = refreshTokenStorage.get();
      
      if (refreshToken) {
        console.log('[Auth] Initializing with stored refresh token');
        await refreshTokenIfNeeded();
      }
      
      setIsInitialized(true);
    };
    
    if (!isInitialized) {
      initializeAuth();
    }
  }, [isInitialized]);
  
  // 로그아웃
  const clearAuth = () => {
    console.log('[Auth] Clearing authentication');
    setAccessToken(null);
    refreshTokenStorage.clear();
  };
  
  // 디버깅: 토큰 상태 로깅
  useEffect(() => {
    console.log('[Auth] AccessToken status:', accessToken ? 'Present' : 'Absent');
  }, [accessToken]);
  
  return (
    <AuthContext.Provider value={{
      accessToken,
      setAccessToken,
      clearAuth,
      refreshTokenIfNeeded
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