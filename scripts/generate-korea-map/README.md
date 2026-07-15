# Korea Map 데이터 생성 파이프라인

`src/constants/koreaMapRegions.ts` (시/군 SVG 지도 자산)를 재생성하는 절차.

## 데이터 출처

- 통계청(KOSTAT) 2018 시군구 행정경계 — [southkorea/southkorea-maps](https://github.com/southkorea/southkorea-maps) (공공데이터)
- 코드 체계: KOSTAT 행정구역 코드 (광역시 2자리 prefix, 시/군 4자리 prefix)

## 병합 규칙

- 광역시·특별시·세종 (`11,21,22,23,24,25,26,29`) → 코드 2자리로 1개 지역 병합
- 구가 있는 일반시 (수원·성남·안양·안산·고양·용인·청주·천안·전주·포항·창원) → 코드 4자리로 시 단위 병합
- 결과: 총 162개 시/군
- 3km² 미만 섬 제거 (단, 각 지역 최대 폴리곤과 울릉군(3743)은 유지)
- **독도**: 원본에서 단순화 시 탈락 + 실제 축척(0.19km²)으론 1px 미만이라, `convert.js`가 실제
  UTM-K 투영 좌표에 서도·동도 2개 섬을 시인성 있게 확대 합성 (울릉군 path에 포함, 라벨 앵커
  `KOREA_MAP_DOKDO_LABEL` 별도 export — KoreaMap 컴포넌트가 항상 표시)

## 재생성 절차

```bash
# 1. 원본 GeoJSON 다운로드
curl -sL -o skorea-municipalities.json \
  https://raw.githubusercontent.com/southkorea/southkorea-maps/master/kostat/2018/json/skorea-municipalities-2018-geo.json

# 2. 병합 + 단순화 + UTM-K 투영
npx -y mapshaper skorea-municipalities.json \
  -each 'grp=["11","21","22","23","24","25","26","29"].includes(String(code).slice(0,2)) ? String(code).slice(0,2) : String(code).slice(0,4)' \
  -dissolve2 grp copy-fields=name,name_eng,code \
  -simplify visvalingam 1.2% keep-shapes \
  -proj +proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 \
  -o dissolved.json force format=geojson precision=1

# 3. TS 자산 변환 (viewBox 스케일링, y축 반전, 이름 정리)
node convert.js

# 4. 결과물 복사
cp koreaMapRegions.ts ../../src/constants/koreaMapRegions.ts
```
