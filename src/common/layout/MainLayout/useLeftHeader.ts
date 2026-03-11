import {useLocation} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {getAllMenus} from "../../../endpoints/menus-endpoints";

export default function useLeftHeader() {
  const location = useLocation();

  const {data: menus = [], isLoading, isError} = useQuery<MenusDTO[]>({
    queryKey: ['menus'],
    queryFn: async () => {
      const res = await getAllMenus();
      return res.data;
    },
    staleTime: 1000 * 60 * 10, // 메뉴는 자주 변하지 않으므로 5분 캐시
  });

  // 메뉴 호버 추적
  const handleMenuHover = (menuLabel: string) => {
    // posthog.capture('menu_hovered', {
    //   menu_label: menuLabel,
    //   current_page: location.pathname
    // });
  };

  return {
    menus,
    isLoading,
    isError,
    handleMenuHover
  }
}