import {MouseEventHandler, useCallback} from "react";
import {SliderMenuProps} from "./SliderMenu";
import {useNavigate} from "react-router-dom";
import {useAtomValue} from "jotai";
import {LoginUser} from "../../../../../stores/jotai/jotai";

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
  
  //
  
  return {
    handleAvatarClick,
    handleLoginClick,
    loginUser
  }
}

export default useSliderMenu;