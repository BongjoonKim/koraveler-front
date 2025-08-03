import {ChangeEvent, useCallback, useState, KeyboardEvent} from "react";
import {InitUsersDTO} from "../../../types/users/initialUsers";
import {useNavigate} from "react-router-dom";
import {login} from "../../../endpoints/login-endpoints";
import {useAtom} from "jotai";
import {setCookie} from "../../../utils/cookieUtils";
import {useRecoilState} from "recoil";
import recoil from "../../../stores/recoil";
import {useAuth} from "../../../appConfig/AuthProvider";

export default function useLoginPage() {
  const [userInfo, setUserInfo] = useState<UsersDTO>(InitUsersDTO);
  const [userId, setUserId] = useState<string>("");
  const [errMsg, setErrMsg] = useRecoilState(recoil.errMsg);
  
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
  
  }, [userInfo])
  
  // 제목 누르기
  const handleClickTitle = useCallback(() => {
    navigate("/")
  }, []);
  
  // 로그인 버튼 클릭
  const handleClickLogin = useCallback(async () => {
    try {
    const resToken = await login(userInfo);
    if (resToken.data) {
      setAccessToken(resToken.data.accessToken);
      setCookie("accessToken", resToken.data.accessToken!)
      setCookie("refreshToken", resToken.data.refreshToken!)
    }
    navigate('/blog/home')
    } catch(e) {
      console.log("handleClickLogin", e);
    }
  }, [userInfo]);
  
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
  }, [handleClickLogin]);
  
  const handleClickSignUp = () => {
    navigate("/login/sign-up")
  }
  
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