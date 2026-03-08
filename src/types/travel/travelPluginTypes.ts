import { LucideIcon } from "lucide-react";

// 플러그인 카테고리
export type TravelPluginCategory = "content" | "maps" | "social" | "utility";

// 플러그인 상태
export type TravelPluginStatus = "available" | "coming_soon";

// 플러그인 연결 상태 (사용자별)
export type TravelPluginConnectionStatus = "connected" | "disconnected";

// 플러그인 정의 (정적 레지스트리)
export interface TravelPluginDefinition {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  icon: LucideIcon;
  category: TravelPluginCategory;
  status: TravelPluginStatus;
  color: string;
  colorEnd?: string;
  tags?: string[];
  requiresAuth?: boolean;
  provider?: string;
}

// 사용자의 플러그인 연결 상태 (추후 백엔드 연동 시 사용)
export interface TravelPluginConnection {
  pluginId: string;
  userId?: string;
  travelId?: string;
  connectionStatus: TravelPluginConnectionStatus;
  connectedAt?: string;
  config?: Record<string, unknown>;
}
