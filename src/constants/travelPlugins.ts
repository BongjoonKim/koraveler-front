import { LucideIcon, Map, MessageCircle, Route } from "lucide-react";

/**
 * Travel 프로젝트에 연결되는 플러그인 레지스트리.
 * 새 플러그인을 만들면 여기에 등록만 하면 대시보드 Plugins 섹션에 자동 노출된다.
 */
export interface TravelPlugin {
  key: string;
  name: string;
  description: string;
  icon: LucideIcon;
  path: (travelId: string) => string;
}

export const TRAVEL_PLUGINS: TravelPlugin[] = [
  {
    key: "korea-map",
    name: "Korea Travel Map",
    description: "Regions you visited, colored on the map of Korea",
    icon: Map,
    path: (id) => `/travel/map/${id}`,
  },
  {
    key: "course",
    name: "Travel Course",
    description: "Your visited places as a course on Naver Map",
    icon: Route,
    path: (id) => `/travel/course/${id}`,
  },
  {
    key: "chat",
    name: "Travel Chat",
    description: "Chat with your travel companions",
    icon: MessageCircle,
    path: (id) => `/travel/chat/${id}`,
  },
];
