import {MouseEventHandler, useCallback, useEffect, useState} from "react";
import {getAllMenus} from "../../../endpoints/menus-endpoints";
import {useRecoilState} from "recoil";
import recoil from "../../../stores/recoil";
import {MenuTabProps} from "./TabLayout";
import {useLocation, useNavigate, useParams} from "react-router-dom";

function useTabLayout(props : MenuTabProps) {
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  const navigate = useNavigate();
  const location = useLocation();
  
  // 전체 경로에서 마지막 부분만 추출
  const currentPath = location.pathname.split('/').pop();
  console.log("currentPath", currentPath)
  
  
  
  const [tabList, setTabList] = useState<any[]>([
    {
      label : "menu-list",
      value : "menus",
      index : 0,
    }, {
      label : "user-list",
      value : "users",
      index : 1,
    }, {
      label : "folder",
      value : "folder",
      index : 2,
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
      case 2:
        navigate("/admin/folder");
        break;
      default:
        break;
    }
    
  }, []);
  
  return {
    tabList,
    handleChangeTab,
    currentPath,
  }
}

export default useTabLayout;