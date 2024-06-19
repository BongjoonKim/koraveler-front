import {ChangeEvent, useCallback, useState} from "react";
import {InitUsersDTO} from "../../../types/users/initialUsers";
import {useNavigate} from "react-router-dom";
import {login} from "../../../endpoints/login-endpoints";
import {useAtom} from "jotai";
import {AccessToken} from "../../../stores/jotai/jotai";
import {setCookie} from "../../../utils/cookieUtils";

export default function useLoginPage() {
  const [userInfo, setUserInfo] = useState<UsersDTO>(InitUsersDTO);
  const [userId, setUserId] = useState<string>("");
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useAtom(AccessToken);
  
  const handleChange = useCallback((event:ChangeEvent<HTMLInputElement>, type:string) => {
    console.log("event", event.target.value)
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
      setAccessToken(resToken.data.refreshToken);
      setCookie("refreshToken", resToken.data.refreshToken!)
    }
    navigate('/')
    } catch(e) {
      console.log("handleClickLogin", e);
    }
  
  }, [userInfo]);
  
  return {
    userInfo,
    userId,
    handleClickTitle,
    handleChange,
    handleClickLogin
  }
  
}