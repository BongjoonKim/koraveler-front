import {useCallback, useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import recoil from "../../../../stores/recoil";
import axios from "axios";
import {getAllMenus} from "../../../../endpoints/menus-endpoints";
import {useAuth} from "../../../../appConfig/AuthContext";
import {endpointUtils} from "../../../../utils/endpointUtils";

export default function useLeftHeader() {
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  const [menus, setMenus] = useState<MenusDTO[]>([]);
  const {accessToken, setAccessToken} = useAuth();
  
  const getMenus = useCallback(async () => {
    try {
      const res = await endpointUtils.authAxios(getAllMenus, accessToken, setAccessToken);
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
  
  return {
    menus
  }
}