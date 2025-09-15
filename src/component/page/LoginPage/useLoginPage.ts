// src/hooks/useLoginPage.ts

import {ChangeEvent, useCallback, useState, KeyboardEvent} from "react";
import {InitUsersDTO} from "../../../types/users/initialUsers";
import {useNavigate} from "react-router-dom";
import {login} from "../../../endpoints/login-endpoints";
import {useRecoilState} from "recoil";
import recoil from "../../../stores/recoil";
import {useAuth} from "../../../appConfig/AuthProvider";
import {refreshTokenStorage} from "../../../appConfig/AuthProvider";
import {UsersDTO} from "../../../types/users/UsersDTO";
import {useCurrentUserActions} from "../../../hooks/useCurrentUser";

export default function useLoginPage() {
  const [userInfo, setUserInfo] = useState<UsersDTO>(InitUsersDTO);
  const [userId, setUserId] = useState<string>("");
  const [errMsg, setErrMsg] = useRecoilState(recoil.errMsg);
  const { refreshCurrentUser } = useCurrentUserActions();
  
  const navigate = useNavigate();
  const {setAccessToken} = useAuth();
  
  const handleChange = useCallback((event:ChangeEvent<HTMLInputElement>, type:string) => {
    if (type === "id") {
      setUserInfo((prev:any) => {
        return {
          ...prev,
          userId: event.target.value
        }
      })
    } else if (type === "password") {
      setUserInfo((prev:any) => {
        return {
          ...prev,
          userPassword: event.target.value
        }
      })
    }
  }, []);
  
  // 제목 누르기
  const handleClickTitle = useCallback(() => {
    navigate("/")
  }, [navigate]);
  
  // 로그인 버튼 클릭
  const handleClickLogin = useCallback(async () => {
    try {
      const resToken = await login(userInfo);
      
      if (resToken.data) {
        // accessToken은 Context(메모리)에만 저장
        setAccessToken(resToken.data.accessToken);
        
        // refreshToken은 sessionStorage에만 저장
        refreshTokenStorage.set(resToken.data.refreshToken!);
        
        await refreshCurrentUser(); // 명시적으로 사용자 정보 업데이트
        navigate('/blog/home');
      }
    } catch(e: any) {
      console.error("Login failed:", e);
      setErrMsg({
        status: "error",
        msg: e.response?.data?.message || "로그인에 실패했습니다."
      });
    }
  }, [userInfo, setAccessToken, navigate, setErrMsg]);
  
  const pressEnter = useCallback((event : KeyboardEvent) => {
    try {
      if (event?.key === 'Enter') {
        handleClickLogin();
      }
    } catch (e) {
      setErrMsg({
        status : "error",
        msg: "login fail"
      })
    }
  }, [handleClickLogin, setErrMsg]);
  
  const handleClickSignUp = useCallback(() => {
    navigate("/login/sign-up")
  }, [navigate]);
  
  return {
    userInfo,
    userId,
    handleClickTitle,
    handleChange,
    handleClickLogin,
    handleClickSignUp,
    pressEnter
  }
}