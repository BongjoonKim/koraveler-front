// 구글 타임라인 내보내기 JSON 파서.
// 위치 이력은 민감 데이터이므로 이 파서는 브라우저 안에서만 실행하고,
// 원본 파일·좌표는 서버로 전송하지 않는다 (매칭된 지역 코드만 저장).
//
// 지원 포맷:
//  1) 온디바이스 Timeline.json (2024~, 구글맵 앱 → 설정 → 타임라인 데이터 내보내기)
//     - { semanticSegments: [...] } 또는 루트가 세그먼트 배열(iOS)
//     - segment.visit.topCandidate.placeLocation.latLng: "37.5665°, 126.978°"
//     - segment.timelinePath: [{ point: "37.5°, 127.0°" }]
//     - segment.activity.start/end.latLng
//  2) 구형 Google Takeout — Semantic Location History (월별 JSON)
//     - { timelineObjects: [{ placeVisit }, { activitySegment }] }, 좌표는 E7 정수

export interface TimelinePoint {
  lat: number;
  lng: number;
  /** ISO 문자열 (없으면 null) */
  time: string | null;
  /** visit = 체류(장소 방문), path = 이동 경로상 통과 지점 */
  kind: "visit" | "path";
}

export class TimelineParseError extends Error {}

/** "37.5665°, 126.978°" / "37.5665, 126.978" → [lat, lng] */
function parseLatLngString(s: unknown): [number, number] | null {
  if (typeof s !== "string") return null;
  const m = s.match(/-?\d+(?:\.\d+)?/g);
  if (!m || m.length < 2) return null;
  const lat = Number(m[0]);
  const lng = Number(m[1]);
  if (!isFinite(lat) || !isFinite(lng)) return null;
  return [lat, lng];
}

function fromE7(v: unknown): number | null {
  return typeof v === "number" && isFinite(v) ? v / 1e7 : null;
}

/* ── 온디바이스 Timeline.json ── */
function parseSemanticSegments(segments: any[]): TimelinePoint[] {
  const points: TimelinePoint[] = [];
  for (const seg of segments) {
    if (!seg || typeof seg !== "object") continue;
    const startTime: string | null = seg.startTime ?? null;

    const visitLatLng = parseLatLngString(
      seg.visit?.topCandidate?.placeLocation?.latLng ??
        seg.visit?.topCandidate?.placeLocation // 일부 iOS 내보내기는 문자열 직접
    );
    if (visitLatLng) {
      points.push({ lat: visitLatLng[0], lng: visitLatLng[1], time: startTime, kind: "visit" });
    }

    if (Array.isArray(seg.timelinePath)) {
      for (const p of seg.timelinePath) {
        const ll = parseLatLngString(p?.point); // "geo:37.25,127.48" 도 커버
        if (!ll) continue;
        // 포인트 시각: 명시 time > startTime + durationMinutesOffsetFromStartTime > startTime
        let time: string | null = p?.time ?? null;
        if (!time && startTime && p?.durationMinutesOffsetFromStartTime != null) {
          const offset = parseInt(String(p.durationMinutesOffsetFromStartTime), 10);
          const base = new Date(startTime).getTime();
          if (isFinite(offset) && isFinite(base)) {
            time = new Date(base + offset * 60000).toISOString();
          }
        }
        points.push({ lat: ll[0], lng: ll[1], time: time ?? startTime, kind: "path" });
      }
    }

    if (seg.activity) {
      for (const end of [seg.activity.start, seg.activity.end]) {
        const ll = parseLatLngString(end?.latLng);
        if (ll) points.push({ lat: ll[0], lng: ll[1], time: startTime, kind: "path" });
      }
    }
  }
  return points;
}

/* ── 구형 Takeout Semantic Location History ── */
function parseTimelineObjects(objects: any[]): TimelinePoint[] {
  const points: TimelinePoint[] = [];
  for (const obj of objects) {
    const pv = obj?.placeVisit;
    if (pv) {
      const lat = fromE7(pv.location?.latitudeE7);
      const lng = fromE7(pv.location?.longitudeE7);
      if (lat != null && lng != null) {
        points.push({ lat, lng, time: pv.duration?.startTimestamp ?? null, kind: "visit" });
      }
    }
    const as = obj?.activitySegment;
    if (as) {
      const time: string | null = as.duration?.startTimestamp ?? null;
      for (const loc of [as.startLocation, as.endLocation]) {
        const lat = fromE7(loc?.latitudeE7);
        const lng = fromE7(loc?.longitudeE7);
        if (lat != null && lng != null) points.push({ lat, lng, time, kind: "path" });
      }
      const wps = as.waypointPath?.waypoints;
      if (Array.isArray(wps)) {
        for (const w of wps) {
          const lat = fromE7(w?.latE7);
          const lng = fromE7(w?.lngE7);
          if (lat != null && lng != null) points.push({ lat, lng, time, kind: "path" });
        }
      }
    }
  }
  return points;
}

/**
 * 타임라인 JSON 텍스트 파싱. 포맷 자동 감지, 인식 불가 시 TimelineParseError.
 */
export function parseGoogleTimeline(jsonText: string): TimelinePoint[] {
  let data: any;
  try {
    data = JSON.parse(jsonText);
  } catch {
    throw new TimelineParseError("Not a valid JSON file.");
  }

  if (Array.isArray(data?.semanticSegments)) return parseSemanticSegments(data.semanticSegments);
  if (Array.isArray(data?.timelineObjects)) return parseTimelineObjects(data.timelineObjects);
  // iOS 온디바이스 내보내기: 루트가 세그먼트 배열인 경우
  if (Array.isArray(data)) return parseSemanticSegments(data);

  throw new TimelineParseError(
    "Unrecognized format. Export Timeline data from the Google Maps app (Settings → Location data export)."
  );
}

/**
 * 여행 기간 필터 (일 단위, 양끝 포함). 날짜 없는 포인트는 범위가 지정되면 제외.
 * startDate/endDate: "YYYY-MM-DD" (또는 ISO) — 로컬 타임존 기준.
 */
export function filterByDateRange(
  points: TimelinePoint[],
  startDate?: string,
  endDate?: string
): TimelinePoint[] {
  if (!startDate && !endDate) return points;
  const start = startDate ? new Date(`${startDate.slice(0, 10)}T00:00:00`).getTime() : -Infinity;
  const end = endDate ? new Date(`${endDate.slice(0, 10)}T23:59:59.999`).getTime() : Infinity;
  return points.filter((p) => {
    if (!p.time) return false;
    const t = new Date(p.time).getTime();
    return isFinite(t) && t >= start && t <= end;
  });
}
