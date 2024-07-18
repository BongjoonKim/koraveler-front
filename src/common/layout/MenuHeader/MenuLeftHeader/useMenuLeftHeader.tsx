import {LeftHeaderProps} from "./MenuLeftHeader";
import {useCallback, useEffect, useState} from "react";
import {getAllMenus} from "../../../../endpoints/menus-endpoints";
import {useAuth} from "../../../../appConfig/AuthContext";
import {endpointUtils} from "../../../../utils/endpointUtils";
import {useRecoilState} from "recoil";
import recoil from "../../../../stores/recoil";


function useMenuLeftHeader(props : LeftHeaderProps) {
  const [menuList, setMenuList] = useState<MenusDTO[]>([]);
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  const {accessToken, setAccessToken} = useAuth();
  
  
  const getMenuList = useCallback(async () => {
    try {
      const res = await endpointUtils.authAxios(getAllMenus, accessToken, setAccessToken)
      setMenuList(res.data);
    } catch (e) {
      setErrorMsg({
        status: "error",
        msg: "get failed",
      })
    }
  }, []);
  
  useEffect(() => {
    // 메뉴 정보 가져오기
    getMenuList();
  }, []);
  
  return {
    menuList
  }
}

export default useMenuLeftHeader;