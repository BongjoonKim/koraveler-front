import {LeftHeaderProps} from "./MenuLeftHeader";
import {useCallback, useEffect, useState} from "react";
import {getAllMenus} from "../../../../endpoints/menus-endpoints";
import {useRecoilState} from "recoil";
import recoil from "../../../../stores/recoil";
import useAuthEP from "../../../../utils/useAuthEP";


function useMenuLeftHeader(props : LeftHeaderProps) {
  const [menuList, setMenuList] = useState<MenusDTO[]>([]);
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  const authEP = useAuthEP();
  
  
  const getMenuList = useCallback(async () => {
    try {
      const res = await authEP({
        func : getAllMenus,
      })
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