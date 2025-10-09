// common/widget/maps/NaverMaps/NaverMap.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Spinner, Text, VStack } from "@chakra-ui/react";
import { loadNaverMapScript, isNaverMapLoaded } from '../../../../utils/loadNaverMapScript';

export interface NaverMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  width?: string;
  height?: string;
  mapTypeId?: string;
  onMapLoad?: (map: any) => void;
}

function NaverMap(props: NaverMapProps) {
  const {
    center = { lat: 37.3595704, lng: 127.105399 },
    zoom = 10,
    width = "100%",
    height = "400px",
    mapTypeId = 'NORMAL',
    onMapLoad
  } = props;
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    loadNaverMapScript()
      .then(() => {
        console.log('NaverMap: Script loaded successfully');
        setIsReady(true);
      })
      .catch((err) => {
        console.error('Failed to load Naver Maps:', err);
        setError('Naver Maps API를 로드할 수 없습니다.');
      });
  }, []);
  
  const initializeMap = useCallback(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    
    const naverMaps = (window as any).naver?.maps;
    if (!naverMaps) {
      console.error('NaverMap: naver.maps not available');
      return;
    }
    
    try {
      console.log('NaverMap: Creating map instance...');
      const mapOptions = {
        center: new naverMaps.LatLng(center.lat, center.lng),
        zoom: zoom,
        draggable: true,        // 드래그 가능
        pinchZoom: true,        // 핀치 줌 가능
        scrollWheel: true,      // 마우스 휠 줌 가능
        disableKineticPan: false, // 관성 이동 활성화
        zoomControl: true,
        zoomControlOptions: {
          style: naverMaps.ZoomControlStyle.SMALL,
          position: naverMaps.Position.TOP_RIGHT
        },
        mapDataControl: false,
        scaleControl: false,
        logoControl: false,
        mapTypeControl: false
      };
      
      const map = new naverMaps.Map(mapRef.current, mapOptions);
      mapInstanceRef.current = map;
      console.log('NaverMap: Map instance created');
      
      // 지도 크기 재조정을 위한 타이머
      setTimeout(() => {
        if (mapInstanceRef.current) {
          const naverEvent = naverMaps.Event;
          naverEvent.trigger(mapInstanceRef.current, 'resize');
          console.log('NaverMap: Map resized');
        }
      }, 100);
      
      // idle 이벤트 사용 (맵이 완전히 로드된 후 한 번만 실행)
      let isFirstIdle = true;
      naverMaps.Event.addListener(map, 'idle', () => {
        if (isFirstIdle) {
          isFirstIdle = false;
          console.log('NaverMap: Map idle event fired');
          
          // 지도가 완전히 로드된 후 크기 재조정
          const naverEvent = naverMaps.Event;
          naverEvent.trigger(map, 'resize');
          
          if (onMapLoad) {
            setTimeout(() => {
              onMapLoad(map);
            }, 100);
          }
        }
      });
      
    } catch (err: any) {
      console.error('Map initialization error:', err);
      setError(`지도 초기화 실패: ${err.message}`);
    }
  }, [center.lat, center.lng, zoom, onMapLoad]);
  
  useEffect(() => {
    if (!isReady || !mapRef.current || mapInstanceRef.current) return;
    
    // API 로드 확인 후 초기화
    const checkAndInit = () => {
      if (isNaverMapLoaded()) {
        initializeMap();
      } else {
        setTimeout(checkAndInit, 100);
      }
    };
    
    checkAndInit();
  }, [isReady, initializeMap]);
  
  // center 업데이트
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const naverMaps = (window as any).naver?.maps;
    if (!naverMaps) return;
    
    const newCenter = new naverMaps.LatLng(center.lat, center.lng);
    mapInstanceRef.current.setCenter(newCenter);
  }, [center]);
  
  // zoom 업데이트
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(zoom);
    }
  }, [zoom]);
  
  // 컴포넌트 크기 변경 감지
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    const handleResize = () => {
      const naverMaps = (window as any).naver?.maps;
      if (naverMaps && mapInstanceRef.current) {
        const naverEvent = naverMaps.Event;
        naverEvent.trigger(mapInstanceRef.current, 'resize');
      }
    };
    
    // ResizeObserver 사용
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    
    if (mapRef.current) {
      resizeObserver.observe(mapRef.current);
    }
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [mapInstanceRef.current]);
  
  if (error) {
    return (
      <Box w={width} h={height} display="flex" alignItems="center" justifyContent="center" bg="red.50" borderRadius="lg">
        <Text color="red.600">{error}</Text>
      </Box>
    );
  }
  
  if (!isReady) {
    return (
      <Box w={width} h={height} display="flex" alignItems="center" justifyContent="center" bg="gray.50" borderRadius="lg">
        <VStack gap={3}>
          <Spinner size="lg" color="blue.500" />
          <Text fontSize="sm" color="gray.600">지도를 불러오는 중...</Text>
        </VStack>
      </Box>
    );
  }
  
  return <Box ref={mapRef} w={width} h={height} borderRadius="lg" />;
}

export default NaverMap;