import {useCallback, useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import recoil from "../../../../stores/recoil";
import axios from "axios";
import {getAllMenus} from "../../../../endpoints/menus-endpoints";

export default function useLeftHeader() {
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.alertMsg);
  const [menus, setMenus] = useState<MenusDTO[]>([]);
  
  
  const getMenus = useCallback(async () => {
    try {
      const res = await getAllMenus();
      setMenus(res.data);
    } catch (e) {
      setErrorMsg({
        status: "error",
        title: "retrieve failed",
        description: "retrieve menus failed",
      })
    }
  }, [menus]);
  
  useEffect(() => {
    getMenus();
  }, []);
  
  return {
    menus
  }
}