// common/widget/maps/MapInfo.tsx
import React, { useCallback, useState, useRef, useEffect } from 'react';
import { MapInfoProps } from "../../../types/maps/mapTypes";
import { useNaverMapController } from "./NaverMaps/useNaverMapController";
import NaverMap from "./NaverMaps/NaverMap";
import {useKakaoMapController} from "./KakaoMaps";
import KakaoMap from "./KakaoMaps/KakaoMap";

function MapInfo(props: MapInfoProps) {
  const {
    provider = 'naver',
    center,
    zoom,
    width,
    height,
    onMapLoad
  } = props;
  
  const [naverRawMap, setNaverRawMap] = useState<any>(null);
  const [kakaoRawMap, setKakaoRawMap] = useState<kakao.maps.Map | null>(null);
  
  const naverController = useNaverMapController(provider === 'naver' ? naverRawMap : null);
  const kakaoController = useKakaoMapController(provider === 'kakao' ? kakaoRawMap : null);
  const hasLoadedRef = useRef(false);
  
  // 네이버맵 로드 핸들러
  const handleNaverMapLoad = useCallback((map: any) => {
    if (!naverRawMap) {
      setNaverRawMap(map);
    }
  }, [naverRawMap]);
  
  // 카카오맵 로드 핸들러
  const handleKakaoMapLoad = useCallback((map: kakao.maps.Map) => {
    if (!kakaoRawMap) {
      setKakaoRawMap(map);
    }
  }, [kakaoRawMap]);
  
  // controller가 준비되면 한 번만 onMapLoad 호출
  useEffect(() => {
    const controller = provider === 'naver' ? naverController : kakaoController;
    if (controller && onMapLoad && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      onMapLoad(controller);
    }
  }, [naverController, kakaoController, provider]);
  
  // provider 변경 시 초기화
  useEffect(() => {
    hasLoadedRef.current = false;
    setNaverRawMap(null);
    setKakaoRawMap(null);
  }, [provider]);
  
  switch (provider) {
    case 'naver':
      return (
        <NaverMap
          center={center}
          zoom={zoom}
          width={width}
          height={height}
          onMapLoad={handleNaverMapLoad}
        />
      );
    case 'kakao':
      return (
        <KakaoMap
          center={center}
          zoom={zoom}  // 카카오맵은 level이지만 props는 동일하게
          width={width}
          height={height}
          onMapLoad={handleKakaoMapLoad}
        />
      );
    default:
      return (
        <NaverMap
          center={center}
          zoom={zoom}
          width={width}
          height={height}
          onMapLoad={handleNaverMapLoad}
        />
      );
  }
}

export default MapInfo;