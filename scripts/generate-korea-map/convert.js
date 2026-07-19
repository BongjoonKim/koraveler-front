/**
 * dissolved.json (UTM-K 투영된 시/군 GeoJSON) → koreaMapRegions.ts 변환
 * - 작은 섬 제거 (단, 각 지역의 최대 폴리곤과 울릉군(3743)의 모든 폴리곤은 유지)
 * - viewBox 좌표로 스케일 + y축 반전
 * - 한/영 표시용 짧은 이름 생성
 */
const fs = require("fs");

const WIDTH = 800; // viewBox 가로
const MIN_RING_AREA_M2 = 3e6; // 3km² 미만 섬 제거
const g = JSON.parse(fs.readFileSync("dissolved.json", "utf8"));

// 광역시 및 구 보유 일반시 표시 이름 (병합 그룹은 데이터의 name이 구 이름이라 수동 매핑)
const GROUP_NAMES = {
  "11": ["서울", "Seoul"],
  "21": ["부산", "Busan"],
  "22": ["대구", "Daegu"],
  "23": ["인천", "Incheon"],
  "24": ["광주", "Gwangju"],
  "25": ["대전", "Daejeon"],
  "26": ["울산", "Ulsan"],
  "29": ["세종", "Sejong"],
  "3101": ["수원", "Suwon"],
  "3102": ["성남", "Seongnam"],
  "3104": ["안양", "Anyang"],
  "3109": ["안산", "Ansan"],
  "3110": ["고양", "Goyang"],
  "3119": ["용인", "Yongin"],
  "3304": ["청주", "Cheongju"],
  "3401": ["천안", "Cheonan"],
  "3501": ["전주", "Jeonju"],
  "3701": ["포항", "Pohang"],
  "3811": ["창원", "Changwon"],
};

function shortKo(name) {
  return name.endsWith("시") || name.endsWith("군") ? name.slice(0, -1) : name;
}
function shortEn(name) {
  let n = name.trim();
  for (const suf of ["-si", "-gun", "si", "gun"]) {
    if (n.toLowerCase().endsWith(suf)) {
      n = n.slice(0, -suf.length);
      break;
    }
  }
  return n.charAt(0).toUpperCase() + n.slice(1);
}

function ringArea(ring) {
  let a = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    a += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
  }
  return Math.abs(a / 2);
}
function ringCentroid(ring) {
  let a = 0, cx = 0, cy = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const cross = ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
    a += cross;
    cx += (ring[i][0] + ring[i + 1][0]) * cross;
    cy += (ring[i][1] + ring[i + 1][1]) * cross;
  }
  a /= 2;
  return [cx / (6 * a), cy / (6 * a)];
}

// 폴리곤 목록으로 정규화: [{outer, holes}]
function polygons(geom) {
  const coords = geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates;
  return coords.map((p) => ({ outer: p[0], holes: p.slice(1) }));
}

// 독도 — 원본에서 mapshaper 단순화 시 탈락하고, 실제 축척(0.19km²)으로는 1px 미만이라
// 시인성을 위해 실제 위치(UTM-K 투영 좌표)에 확대 합성한다. 울릉군(3743) 소속.
const DOKDO_CENTER = { x: 1387357, y: 1924590 }; // proj +proj=tmerc ... 로 (131.8661, 37.2397) 투영
function isletRing(cx, cy, r) {
  const pts = [];
  for (let i = 0; i <= 8; i++) {
    const a = (Math.PI * 2 * i) / 8;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return pts;
}
const DOKDO_ISLETS = [
  isletRing(DOKDO_CENTER.x - 1500, DOKDO_CENTER.y, 2300), // 서도
  isletRing(DOKDO_CENTER.x + 1900, DOKDO_CENTER.y - 400, 1900), // 동도
];

// 1) 전체 bbox 계산 (섬 필터 전 — 독도 포함 위해 울릉군 유지 후 계산)
const regions = [];
for (const f of g.features) {
  const grp = String(f.properties.grp);
  const polys = polygons(f.geometry).map((p) => ({ ...p, area: ringArea(p.outer) }));
  polys.sort((a, b) => b.area - a.area);
  const kept = polys.filter(
    (p, i) => i === 0 || p.area >= MIN_RING_AREA_M2 || grp === "3743"
  );
  if (grp === "3743") {
    // 합성 독도를 울릉군 폴리곤에 추가 (최대 폴리곤이 아니므로 뒤에 붙임)
    for (const ring of DOKDO_ISLETS) kept.push({ outer: ring, holes: [], area: 0 });
  }
  regions.push({ props: f.properties, polys: kept });
}

let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
for (const r of regions)
  for (const p of r.polys)
    for (const [x, y] of p.outer) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }

const PAD = 12; // 경계에 붙은 섬·라벨이 잘리지 않도록 여백
const scale = WIDTH / (maxX - minX);
const HEIGHT = Math.ceil((maxY - minY) * scale);
const tx = (x) => +(PAD + (x - minX) * scale).toFixed(0);
const ty = (y) => +(PAD + (maxY - y) * scale).toFixed(0); // y축 반전

function ringToPath(ring) {
  const pts = [];
  let last = null;
  for (const [x, y] of ring) {
    const px = tx(x), py = ty(y);
    if (last && last[0] === px && last[1] === py) continue;
    pts.push([px, py]);
    last = [px, py];
  }
  if (pts.length < 3) return null;
  return "M" + pts.map(([x, y]) => `${x} ${y}`).join("L") + "Z";
}

const out = [];
for (const r of regions) {
  const grp = String(r.props.grp);
  let nameKo, nameEn;
  if (GROUP_NAMES[grp]) {
    [nameKo, nameEn] = GROUP_NAMES[grp];
  } else {
    nameKo = shortKo(r.props.name);
    nameEn = shortEn(r.props.name_eng || r.props.name);
  }
  const parts = [];
  for (const p of r.polys) {
    const d = ringToPath(p.outer);
    if (d) parts.push(d);
    for (const h of p.holes) {
      if (ringArea(h) >= MIN_RING_AREA_M2) {
        const hd = ringToPath(h);
        if (hd) parts.push(hd);
      }
    }
  }
  const [cx, cy] = ringCentroid(r.polys[0].outer);
  out.push({
    code: grp,
    nameKo,
    nameEn,
    path: parts.join(""),
    labelX: +tx(cx).toFixed(0),
    labelY: +ty(cy).toFixed(0),
  });
}
out.sort((a, b) => a.code.localeCompare(b.code));

const ts = `// ⚠️ 자동 생성 파일 — 직접 수정하지 말 것. (scripts/generate-korea-map.md 참조)
// 출처: 통계청(KOSTAT) 2018 시군구 행정경계 (southkorea/southkorea-maps, 공공데이터)
// 광역시(코드 2자리)는 1개 지역으로, 구가 있는 일반시(코드 4자리)는 시 단위로 병합. 총 ${out.length}개 시/군.

export interface KoreaMapRegion {
  /** KOSTAT 행정구역 코드 (광역시 2자리, 시/군 4~5자리) */
  code: string;
  nameKo: string;
  nameEn: string;
  /** viewBox 좌표계의 SVG path */
  path: string;
  labelX: number;
  labelY: number;
}

export const KOREA_MAP_VIEWBOX = "0 0 ${WIDTH + PAD * 2} ${HEIGHT + PAD * 2}";
export const KOREA_MAP_REGION_COUNT = ${out.length};

/**
 * UTM-K(EPSG:5179) → viewBox 좌표 변환 상수.
 * viewBoxX = pad + (utmX - minX) * scale, viewBoxY = pad + (maxY - utmY) * scale
 * (위경도 → 지역 매칭 등 역변환 계산에 사용)
 */
export const KOREA_MAP_PROJECTION = {
  minX: ${minX},
  maxY: ${maxY},
  scale: ${scale},
  pad: ${PAD},
};

/** 독도 라벨 앵커 (울릉군 소속, 지도에 항상 표시 — 독도 왼쪽에 text-anchor: end 로 배치) */
export const KOREA_MAP_DOKDO_LABEL = { x: ${tx(DOKDO_CENTER.x - 5300)}, y: ${ty(DOKDO_CENTER.y)} };

export const KOREA_MAP_REGIONS: KoreaMapRegion[] = [
${out
  .map(
    (r) =>
      `  { code: ${JSON.stringify(r.code)}, nameKo: ${JSON.stringify(r.nameKo)}, nameEn: ${JSON.stringify(r.nameEn)}, labelX: ${r.labelX}, labelY: ${r.labelY}, path: ${JSON.stringify(r.path)} },`
  )
  .join("\n")}
];
`;
fs.writeFileSync("koreaMapRegions.ts", ts);
console.log("regions:", out.length, "| viewBox:", `0 0 ${WIDTH} ${HEIGHT}`);
console.log("file size:", (ts.length / 1024).toFixed(0) + "KB");
console.log("names sample:", out.slice(0, 8).map((r) => r.nameKo + "/" + r.nameEn).join(", "));
