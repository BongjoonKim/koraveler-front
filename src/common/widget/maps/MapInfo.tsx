// common/widget/maps/MapInfo.tsx
import React, { useCallback, useState, useRef, useEffect } from 'react';
import {MapInfoProps, MapPosition} from "../../../types/maps/mapTypes";
import { useNaverMapController } from "./NaverMaps/useNaverMapController";
import NaverMap from "./NaverMaps/NaverMap";
import {useKakaoMapController} from "./KakaoMaps";
import KakaoMap from "./KakaoMaps/KakaoMap";
import {usePlaceQueries} from "../../../hooks/usePlaceQueries";
import {PlaceItem} from "../../../types/place/placeTypes";
import {Badge, Box, Card, HStack, IconButton, Input, ScrollArea, Spinner, Text, VStack} from "@chakra-ui/react";
import {Building, Globe, MapPin, Navigation, Phone, Search, X} from "lucide-react";
import CusIconButton from "../../elements/buttons/CusIconButton";
import CusButton from "../../elements/buttons/CusButton";

function MapInfo(props: MapInfoProps) {
  const {
    provider = 'naver',
    center = { lat: 37.5665, lng: 126.9780 },
    zoom,
    width,
    height ,
    onMapLoad
  } = props;
  
  const [naverRawMap, setNaverRawMap] = useState<any>(null);
  const [kakaoRawMap, setKakaoRawMap] = useState<kakao.maps.Map | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [searchResults, setSearchResults] = useState<PlaceItem[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceItem | null>(null);
  const [mapCenter, setMapCenter] = useState<MapPosition>(center);
  const naverController = useNaverMapController(provider === 'naver' ? naverRawMap : null);
  const kakaoController = useKakaoMapController(provider === 'kakao' ? kakaoRawMap : null);
  const hasLoadedRef = useRef(false);
  
  const placeSearchMutation = usePlaceQueries();
  const mapController = provider === 'naver' ? naverController : kakaoController;
  
  
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
    if (mapController && onMapLoad && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      onMapLoad(mapController);
    }
  }, [mapController, provider]);
  
  // provider 변경 시 초기화
  useEffect(() => {
    hasLoadedRef.current = false;
    setNaverRawMap(null);
    setKakaoRawMap(null);
    setSearchKeyword("");
    setSearchResults([]);
    setSelectedPlace(null);
  }, [provider]);
  
  const handleSearch = useCallback(async() => {
    if (!searchKeyword.trim()) {
      return;
    }
    
    try {
      const response = await placeSearchMutation.mutateAsync({
        keyword : searchKeyword,
      });
      
      if (response.data?.places?.length) {
        setSearchResults(response.data.places)
        displayPlacesOnMap(response.data.places);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      alert("Search Error")
    }
  }, [searchKeyword])
  
  const displayPlacesOnMap = useCallback((places : PlaceItem[]) => {
    if (!mapController) return;
    
    // 기존 마커 제거
    mapController.clearMarkers();
    
    const positions: MapPosition[] = [];
    
    places.forEach((place : PlaceItem, index: number) => {
      const position = {lat : place.lat, lng: place.lng};
      
      mapController.addMarker({
        position: position,
        title:place.nameEn || place.name,
        onClick: () => {
          setSelectedPlace(place);
          mapController.panTo(position);
        }
      })
      positions.push(position);
    });
    // 지도 범위 조정
    if (positions.length > 0) {
      const bounds = positions.reduce((acc, pos) => {
        return {
          sw: {
            lat: Math.min(acc.sw.lat, pos.lat),
            lng: Math.min(acc.sw.lng, pos.lng)
          },
          ne: {
            lat: Math.max(acc.ne.lat, pos.lat),
            lng: Math.max(acc.ne.lng, pos.lng)
          }
        };
      }, {
        sw: { lat: positions[0].lat, lng: positions[0].lng },
        ne: { lat: positions[0].lat, lng: positions[0].lng }
      });
      
      mapController.fitBounds(bounds, 100);
    }
  }, [mapController]);
  
  const handlePlaceSelect = useCallback((place : PlaceItem) => {
    setSelectedPlace(place);
    
    if (mapController) {
      const position = {lat : place.lat, lng: place.lng}
      mapController.panTo(position);
      mapController.setZoom(3);
    }
  }, [mapController]);
  
  const clearSearch = useCallback(() => {
    setSearchKeyword("");
    setSearchResults([]);
    setSelectedPlace(null);
    if (mapController) {
      mapController.clearMarkers();
    }
  }, [mapController]);
  
  // 현재 위치 가져오기
  const getCurrentLocation = useCallback(async () => {
    if (!mapController) return;
    
    try {
      const position = await mapController.getCurrentLocation();
      setMapCenter(position);
      mapController.setCenter(position);
      mapController.setZoom(3);
      
      // 현재 위치 마커 추가
      mapController.clearMarkers();
      mapController.addMarker({
        position: position,
        title: '현재 위치',
        icon: provider === 'kakao'
          ? 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png'
          : undefined
      });
    } catch (error) {
      console.error('Failed to get current location:', error);
      alert('현재 위치를 가져올 수 없습니다.');
    }
  }, [mapController, provider]);
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  return (
    <HStack h={height} gap={0} align={"stretch"}>
      <Card.Root
        w={"30%"}
        minW={"10rem"}
        h={"full"}
        borderRadius={"none"}
        borderRight="1px solid"
        borderColor="gray.200"
      >
        <Card.Body p={0}>
          <VStack align="stretch" h="full" gap={0}>
            <Box p={4} borderBottom="1px solid" borderColor="gray.200">
              <VStack align={"stretch"} h={"full"} gap={0}>
                <HStack gap={2} w={"full"}>
                  <Box flex={1} position={"relative"}>
                    <Input
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Search"
                      pl={10}
                      pr={searchKeyword ? 10 : 4}
                    />
                    <Box position="absolute" left={3} top="50%" transform="translateY(-50%)">
                      <Search size={18} color="#6b7280" />
                    </Box>
                    {searchKeyword && (
                      <CusIconButton
                        aria-label="Clear"
                        size="xs"
                        variant="ghost"
                        position="absolute"
                        right={2}
                        top="50%"
                        transform="translateY(-50%)"
                        onClick={clearSearch}
                      >
                        <X size={16} />
                      </CusIconButton>
                    )}
                  </Box>
                  <CusButton
                    leftIcon={<Search size={16} />}
                    onClick={handleSearch}
                    isLoading={placeSearchMutation.isPending}
                    loadingText="검색중"
                    colorScheme="blue"
                  >
                    Search
                  </CusButton>
                  <IconButton
                    aria-label="Current location"
                    onClick={getCurrentLocation}
                    variant="outline"
                  >
                    <Navigation size={18} />
                  </IconButton>
                </HStack>
              </VStack>
            </Box>
            
            {/* 검색 결과 목록 */}
            <Box flex={1} overflowY={"auto"}>
              {placeSearchMutation.isPending ? (
                <VStack py={8}>
                  <Spinner size="lg" color="blue.500" />
                  <Text fontSize={"sm"} color="gray.600">Searching...</Text>
                </VStack>
              ) : searchResults.length ? (
                <VStack align="stretch" gap={0}>
                  {searchResults.map((place) => (
                    <Box
                      key={place.id}
                      p={4}
                      borderBottom="1px solid"
                      borderColor="gray.100"
                      cursor="pointer"
                      bg={selectedPlace?.id === place.id ? "blue.50" : "white"}
                      _hover={{ bg: "gray.50" }}
                      onClick={() => handlePlaceSelect(place)}
                    >
                      <VStack align="start" gap={2}>
                        <HStack justify="space-between" w="full">
                          <VStack align="start" gap={0}>
                            <Text fontWeight="semibold" fontSize="md">
                              {place.nameEn || place.name}
                            </Text>
                            {place.name !== place.nameEn && (
                              <Text fontSize="sm" color="gray.600">
                                {place.name}
                              </Text>
                            )}
                          </VStack>
                          {place.categoryEn && (
                            <Badge colorScheme="purple" size="sm">
                              {place.categoryEn}
                            </Badge>
                          )}
                        </HStack>
                        
                        <VStack align="start" gap={1} w="full" fontSize="sm">
                          {place.addressEn && (
                            <HStack gap={1} color="gray.600">
                              <MapPin size={14} />
                              <Text>{place.addressEn}</Text>
                            </HStack>
                          )}
                          
                          <HStack gap={1} color="gray.500">
                            <Building size={14} />
                            <Text>{place.addressKo}</Text>
                          </HStack>
                          
                          {place.phone && (
                            <HStack gap={1} color="gray.500">
                              <Phone size={14} />
                              <Text>{place.phone}</Text>
                            </HStack>
                          )}
                        </VStack>
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              ) : (
                <Box textAlign="center" py={12}>
                  <Search size={48} color="#d1d5db" style={{ margin: "0 auto 12px" }} />
                  <Text fontSize="sm" color="gray.500">
                    장소를 검색해보세요
                  </Text>
                  <Text fontSize="xs" color="gray.400" mt={1}>
                    영어로 검색하시면 더 정확한 결과를 얻을 수 있습니다
                  </Text>
                </Box>
              )}
            </Box>
          </VStack>
        </Card.Body>
      </Card.Root>
      {/* 오른쪽 지도 */}
      <Box flex={1} h="full">
        {provider === 'naver' ? (
          <NaverMap
            center={mapCenter}
            zoom={zoom}
            width="100%"
            height="100%"
            onMapLoad={handleNaverMapLoad}
          />
        ) : (
          <KakaoMap
            center={mapCenter}
            zoom={zoom}
            width="100%"
            height="100%"
            onMapLoad={handleKakaoMapLoad}
          />
        )}
      </Box>
    </HStack>
  )
}

export default MapInfo;