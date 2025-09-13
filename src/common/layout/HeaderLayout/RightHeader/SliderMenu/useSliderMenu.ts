// src/hooks/useSliderMenu.ts

import {MouseEventHandler, useCallback} from "react";
import {SliderMenuProps} from "./SliderMenu";
import {useNavigate} from "react-router-dom";
import {logout} from "../../../../../endpoints/login-endpoints";
import {useRecoilState} from "recoil";
import recoil from "../../../../../stores/recoil";
import {useAuth} from "../../../../../appConfig/AuthProvider";
import {refreshTokenStorage} from "../../../../../appConfig/AuthProvider";

function useSliderMenu(props : SliderMenuProps) {
  const [loginUser, setLoginUser] = useRecoilState(recoil.userData);
  const {setAccessToken, clearAuth} = useAuth();
  const navigate = useNavigate();
  
  const handleAvatarClick = useCallback((event : MouseEventHandler<HTMLDivElement>) => {
    props.setSliderOpen(prev => !prev);
  }, [props.setSliderOpen]);
  
  // 로그인 페이지로 넘어가기
  const handleLoginClick = useCallback(() => {
    navigate("/login")
  }, [navigate]);
  
  // 로그아웃 로직
  const handleLogout = useCallback(async () => {
    try {
      const res = await logout();
      console.log("res.logout", res)
      
      if (res.status === 200) {
        // Recoil 유저 정보 초기화
        setLoginUser({});
        
        // Context의 accessToken 제거 및 sessionStorage의 refreshToken 제거
        clearAuth();
        // 또는 개별적으로:
        // setAccessToken(null);
        // refreshTokenStorage.clear();
        
        // 로그인 페이지로 이동 (선택사항)
        navigate("/login");
      } else {
        throw res.statusText;
      }
    } catch (e) {
      console.error("logout error", e);
      // 서버 에러가 있어도 로컬 토큰은 제거
      setLoginUser({});
      clearAuth();
      navigate("/login");
    }
  }, [setLoginUser, clearAuth, navigate]);
  
  return {
    handleAvatarClick,
    handleLoginClick,
    loginUser,
    handleLogout,
    navigate
  }
}

export default useSliderMenu;