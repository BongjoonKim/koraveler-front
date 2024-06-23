import {MouseEventHandler, useCallback, useEffect, useState} from "react";
import {getAllMenus} from "../../../endpoints/menus-endpoints";
import {useRecoilState} from "recoil";
import recoil from "../../../stores/recoil";
import {MenuTabProps} from "./MenuTab";

function useMenuTab(props : MenuTabProps) {
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  const [menuList, setMenuList] = useState<MenusDTO[]>([]);
  // 메뉴 목록 불러오기
  const getMenuList = useCallback(async() => {
    try {
      const res = await getAllMenus();
      setMenuList(res.data);
    } catch (e) {
      setErrorMsg({
        status: "error",
        msg: "retrieve failed",
      })
    }
  }, [menuList, errorMsg]);
  
  // 메뉴 클릭 이벤트
  const handleChangeTab = useCallback((event : number) => {
    console.log("클릭 이벤트", event)
  }, []);
  
  useEffect(() => {
    getMenuList();
  }, []);
  
  return {
    menuList,
    handleChangeTab
  }
}

export default useMenuTab;