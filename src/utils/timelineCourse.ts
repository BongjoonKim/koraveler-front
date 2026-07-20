// 구글 타임라인 포인트 → 코스 초안(정차지 목록) 재구성.
// 체류 감지: 시간순 포인트를 근접 클러스터로 묶고, 충분히 머문 클러스터를 "정차지"로 본다.
// 구간 이동 수단은 평균 속도로 추정하며, 사용자가 확인 단계에서 수정한다.
import { TimelinePoint } from "./googleTimelineParser";
import { locateRegion } from "./koreaRegionLocator";
import { KoreaMapRegion } from "../constants/koreaMapRegions";
import { TransportMode } from "../types/travel/travelTypes";

export interface CourseDraftStop {
  lat: number;
  lng: number;
  /** ISO — 도착(클러스터 첫 포인트) / 출발(마지막 포인트) */
  arrival: string | null;
  departure: string | null;
  dwellMinutes: number;
  region: KoreaMapRegion | null;
  /** 이전 정차지 → 이 정차지 이동 시간(분) */
  travelMinutesFromPrev: number | null;
  /** 평균 속도 기반 추정 이동 수단 */
  guessedMode: TransportMode | null;
  /** visit(장소 방문) 포인트가 포함된 클러스터인지 */
  fromVisit: boolean;
}

/** 클러스터 반경 (m) — GPS 흔들림·건물 내 이동 허용 */
const CLUSTER_RADIUS_M = 300;
/** 정차로 인정할 최소 체류 시간 (분) */
const MIN_DWELL_MINUTES = 20;

function haversineM(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371000;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) *
      Math.cos((bLat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

function minutesBetween(a: string | null, b: string | null): number | null {
  if (!a || !b) return null;
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return isFinite(ms) ? Math.max(0, Math.round(ms / 60000)) : null;
}

/** 평균 속도(km/h)·거리로 이동 수단 추정 — 확인 단계에서 사용자가 수정 */
export function guessTransportMode(km: number, minutes: number): TransportMode | null {
  if (minutes <= 0) return null;
  const kmh = km / (minutes / 60);
  if (kmh <= 7) return "WALK";
  if (kmh <= 25) return "BICYCLE";
  if (kmh <= 150) return "CAR";
  if (kmh <= 350) return "TRAIN";
  return "FLIGHT";
}

interface Cluster {
  points: TimelinePoint[];
  cLat: number;
  cLng: number;
  hasVisit: boolean;
}

/**
 * 타임라인 포인트 → 정차지 초안.
 * points 는 시간 정보가 있는 것만 사용하고 시간순 정렬 후 클러스터링한다.
 */
export function buildCourseDraft(points: TimelinePoint[]): CourseDraftStop[] {
  const timed = points
    .filter((p) => p.time && isFinite(new Date(p.time).getTime()))
    .sort((a, b) => new Date(a.time!).getTime() - new Date(b.time!).getTime());
  if (timed.length === 0) return [];

  // 1) 시간순 근접 클러스터링
  const clusters: Cluster[] = [];
  let cur: Cluster | null = null;
  for (const p of timed) {
    if (cur && haversineM(cur.cLat, cur.cLng, p.lat, p.lng) <= CLUSTER_RADIUS_M) {
      cur.points.push(p);
      // 이동 평균으로 중심 갱신
      cur.cLat += (p.lat - cur.cLat) / cur.points.length;
      cur.cLng += (p.lng - cur.cLng) / cur.points.length;
      cur.hasVisit = cur.hasVisit || p.kind === "visit";
    } else {
      cur = { points: [p], cLat: p.lat, cLng: p.lng, hasVisit: p.kind === "visit" };
      clusters.push(cur);
    }
  }

  // 2) 체류 조건: visit 포함 또는 MIN_DWELL 이상 머문 클러스터만 정차지
  const stops: CourseDraftStop[] = [];
  for (const c of clusters) {
    const arrival = c.points[0].time;
    const departure = c.points[c.points.length - 1].time;
    const dwell = minutesBetween(arrival, departure) ?? 0;
    if (!c.hasVisit && dwell < MIN_DWELL_MINUTES) continue;

    stops.push({
      lat: c.cLat,
      lng: c.cLng,
      arrival,
      departure,
      dwellMinutes: dwell,
      region: locateRegion(c.cLat, c.cLng),
      travelMinutesFromPrev: null,
      guessedMode: null,
      fromVisit: c.hasVisit,
    });
  }

  // 3) 인접 정차지가 사실상 같은 위치면 병합 (숙소 재방문 등은 유지 — 연속일 때만)
  const merged: CourseDraftStop[] = [];
  for (const s of stops) {
    const prev = merged[merged.length - 1];
    if (prev && haversineM(prev.lat, prev.lng, s.lat, s.lng) <= CLUSTER_RADIUS_M) {
      prev.departure = s.departure;
      prev.dwellMinutes = minutesBetween(prev.arrival, prev.departure) ?? prev.dwellMinutes;
      prev.fromVisit = prev.fromVisit || s.fromVisit;
      continue;
    }
    merged.push(s);
  }

  // 4) 구간 이동 시간·수단 추정
  for (let i = 1; i < merged.length; i++) {
    const a = merged[i - 1];
    const b = merged[i];
    const minutes = minutesBetween(a.departure, b.arrival);
    b.travelMinutesFromPrev = minutes;
    if (minutes != null && minutes > 0) {
      const km = haversineM(a.lat, a.lng, b.lat, b.lng) / 1000;
      b.guessedMode = guessTransportMode(km, minutes);
    }
  }

  return merged;
}
