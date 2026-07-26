import {
  LucideIcon,
  Calendar,
  CalendarRange,
  Clock,
  FileText,
  Image,
  Tag,
  Timer,
  Users,
} from "lucide-react";
import {
  DashboardDisplay,
  TravelDashboardItem,
} from "../types/travel/travelTypes";
import { TRAVEL_PLUGINS } from "./travelPlugins";

/**
 * 프로젝트 대시보드 위젯 레지스트리.
 * - stat: D-Day/Duration 같은 작은 박스
 * - row: Album/Members 같은 전체 행 섹션
 * 플러그인은 stat/row 둘 다 지원 (사용자가 선택).
 * Travels.dashboardItems 에 저장되는 key 의 원천.
 */
export interface DashboardWidgetDef {
  key: string;
  label: string;
  icon: LucideIcon;
  group: "stat" | "section" | "plugin";
  displays: DashboardDisplay[];
  defaultDisplay: DashboardDisplay;
  defaultVisible: boolean;
}

// 플러그인 위젯 키 접두사 — 내장 위젯과 충돌 방지
export const PLUGIN_KEY_PREFIX = "plugin:";

export const DASHBOARD_WIDGETS: DashboardWidgetDef[] = [
  // 스탯 박스
  { key: "dday", label: "D-Day", icon: Timer, group: "stat", displays: ["stat"], defaultDisplay: "stat", defaultVisible: true },
  { key: "duration", label: "Duration", icon: Calendar, group: "stat", displays: ["stat"], defaultDisplay: "stat", defaultVisible: true },
  { key: "members-count", label: "Members count", icon: Users, group: "stat", displays: ["stat"], defaultDisplay: "stat", defaultVisible: true },
  { key: "schedules-count", label: "Schedules count", icon: Clock, group: "stat", displays: ["stat"], defaultDisplay: "stat", defaultVisible: true },
  // 섹션 — row(전체 행) 기본, box(stat) 전환 가능
  { key: "album", label: "Album", icon: Image, group: "section", displays: ["stat", "row"], defaultDisplay: "row", defaultVisible: true },
  { key: "dates", label: "Dates", icon: CalendarRange, group: "section", displays: ["stat", "row"], defaultDisplay: "row", defaultVisible: true },
  { key: "about", label: "About", icon: FileText, group: "section", displays: ["stat", "row"], defaultDisplay: "row", defaultVisible: true },
  { key: "tags", label: "Tags", icon: Tag, group: "section", displays: ["stat", "row"], defaultDisplay: "row", defaultVisible: true },
  { key: "members", label: "Members", icon: Users, group: "section", displays: ["stat", "row"], defaultDisplay: "row", defaultVisible: true },
  { key: "schedules", label: "Schedules", icon: Clock, group: "section", displays: ["stat", "row"], defaultDisplay: "row", defaultVisible: true },
  // 플러그인 — travelPlugins.ts 레지스트리에서 자동 파생
  ...TRAVEL_PLUGINS.map(
    (p): DashboardWidgetDef => ({
      key: `${PLUGIN_KEY_PREFIX}${p.key}`,
      label: p.name,
      icon: p.icon,
      group: "plugin",
      displays: ["stat", "row"],
      defaultDisplay: "row",
      defaultVisible: true,
    })
  ),
];

// 프로젝트 생성 시 기본으로 저장되는 대시보드 구성
export const DEFAULT_DASHBOARD_ITEMS: TravelDashboardItem[] =
  DASHBOARD_WIDGETS.map((w) => ({
    key: w.key,
    display: w.defaultDisplay,
    visible: w.defaultVisible,
  }));

/**
 * 저장된 구성을 현재 레지스트리와 동기화.
 * - 저장값 없음 → 기본 구성
 * - 삭제된 위젯 키 → 제거
 * - 이후에 추가된 위젯 → 기본값으로 뒤에 추가
 * - 지원하지 않는 display → 기본 display 로 보정
 */
export function resolveDashboardItems(
  saved?: TravelDashboardItem[] | null
): TravelDashboardItem[] {
  if (!saved || saved.length === 0) return DEFAULT_DASHBOARD_ITEMS;

  const defs = new Map(DASHBOARD_WIDGETS.map((w) => [w.key, w]));
  const kept = saved
    .filter((item) => defs.has(item.key))
    .map((item) => {
      const def = defs.get(item.key)!;
      return def.displays.includes(item.display)
        ? item
        : { ...item, display: def.defaultDisplay };
    });

  const seen = new Set(kept.map((item) => item.key));
  const appended = DASHBOARD_WIDGETS.filter((w) => !seen.has(w.key)).map(
    (w) => ({ key: w.key, display: w.defaultDisplay, visible: w.defaultVisible })
  );

  return [...kept, ...appended];
}

export function getWidgetDef(key: string): DashboardWidgetDef | undefined {
  return DASHBOARD_WIDGETS.find((w) => w.key === key);
}
