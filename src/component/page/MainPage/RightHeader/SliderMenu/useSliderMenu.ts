import {MouseEventHandler, useCallback} from "react";
import {SliderMenuProps} from "./SliderMenu";
import {useNavigate} from "react-router-dom";
import {useAtomValue} from "jotai";
import {LoginUser} from "../../../../../stores/jotai/jotai";
import {logout} from "../../../../../endpoints/login-endpoints";

function useSliderMenu(props : SliderMenuProps) {
  const loginUser = useAtomValue(LoginUser);
  const navigate = useNavigate();
  
  const handleAvatarClick = useCallback((event : MouseEventHandler<HTMLDivElement>) => {
    props.setSliderOpen(prev => !prev);
  }, [props.isSliderOpen]);
  
  // 로그인 페이지로 넘어가기
  const handleLoginClick = useCallback(() => {
    navigate("/login")
  }, []);
  
  // 로그아웃 로직
  const handleLogout = useCallback(async () => {
    try {
      const res = await logout();
    } catch (e) {
      console.log("logout error", e)
    }
  }, []);
  
  return {
    handleAvatarClick,
    handleLoginClick,
    loginUser,
    handleLogout
  }
}

export default useSliderMenu;