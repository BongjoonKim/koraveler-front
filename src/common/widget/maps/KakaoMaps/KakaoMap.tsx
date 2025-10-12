// common/widget/maps/KakaoMaps/KakaoMap.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Box, Spinner, Text, VStack } from "@chakra-ui/react";
import { Map, MapMarker, useKakaoLoader, MapTypeControl, ZoomControl } from 'react-kakao-maps-sdk';

export interface KakaoMapWithSDKProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  width?: string;
  height?: string;
  onMapLoad?: (map: kakao.maps.Map) => void;
}

function KakaoMap(props: KakaoMapWithSDKProps) {
  const {
    center = { lat: 37.5665, lng: 126.9780 },
    zoom = 3,
    width = "100%",
    height = "100%",
    onMapLoad
  } = props;
  
  const mapRef = useRef<kakao.maps.Map>(null);
  const [loading, error] = useKakaoLoader({
    appkey: process.env.REACT_APP_KAKAO_MAP_APP_KEY!,
    libraries: ['services', 'clusterer', 'drawing']
  });
  
  const handleMapCreate = (map: kakao.maps.Map) => {
    mapRef.current = map;
    if (onMapLoad) {
      onMapLoad(map);
    }
  };
  
  console.log("loading", loading)
  
  // 지도를 불러왔어도 항상 loading이 true로 뜸
  // if (loading) {
  //   return (
  //     <Box w={width} h={height} display="flex" alignItems="center" justifyContent="center" bg="gray.50" borderRadius="lg">
  //       <VStack gap={3}>
  //         <Spinner size="lg" color="blue.500" />
  //         <Text fontSize="sm" color="gray.600">카카오 지도를 불러오는 중...</Text>
  //       </VStack>
  //     </Box>
  //   );
  // }
  //
  // if (error) {
  //   return (
  //     <Box w={width} h={height} display="flex" alignItems="center" justifyContent="center" bg="red.50" borderRadius="lg">
  //       <Text color="red.600">지도를 불러올 수 없습니다</Text>
  //     </Box>
  //   );
  // }
  
  return (
    <Box w={width} h={height} borderRadius="lg" overflow="hidden">
      <Map
        center={center}
        level={zoom}
        style={{ width: '100%', height: '100%' }}
        onCreate={handleMapCreate}
      >
        <MapTypeControl position={'TOPRIGHT'} />
        <ZoomControl position={'RIGHT'} />
      </Map>
    </Box>
  );
}

export default KakaoMap;