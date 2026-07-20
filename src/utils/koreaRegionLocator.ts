// 위경도(WGS84) → Korea Map 지역(KOSTAT 코드) 매칭 유틸.
// koreaMapRegions.ts 의 SVG path 는 UTM-K(EPSG:5179) 투영 후 viewBox 로 선형 변환된 것이므로
// (KOREA_MAP_PROJECTION), 같은 변환을 좌표에 적용하면 별도 경계 데이터 없이 ray-casting 으로 매칭된다.
// 정밀도: path 좌표가 정수(≈0.8km/unit)라 경계 인접점은 이웃 지역으로 붙을 수 있음 → 확인 UI에서 보정.
import {
  KOREA_MAP_PROJECTION,
  KOREA_MAP_REGIONS,
  KoreaMapRegion,
} from "../constants/koreaMapRegions";

/* ── 1) WGS84 → UTM-K (Transverse Mercator, GRS80) ──
 * mapshaper 파이프라인의 proj 정의와 동일:
 * +proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 */
const A = 6378137;
const F = 1 / 298.257222101; // GRS80
const E2 = F * (2 - F);
const EP2 = E2 / (1 - E2);
const K0 = 0.9996;
const LAT0 = (38 * Math.PI) / 180;
const LON0 = (127.5 * Math.PI) / 180;
const X0 = 1000000;
const Y0 = 2000000;

// 자오선 호장 (meridian arc)
function meridianArc(phi: number): number {
  const e4 = E2 * E2;
  const e6 = e4 * E2;
  return (
    A *
    ((1 - E2 / 4 - (3 * e4) / 64 - (5 * e6) / 256) * phi -
      ((3 * E2) / 8 + (3 * e4) / 32 + (45 * e6) / 1024) * Math.sin(2 * phi) +
      ((15 * e4) / 256 + (45 * e6) / 1024) * Math.sin(4 * phi) -
      ((35 * e6) / 3072) * Math.sin(6 * phi))
  );
}
const M0 = meridianArc(LAT0);

export function latLngToUtmk(lat: number, lng: number): { x: number; y: number } {
  const phi = (lat * Math.PI) / 180;
  const sinP = Math.sin(phi);
  const cosP = Math.cos(phi);
  const tanP = Math.tan(phi);
  const n = A / Math.sqrt(1 - E2 * sinP * sinP);
  const t = tanP * tanP;
  const c = EP2 * cosP * cosP;
  const a1 = cosP * ((lng * Math.PI) / 180 - LON0);
  const a2 = a1 * a1;

  const x =
    K0 *
      n *
      (a1 +
        ((1 - t + c) * a1 * a2) / 6 +
        ((5 - 18 * t + t * t + 72 * c - 58 * EP2) * a1 * a2 * a2) / 120) +
    X0;
  const y =
    K0 *
      (meridianArc(phi) -
        M0 +
        n *
          tanP *
          (a2 / 2 +
            ((5 - t + 9 * c + 4 * c * c) * a2 * a2) / 24 +
            ((61 - 58 * t + t * t + 600 * c - 330 * EP2) * a2 * a2 * a2) / 720)) +
    Y0;
  return { x, y };
}

/* ── 2) UTM-K → viewBox 좌표 ── */
export function latLngToViewBox(lat: number, lng: number): { x: number; y: number } {
  const { minX, maxY, scale, pad } = KOREA_MAP_PROJECTION;
  const { x, y } = latLngToUtmk(lat, lng);
  return { x: pad + (x - minX) * scale, y: pad + (maxY - y) * scale };
}

/* ── 3) SVG path → 폴리곤 링 (생성기 출력 형식 "M x y L x y ... Z" 전용) ── */
type Ring = number[]; // [x0,y0, x1,y1, ...] flat
interface RegionShape {
  region: KoreaMapRegion;
  rings: Ring[];
  bbox: [number, number, number, number]; // minX, minY, maxX, maxY
}

function parsePathRings(d: string): Ring[] {
  const rings: Ring[] = [];
  for (const sub of d.split("M")) {
    if (!sub) continue;
    const nums = sub
      .replace(/Z/g, "")
      .split(/[L\s]+/)
      .filter(Boolean)
      .map(Number);
    if (nums.length >= 6) rings.push(nums);
  }
  return rings;
}

let shapesCache: RegionShape[] | null = null;
function getShapes(): RegionShape[] {
  if (!shapesCache) {
    shapesCache = KOREA_MAP_REGIONS.map((region) => {
      const rings = parsePathRings(region.path);
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const r of rings)
        for (let i = 0; i < r.length; i += 2) {
          if (r[i] < minX) minX = r[i];
          if (r[i] > maxX) maxX = r[i];
          if (r[i + 1] < minY) minY = r[i + 1];
          if (r[i + 1] > maxY) maxY = r[i + 1];
        }
      return { region, rings, bbox: [minX, minY, maxX, maxY] };
    });
  }
  return shapesCache;
}

// even-odd ray casting — 서브패스(구멍 포함) 전체에 대해 교차 횟수 홀짝 판정
function pointInShape(px: number, py: number, shape: RegionShape): boolean {
  let inside = false;
  for (const r of shape.rings) {
    const n = r.length;
    for (let i = 0, j = n - 2; i < n; j = i, i += 2) {
      const xi = r[i], yi = r[i + 1], xj = r[j], yj = r[j + 1];
      if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) {
        inside = !inside;
      }
    }
  }
  return inside;
}

// 점-선분 최소 거리² (근접 매칭용)
function distSqToShape(px: number, py: number, shape: RegionShape): number {
  let best = Infinity;
  for (const r of shape.rings) {
    const n = r.length;
    for (let i = 0, j = n - 2; i < n; j = i, i += 2) {
      const xi = r[i], yi = r[i + 1], xj = r[j], yj = r[j + 1];
      const dx = xi - xj, dy = yi - yj;
      const len2 = dx * dx + dy * dy;
      let t = len2 ? ((px - xj) * dx + (py - yj) * dy) / len2 : 0;
      t = Math.max(0, Math.min(1, t));
      const ex = xj + t * dx - px, ey = yj + t * dy - py;
      const d = ex * ex + ey * ey;
      if (d < best) best = d;
    }
  }
  return best;
}

/** 경계 밖 점을 인접 지역으로 붙일 허용 거리 (viewBox 단위, 1unit ≈ 0.8km) */
const NEAR_TOLERANCE = 2.5;

/**
 * 위경도 → 지역 매칭. 폴리곤 내부 판정 우선, 실패 시 허용 거리 내 최근접 지역.
 * 한국 밖 좌표는 null.
 */
export function locateRegion(lat: number, lng: number): KoreaMapRegion | null {
  // 한반도 남부 대략 범위 밖이면 스킵 (해외 여행 기록 배제)
  if (lat < 33 || lat > 38.9 || lng < 124.5 || lng > 132.2) return null;
  const { x, y } = latLngToViewBox(lat, lng);
  const shapes = getShapes();

  const margin = NEAR_TOLERANCE;
  let nearest: RegionShape | null = null;
  let nearestD = NEAR_TOLERANCE * NEAR_TOLERANCE;
  for (const s of shapes) {
    const [bx0, by0, bx1, by1] = s.bbox;
    if (x < bx0 - margin || x > bx1 + margin || y < by0 - margin || y > by1 + margin)
      continue;
    if (pointInShape(x, y, s)) return s.region;
    const d = distSqToShape(x, y, s);
    if (d < nearestD) {
      nearestD = d;
      nearest = s;
    }
  }
  return nearest ? nearest.region : null;
}
