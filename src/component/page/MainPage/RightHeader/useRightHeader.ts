import {MouseEvent, useCallback, useEffect, useState} from "react";
import {PrimitiveAtom, useAtom, useAtomValue} from "jotai";
import {AccessToken} from "../../../../stores/jotai/jotai";
import {loadable} from "jotai/utils";
import {getUserData} from "../../../../endpoints/users-endpoints";
import useAxiosInterceptors from "../../../../appConfig/request-response";


function useRightHeader() {
  useAxiosInterceptors();
  const [isSliderOpen ,setSliderOpen] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useAtom(AccessToken);
  
  
  const handleAvatarClick = useCallback((event : MouseEvent<HTMLSpanElement>) => {
    setSliderOpen(prev => !prev);
  }, [isSliderOpen]);
  
  const getUserInfo = useCallback(async () => {
    const res = await getUserData();
    console.log("res", res)
  }, []);
  
  useEffect(() => {
    console.log('조회횟수', accessToken)
    getUserInfo();
  }, []);
  
  return {
    isSliderOpen,
    setSliderOpen,
    handleAvatarClick
  }
}

export default useRightHeader;