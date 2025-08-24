import {MouseEventHandler, useCallback, useEffect, useState} from "react";
import {getAllMenus} from "../../../endpoints/menus-endpoints";
import {useRecoilState} from "recoil";
import recoil from "../../../stores/recoil";
import {MenuTabProps} from "./TabLayout";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import { TabItem } from "../../elements/CusTab/CusTab";

function useTabLayout(props : MenuTabProps) {
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  const navigate = useNavigate();
  const location = useLocation();
  
  // 전체 경로에서 마지막 부분만 추출
  const currentPath = location.pathname.split('/').pop();
  console.log("currentPath", currentPath)
  
  // TabItem[] 타입으로 변경하고 value를 경로 기반으로 설정
  const [tabList, setTabList] = useState<TabItem[]>([
    {
      label: "menu-list",
      value: "menu", // 경로의 마지막 부분과 일치하도록 설정
    },
    {
      label: "user-list",
      value: "users",
    },
    {
      label: "folder",
      value: "folder",
    }
  ]);
  
  // 메뉴 클릭 이벤트 - 이제 string value를 받습니다
  const handleChangeTab = useCallback((value: string) => {
    console.log("Tab changed to value:", value);
    
    switch (value) {
      case "menu":
        navigate("/admin/menu");
        break;
      case "users":
        navigate("/admin/users");
        break;
      case "folder":
        navigate("/admin/folder");
        break;
      default:
        break;
    }
  }, [navigate]);
  
  return {
    tabList,
    handleChangeTab,
    currentPath,
  }
}

export default useTabLayout;