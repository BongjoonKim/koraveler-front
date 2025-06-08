import {MouseEventHandler, useCallback} from "react";
import {SliderMenuProps} from "./SliderMenu";
import {useNavigate} from "react-router-dom";
import {useAtomValue} from "jotai";
import {LoginUser} from "../../../../../stores/jotai/jotai";
import {logout} from "../../../../../endpoints/login-endpoints";
import {useRecoilState, useSetRecoilState} from "recoil";
import recoil from "../../../../../stores/recoil";
import {setCookie} from "../../../../../utils/cookieUtils";
import {useAuth} from "../../../../../appConfig/AuthProvider";

function useSliderMenu(props : SliderMenuProps) {
  // const loginUser = useAtomValue(LoginUser);
  const [loginUser, setLoginUser] = useRecoilState(recoil.userData);
  const {setAccessToken}= useAuth();
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
      console.log("res", res)
      if (res.status === 200) {
        setLoginUser({});
        setAccessToken("");
        setCookie("refreshToken", "");
      } else {
        throw res.statusText;
      }
    } catch (e) {
      console.log("logout error", e)
    }
  }, []);
  
  return {
    handleAvatarClick,
    handleLoginClick,
    loginUser,
    handleLogout,
    navigate
  }
}

export default useSliderMenu;