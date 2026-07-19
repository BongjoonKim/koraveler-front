import React, { useMemo, useState } from "react";
import styled from "styled-components";
import {
  KOREA_MAP_DOKDO_LABEL,
  KOREA_MAP_REGIONS,
  KOREA_MAP_VIEWBOX,
  KoreaMapRegion,
} from "../../../../constants/koreaMapRegions";

// 다크 세이지-그린 에디토리얼 팔레트 (homeTokens 기반)
const COLORS = {
  visited: "#2e7d52",
  visitedHover: "#3a9d6e",
  visitedStroke: "#8fbf94",
  unvisited: "rgba(255, 255, 255, 0.06)",
  unvisitedHover: "rgba(143, 191, 148, 0.22)",
  stroke: "rgba(255, 255, 255, 0.14)",
  label: "#f3f4f1",
};

interface KoreaMapProps {
  /** 방문(색칠)된 시/군 코드 목록 */
  visitedCodes: ReadonlySet<string>;
  /** 지역 클릭 핸들러 — 없으면 읽기 전용 지도 */
  onRegionClick?: (region: KoreaMapRegion) => void;
  /** true면 색칠된(방문) 지역만 클릭 가능 — 미방문 지역은 반응 없음 */
  clickVisitedOnly?: boolean;
  /** 라벨 언어 (기본 en — 해외 사용자 대상) */
  language?: "en" | "ko";
  /** 방문 지역에 라벨 표시 여부 */
  showVisitedLabels?: boolean;
}

const KoreaMap: React.FC<KoreaMapProps> = ({
  visitedCodes,
  onRegionClick,
  clickVisitedOnly = false,
  language = "en",
  showVisitedLabels = true,
}) => {
  const [hovered, setHovered] = useState<KoreaMapRegion | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const isClickable = (region: KoreaMapRegion) =>
    !!onRegionClick && (!clickVisitedOnly || visitedCodes.has(region.code));
  const labelOf = (r: KoreaMapRegion) =>
    language === "ko" ? r.nameKo : r.nameEn;

  // 라벨은 색칠된 지역 위에만 (전체 라벨은 과밀)
  const visitedRegions = useMemo(
    () => KOREA_MAP_REGIONS.filter((r) => visitedCodes.has(r.code)),
    [visitedCodes]
  );

  const handleMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <MapWrap onMouseMove={handleMove}>
      <svg
        viewBox={KOREA_MAP_VIEWBOX}
        width="100%"
        height="auto"
        role="img"
        aria-label="Korea travel map"
      >
        <g>
          {KOREA_MAP_REGIONS.map((region) => {
            const isVisited = visitedCodes.has(region.code);
            const clickable = isClickable(region);
            // clickVisitedOnly 모드에선 클릭 불가 지역에 호버 하이라이트도 주지 않음
            const isHovered = hovered?.code === region.code && (clickable || !clickVisitedOnly);
            return (
              <path
                key={region.code}
                d={region.path}
                fill={
                  isVisited
                    ? isHovered
                      ? COLORS.visitedHover
                      : COLORS.visited
                    : isHovered
                      ? COLORS.unvisitedHover
                      : COLORS.unvisited
                }
                stroke={isVisited ? COLORS.visitedStroke : COLORS.stroke}
                strokeWidth={isVisited ? 0.8 : 0.6}
                style={{
                  cursor: clickable ? "pointer" : "default",
                  transition: "fill 0.15s ease",
                }}
                onClick={clickable ? () => onRegionClick?.(region) : undefined}
                onMouseEnter={() => setHovered(region)}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}
        </g>
        {/* 독도 라벨 — 항상 표시 (지형은 울릉군 path에 포함) */}
        <text
          x={KOREA_MAP_DOKDO_LABEL.x}
          y={KOREA_MAP_DOKDO_LABEL.y}
          textAnchor="end"
          dominantBaseline="middle"
          fontSize={9.5}
          fill={COLORS.label}
          opacity={0.75}
          pointerEvents="none"
        >
          {language === "ko" ? "독도" : "Dokdo"}
        </text>
        {showVisitedLabels && (
          <g pointerEvents="none">
            {visitedRegions.map((r) => (
              <text
                key={r.code}
                x={r.labelX}
                y={r.labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={11}
                fontWeight={600}
                fill={COLORS.label}
                style={{ paintOrder: "stroke", stroke: "rgba(10,11,10,0.55)", strokeWidth: 2.5 }}
              >
                {labelOf(r)}
              </text>
            ))}
          </g>
        )}
      </svg>

      {hovered && (
        <Tooltip style={{ left: tooltipPos.x + 12, top: tooltipPos.y - 34 }}>
          <strong>{labelOf(hovered)}</strong>
          <span>{language === "ko" ? hovered.nameEn : hovered.nameKo}</span>
          {visitedCodes.has(hovered.code) && <Dot />}
        </Tooltip>
      )}
    </MapWrap>
  );
};

export default KoreaMap;

const MapWrap = styled.div`
  position: relative;
  width: 100%;

  svg {
    display: block;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  background: rgba(20, 23, 20, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 8px;
  pointer-events: none;
  white-space: nowrap;
  z-index: 5;

  strong {
    font-size: 12.5px;
    font-weight: 600;
    color: #f3f4f1;
  }

  span {
    font-size: 11px;
    color: #9aa399;
  }
`;

const Dot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #8fbf94;
`;
