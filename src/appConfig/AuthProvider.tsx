//src/appConfig/AuthProvider.tsx

import {createContext, ReactNode, useContext, useEffect, useState} from "react";

interface AuthContextType {
  accessToken: string | null | undefined;
  setAccessToken: (token: string | null | undefined) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Context에서 토큰을 가져오는 함수 타입
type TokenGetter = () => { accessToken: string | null | undefined; setAccessToken: (token: string | null | undefined) => void };

// 전역 토큰 getter 함수를 저장할 변수
let globalTokenGetter: TokenGetter | null = null;

// 토큰 getter를 설정하는 함수
export const setTokenGetter = (getter: TokenGetter) => {
  globalTokenGetter = getter;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null | undefined>(null);
  
  // Context 값이 변경될 때마다 endpointUtils에 getter 함수 설정
  useEffect(() => {
    setTokenGetter(() => ({ accessToken, setAccessToken }));
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
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