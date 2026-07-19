import { useMemo, useState } from "react";
import {
  filterByDateRange,
  parseGoogleTimeline,
  TimelineParseError,
  TimelinePoint,
} from "../../../../utils/googleTimelineParser";
import { locateRegion } from "../../../../utils/koreaRegionLocator";
import { KoreaMapRegion } from "../../../../constants/koreaMapRegions";

export interface DetectedRegion {
  region: KoreaMapRegion;
  /** 체류(장소 방문)로 감지된 포인트 수 */
  visitCount: number;
  /** 이동 경로 통과로만 감지된 포인트 수 */
  pathCount: number;
}

/**
 * 구글 타임라인 가져오기 로직.
 * ⚠️ 프라이버시: 파일은 브라우저 메모리에서만 파싱하며 서버로 전송하지 않는다.
 * 최종적으로 저장되는 것은 사용자가 확인한 지역 코드뿐.
 */
export function useTimelineImport(travelStartDate?: string, travelEndDate?: string) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [allPoints, setAllPoints] = useState<TimelinePoint[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);

  const hasTravelDates = !!(travelStartDate || travelEndDate);
  const [useDateFilter, setUseDateFilter] = useState(true);
  const [includePath, setIncludePath] = useState(false);
  // 사용자가 체크 해제한 지역
  const [excludedCodes, setExcludedCodes] = useState<Set<string>>(new Set());

  const readFile = (file: File) => {
    setIsReading(true);
    setParseError(null);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const points = parseGoogleTimeline(String(reader.result));
        setAllPoints(points);
        setFileName(file.name);
        setExcludedCodes(new Set());
        if (points.length === 0) {
          setParseError("No location records found in this file.");
        }
      } catch (e) {
        setAllPoints([]);
        setFileName(null);
        setParseError(
          e instanceof TimelineParseError
            ? e.message
            : "Failed to read this file."
        );
      } finally {
        setIsReading(false);
      }
    };
    reader.onerror = () => {
      setIsReading(false);
      setParseError("Failed to read this file.");
    };
    reader.readAsText(file);
  };

  // 날짜 필터 적용된 포인트
  const filteredPoints = useMemo(() => {
    if (!useDateFilter || !hasTravelDates) return allPoints;
    return filterByDateRange(allPoints, travelStartDate, travelEndDate);
  }, [allPoints, useDateFilter, hasTravelDates, travelStartDate, travelEndDate]);

  // 지역 매칭 결과 (체류 수 → 통과 수 순 정렬)
  const detected = useMemo<DetectedRegion[]>(() => {
    const byCode = new Map<string, DetectedRegion>();
    for (const p of filteredPoints) {
      const region = locateRegion(p.lat, p.lng);
      if (!region) continue;
      let d = byCode.get(region.code);
      if (!d) {
        d = { region, visitCount: 0, pathCount: 0 };
        byCode.set(region.code, d);
      }
      if (p.kind === "visit") d.visitCount += 1;
      else d.pathCount += 1;
    }
    return [...byCode.values()].sort(
      (a, b) => b.visitCount - a.visitCount || b.pathCount - a.pathCount
    );
  }, [filteredPoints]);

  // 통과 전용 지역은 includePath 가 켜졌을 때만 후보에 포함
  const candidates = useMemo(
    () => detected.filter((d) => d.visitCount > 0 || includePath),
    [detected, includePath]
  );

  const toggleExclude = (code: string) => {
    setExcludedCodes((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const selectedCodes = useMemo(
    () => candidates.filter((d) => !excludedCodes.has(d.region.code)).map((d) => d.region.code),
    [candidates, excludedCodes]
  );

  const reset = () => {
    setFileName(null);
    setAllPoints([]);
    setParseError(null);
    setExcludedCodes(new Set());
    setUseDateFilter(true);
    setIncludePath(false);
  };

  return {
    fileName,
    isReading,
    parseError,
    readFile,
    totalPointCount: allPoints.length,
    filteredPointCount: filteredPoints.length,
    hasTravelDates,
    useDateFilter,
    setUseDateFilter,
    includePath,
    setIncludePath,
    candidates,
    excludedCodes,
    toggleExclude,
    selectedCodes,
    reset,
  };
}
