// common/widget/maps/MapInfo.tsx
import React, {useCallback, useState, useRef, useEffect} from 'react'
import {MapInfoProps} from "../../../types/maps/mapTypes";
import {useNaverMapController} from "./NaverMaps/useNaverMapController";
import NaverMap from "./NaverMaps/NaverMap";

function MapInfo(props: MapInfoProps) {
  const {
    provider = 'naver',
    center,
    zoom,
    width,
    height,
    onMapLoad
  } = props;
  
  const [rawMap, setRawMap] = useState<any>(null);
  const controller = useNaverMapController(rawMap);
  const hasLoadedRef = useRef(false);
  
  const handleNaverMapLoad = useCallback((naverMap: any) => {
    if (!rawMap) {
      setRawMap(naverMap);
    }
  }, [rawMap]);
  
  // controller가 준비되면 한 번만 onMapLoad 호출
  useEffect(() => {
    if (controller && onMapLoad && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      onMapLoad(controller);
    }
  }, [controller]); // onMapLoad를 의존성에서 제외
  
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
      return <div>Kakao Map Coming Soon</div>;
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