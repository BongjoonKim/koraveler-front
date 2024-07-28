import {MouseEvent, useCallback, useEffect, useState} from "react";
import {PrimitiveAtom, useAtom, useAtomValue} from "jotai";
import {LoginUser} from "../../../../stores/jotai/jotai";
import {loadable} from "jotai/utils";
import {getUserData} from "../../../../endpoints/users-endpoints";
import {useAuth} from "../../../../appConfig/AuthContext";
import {getAllMenus, getAllMenus2, getAllMenus3} from "../../../../endpoints/menus-endpoints";
import {useRecoilState} from "recoil";
import recoil from "../../../../stores/recoil";
import {useNavigate} from "react-router-dom";
import {endpointUtils} from "../../../../utils/endpointUtils";
import {getLoginUser} from "../../../../endpoints/login-endpoints";
import {REFESHTOKEN_EXPIRED} from "../../../../constants/ErrorCode";


function useRightHeader() {
  const [isSliderOpen ,setSliderOpen] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  const {accessToken, setAccessToken} = useAuth();
  const navigate = useNavigate();
  const [loginUser, setLoginUser] = useAtom(LoginUser);
  
  const handleAvatarClick = useCallback(async (event : MouseEvent<HTMLSpanElement>) => {
    setSliderOpen(prev => !prev);
    try {
      // await getAllMenus2(accessToken, setAccessToken);
      // await getAllMenus3(accessToken, setAccessToken);
      console.log("엑세스 토큰", accessToken)
    } catch (e) {
      console.log("여기는 안 오냐?", e)
      if (e === "refreshToken expired") {
        navigate("/login")
      }
    }
  }, [isSliderOpen]);
  
  const getUserInfo = useCallback(async () => {
    try {
      const res = await endpointUtils.authAxios({
        func : getLoginUser,
        accessToken : accessToken,
        setAccessToken : setAccessToken
      });
      console.log("res", res)
      if (res.data) {
        setLoginUser(res.data);
      }
    } catch (e) {
      if (e === REFESHTOKEN_EXPIRED) {
        navigate("/login")
      }
      setErrorMsg({
        status: "error",
        msg: "retrieve failed",
      })
    }
  }, [accessToken, loginUser]);
  
  useEffect(() => {
    getUserInfo();
  }, []);
  
  return {
    loginUser,
    isSliderOpen,
    setSliderOpen,
    handleAvatarClick
  }
}

export default useRightHeader;