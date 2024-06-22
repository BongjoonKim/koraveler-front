import {MouseEvent, useCallback, useEffect, useState} from "react";
import {PrimitiveAtom, useAtom, useAtomValue} from "jotai";
import {AccessToken} from "../../../../stores/jotai/jotai";
import {loadable} from "jotai/utils";
import {getUserData} from "../../../../endpoints/users-endpoints";
import {useAuth} from "../../../../appConfig/AuthContext";
import {getAllMenus, getAllMenus2, getAllMenus3} from "../../../../endpoints/menus-endpoints";
import {useRecoilState} from "recoil";
import recoil from "../../../../stores/recoil";
import {useNavigate} from "react-router-dom";
import {endpointUtils} from "../../../../utils/endpointUtils";


function useRightHeader() {
  const [isSliderOpen ,setSliderOpen] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.alertMsg);
  const {accessToken, setAccessToken} = useAuth();
  const navigate = useNavigate();
  
  const handleAvatarClick = useCallback(async (event : MouseEvent<HTMLSpanElement>) => {
    setSliderOpen(prev => !prev);
    try {
      // await getAllMenus2(accessToken, setAccessToken);
      // await getAllMenus3(accessToken, setAccessToken);
      console.log("엑세스 토큰", accessToken)
      await endpointUtils.authAxios(getAllMenus3, accessToken, setAccessToken);
    } catch (e) {
      console.log("여기는 안 오냐?", e)
      if (e === "refreshToken expired") {
        navigate("/login")
      }
    }
  }, [isSliderOpen]);
  
  const getUserInfo = useCallback(async () => {
    try {
      const res = await getUserData();
    } catch (e) {
      setErrorMsg({
        status: "error",
        title: "retrieve failed",
        description: "retrieve menus failed",
      })
    }
  }, [accessToken]);
  
  useEffect(() => {
    getUserInfo();
  }, []);
  
  return {
    isSliderOpen,
    setSliderOpen,
    handleAvatarClick
  }
}

export default useRightHeader;