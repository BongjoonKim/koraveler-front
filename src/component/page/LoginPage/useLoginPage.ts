import {useCallback, useState} from "react";
import {InitUsersDTO} from "../../../types/users/initialUsers";
import {useNavigate} from "react-router-dom";

export default function useLoginPage() {
  const [userInfo, setUserInfo] = useState<UsersDTO>(InitUsersDTO);
  const navigate = useNavigate();
  
  // 제목 누르기
  const handleClickTitle = useCallback(() => {
    navigate("/")
  }, []);
  
  return {
    userInfo,
    handleClickTitle
  }
  
}