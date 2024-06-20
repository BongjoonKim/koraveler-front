import {MouseEvent, useCallback, useEffect, useState} from "react";
import {PrimitiveAtom, useAtom, useAtomValue} from "jotai";
import {AccessToken} from "../../../../stores/jotai/jotai";
import {loadable} from "jotai/utils";
import {getUserData} from "../../../../endpoints/users-endpoints";
import {useAuth} from "../../../../appConfig/AuthContext";
import {getAllMenus, getAllMenus2} from "../../../../endpoints/menus-endpoints";
import {useRecoilState} from "recoil";
import recoil from "../../../../stores/recoil";


function useRightHeader() {
  const [isSliderOpen ,setSliderOpen] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.alertMsg);
  const {accessToken, setAccessToken} = useAuth();
  
  const handleAvatarClick = useCallback((event : MouseEvent<HTMLSpanElement>) => {
    setSliderOpen(prev => !prev);
    getAllMenus2(accessToken, setAccessToken);
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