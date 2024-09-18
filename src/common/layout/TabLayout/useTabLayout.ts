import {MouseEventHandler, useCallback, useEffect, useState} from "react";
import {getAllMenus} from "../../../endpoints/menus-endpoints";
import {useRecoilState} from "recoil";
import recoil from "../../../stores/recoil";
import {MenuTabProps} from "./TabLayout";
import {useAuth} from "../../../appConfig/AuthContext";
import {endpointUtils} from "../../../utils/endpointUtils";
import {useNavigate} from "react-router-dom";

function useTabLayout(props : MenuTabProps) {
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  const {accessToken, setAccessToken} = useAuth();
  const navigate = useNavigate();
  const [tabList, setTabList] = useState<any[]>([
    {
      label : "menu-list"
    }, {
      label : "user-list"
    }
  ]);
  
  
  // 메뉴 클릭 이벤트
  const handleChangeTab = useCallback((index : number) => {
    switch (index) {
      case 0:
        navigate("/admin/menu");
        break;
      case 1:
        navigate("/admin/users");
        break;
      default:
        break;
    }
    
  }, []);
  
  return {
    tabList,
    handleChangeTab
  }
}

export default useTabLayout;