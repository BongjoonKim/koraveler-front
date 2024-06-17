import {ChangeEvent, useCallback, useState} from "react";
import {InitUsersDTO} from "../../../types/users/initialUsers";
import {useNavigate} from "react-router-dom";
import {login} from "../../../endpoints/login-endpoints";

export default function useLoginPage() {
  const [userInfo, setUserInfo] = useState<UsersDTO>(InitUsersDTO);
  const [userId, setUserId] = useState<string>("");
  const navigate = useNavigate();
  
  const handleChange = useCallback((event:any, type:string) => {
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
          userPassword: event
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
    console.log("resToken", resToken);
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