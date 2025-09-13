import {useCallback, useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import recoil from "../../../../stores/recoil";
import axios from "axios";
import {getAllMenus} from "../../../../endpoints/menus-endpoints";
import posthog from "posthog-js";
import {useLocation} from "react-router-dom";

export default function useLeftHeader() {
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  const [menus, setMenus] = useState<MenusDTO[]>([]);
  const location = useLocation();
  
  const getMenus = useCallback(async () => {
    try {
      
      const res = await getAllMenus();
      setMenus(res.data);
    } catch (e) {
      setErrorMsg({
        status: "error",
        msg: "retrieve failed",
      })
    }
  }, [menus]);
  
  useEffect(() => {
    getMenus();
  }, []);
  
  // 페이지 뷰 추적 (선택사항)
  useEffect(() => {
    // posthog.capture('page_view', {
    //   page: location.pathname,
    //   is_home: location.pathname === "/home"
    // });
  }, [location.pathname]);
  
  // 메뉴 호버 추적
  const handleMenuHover = (menuLabel: string) => {
    // posthog.capture('menu_hovered', {
    //   menu_label: menuLabel,
    //   current_page: location.pathname
    // });
  };
  
  return {
    menus,
    handleMenuHover
  }
}