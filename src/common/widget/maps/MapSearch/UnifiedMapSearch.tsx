// common/widget/maps/MapSearch/UnifiedMapSearch.tsx
import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Card,
  Input,
  VStack,
  HStack,
  Text,
  IconButton,
  Button,
  Badge,
  Spinner,
} from "@chakra-ui/react";
import {
  Search,
  MapPin,
  Navigation,
  X,
  ChevronRight,
  Phone,
  Building
} from "lucide-react";
import { MapController, MapPosition, MapProvider } from '../../../../types/maps/mapTypes';
import { useKakaoLoader } from 'react-kakao-maps-sdk';
import CusButton from "../../../elements/buttons/CusButton";
import CusIconButton from "../../../elements/buttons/CusIconButton";
import {useNaverMapSearch} from "../NaverMaps/useNaverMapSearch";

export interface UnifiedSearchResult {
  id: string;
  name: string;
  category?: string;
  phone?: string;
  address: string;
  roadAddress?: string;
  position: MapPosition;
  distance?: string;
  provider: 'kakao' | 'naver';
}

export interface UnifiedMapSearchProps {
  mapController: MapController | null;
  mapProvider: MapProvider;
  onPlaceSelect?: (place: UnifiedSearchResult) => void;
  defaultSearchKeyword?: string;
  height?: string;
}

function UnifiedMapSearch(props: UnifiedMapSearchProps) {
  const {
    mapController,
    mapProvider,
    onPlaceSelect,
    defaultSearchKeyword = '',
    height = '400px'
  } = props;
  
  const [searchKeyword, setSearchKeyword] = useState(defaultSearchKeyword);
  const [searchResults, setSearchResults] = useState<UnifiedSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<UnifiedSearchResult | null>(null);
  const [currentLocation, setCurrentLocation] = useState<MapPosition | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  // 네이버 검색 훅
  const naverSearch = useNaverMapSearch();
  
  // 카카오 검색 서비스
  const [kakaoPlacesService, setKakaoPlacesService] = useState<kakao.maps.services.Places | null>(null);
  const [kakaoLoading] = useKakaoLoader({
    appkey: process.env.REACT_APP_KAKAO_MAP_APP_KEY || '',
    libraries: ['services']
  });
  
  // 카카오 Places 서비스 초기화
  useEffect(() => {
    if (!kakaoLoading && window.kakao?.maps?.services?.Places && mapProvider === 'kakao') {
      setKakaoPlacesService(new kakao.maps.services.Places());
    }
  }, [kakaoLoading, mapProvider]);
  
  // 현재 위치 가져오기
  const getCurrentLocation = useCallback(async () => {
    if (!mapController) return;
    
    try {
      const position = await mapController.getCurrentLocation();
      setCurrentLocation(position);
      mapController.setCenter(position);
      mapController.setZoom(3);
      
      // 현재 위치 마커 추가
      mapController.clearMarkers();
      mapController.addMarker({
        position: position,
        title: '현재 위치',
        icon: mapProvider === 'kakao'
          ? 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png'
          : undefined
      });
    } catch (error) {
      console.error('Failed to get current location:', error);
      alert('현재 위치를 가져올 수 없습니다.');
    }
  }, [mapController, mapProvider]);
  
  // 통합 검색 함수
  const searchPlaces = useCallback(async () => {
    if (!searchKeyword.trim()) {
      alert('검색어를 입력해주세요.');
      return;
    }
    
    setIsSearching(true);
    setSelectedPlace(null);
    
    // 검색 히스토리 업데이트
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item !== searchKeyword);
      return [searchKeyword, ...filtered].slice(0, 5);
    });
    
    try {
      let results: UnifiedSearchResult[] = [];
      
      if (mapProvider === 'naver') {
        // 네이버 검색
        const naverResults = await naverSearch.searchByKeyword(
          searchKeyword,
          currentLocation?.lng,
          currentLocation?.lat
        );
        
        results = naverResults.map((place : any, index : number) => ({
          id: `naver-${index}-${place.mapx}-${place.mapy}`,
          name: place.title,
          category: place.category,
          phone: place.telephone,
          address: place.address,
          roadAddress: place.roadAddress,
          position: naverSearch.convertNaverToWGS84(place.mapx, place.mapy),
          provider: 'naver' as const
        }));
      } else if (mapProvider === 'kakao' && kakaoPlacesService) {
        // 카카오 검색
        results = await new Promise((resolve) => {
          const callback = (result: any, status: any) => {
            if (status === kakao.maps.services.Status.OK) {
              const kakaoResults: UnifiedSearchResult[] = result.map((place: any) => ({
                id: place.id,
                name: place.place_name,
                category: place.category_group_name,
                phone: place.phone,
                address: place.address_name,
                roadAddress: place.road_address_name,
                position: {
                  lat: parseFloat(place.y),
                  lng: parseFloat(place.x)
                },
                distance: place.distance,
                provider: 'kakao' as const
              }));
              resolve(kakaoResults);
            } else {
              resolve([]);
            }
          };
          
          const searchOptions: kakao.maps.services.PlacesSearchOptions = {
            size: 15
          };
          
          if (currentLocation) {
            searchOptions.location = new kakao.maps.LatLng(
              currentLocation.lat,
              currentLocation.lng
            );
            searchOptions.radius = 20000;
            searchOptions.sort = kakao.maps.services.SortBy.DISTANCE;
          }
          
          kakaoPlacesService.keywordSearch(searchKeyword, callback, searchOptions);
        });
      }
      
      setSearchResults(results);
      
      if (results.length > 0) {
        displayPlaces(results);
      } else {
        alert('검색 결과가 없습니다.');
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('검색 중 오류가 발생했습니다.');
    } finally {
      setIsSearching(false);
    }
  }, [searchKeyword, currentLocation, mapProvider, naverSearch, kakaoPlacesService]);
  
  // 지도에 마커 표시
  const displayPlaces = useCallback((places: UnifiedSearchResult[]) => {
    if (!mapController) return;
    
    // 기존 마커 제거
    mapController.clearMarkers();
    
    const positions: MapPosition[] = [];
    
    places.forEach((place) => {
      // 마커 추가
      mapController.addMarker({
        position: place.position,
        title: place.name,
        onClick: () => {
          setSelectedPlace(place);
          mapController.panTo(place.position);
        }
      });
      
      positions.push(place.position);
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
      
      mapController.fitBounds(bounds);
    }
  }, [mapController]);
  
  // 장소 선택
  const handlePlaceSelect = useCallback((place: UnifiedSearchResult) => {
    setSelectedPlace(place);
    
    if (mapController) {
      mapController.panTo(place.position);
      mapController.setZoom(2);
    }
    
    if (onPlaceSelect) {
      onPlaceSelect(place);
    }
  }, [mapController, onPlaceSelect]);
  
  // 검색 초기화
  const clearSearch = useCallback(() => {
    setSearchKeyword('');
    setSearchResults([]);
    setSelectedPlace(null);
    if (mapController) {
      mapController.clearMarkers();
    }
  }, [mapController]);
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchPlaces();
    }
  };
  
  return (
    <Card.Root bg="white" overflow="hidden" h={height}>
      <Card.Body p={0}>
        <VStack align="stretch" h="full" gap={0}>
          {/* 검색 입력 영역 */}
          <Box p={4} borderBottom="1px" borderColor="gray.200">
            <HStack gap={2}>
              <Box flex={1} position="relative">
                <Input
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="장소, 주소 검색"
                  pl={10}
                  pr={searchKeyword ? 10 : 4}
                />
                <Box position="absolute" left={3} top="50%" transform="translateY(-50%)">
                  <Search size={18} color="#6b7280" />
                </Box>
                {searchKeyword && (
                  <CusIconButton
                    aria-label="Clear"
                    icon={<X size={16} />}
                    size="xs"
                    variant="ghost"
                    position="absolute"
                    right={2}
                    top="50%"
                    transform="translateY(-50%)"
                    onClick={clearSearch}
                  />
                )}
              </Box>
              <CusButton
                leftIcon={<Search size={16} />}
                onClick={searchPlaces}
                isLoading={isSearching}
                loadingText="검색중"
                colorScheme="blue"
              >
                검색
              </CusButton>
              <CusIconButton
                aria-label="Current location"
                icon={<Navigation size={18} />}
                onClick={getCurrentLocation}
                variant="outline"
              />
            </HStack>
            
            {/* 최근 검색어 */}
            {searchHistory.length > 0 && !searchResults.length && (
              <HStack mt={2} gap={2} flexWrap="wrap">
                <Text fontSize="xs" color="gray.500">최근:</Text>
                {searchHistory.map((keyword, index) => (
                  <Badge
                    key={index}
                    cursor="pointer"
                    onClick={() => {
                      setSearchKeyword(keyword);
                      setTimeout(() => searchPlaces(), 0);
                    }}
                    colorScheme="gray"
                    variant="subtle"
                  >
                    {keyword}
                  </Badge>
                ))}
              </HStack>
            )}
          </Box>
          
          {/* 검색 결과 목록 */}
          <Box flex={1} overflowY="auto">
            {isSearching || naverSearch.isSearching ? (
              <VStack py={8}>
                <Spinner size="lg" color="blue.500" />
                <Text fontSize="sm" color="gray.600">검색 중...</Text>
              </VStack>
            ) : searchResults.length > 0 ? (
              <VStack align="stretch" gap={0}>
                {searchResults.map((place) => (
                  <Box
                    key={place.id}
                    p={3}
                    borderBottom="1px"
                    borderColor="gray.100"
                    cursor="pointer"
                    bg={selectedPlace?.id === place.id ? "blue.50" : "white"}
                    _hover={{ bg: "gray.50" }}
                    onClick={() => handlePlaceSelect(place)}
                  >
                    <HStack align="start" justify="space-between">
                      <VStack align="start" gap={1} flex={1}>
                        <HStack gap={2}>
                          <Text fontWeight="semibold" fontSize="sm">
                            {place.name}
                          </Text>
                          {place.category && (
                            <Badge colorScheme="purple" size="sm">
                              {place.category}
                            </Badge>
                          )}
                          <Badge colorScheme={place.provider === 'naver' ? 'green' : 'yellow'} size="xs">
                            {place.provider}
                          </Badge>
                        </HStack>
                        
                        <HStack gap={1} fontSize="xs" color="gray.600">
                          <MapPin size={12} />
                          <Text>{place.address}</Text>
                        </HStack>
                        
                        {place.roadAddress && (
                          <HStack gap={1} fontSize="xs" color="gray.500">
                            <Building size={12} />
                            <Text>도로명: {place.roadAddress}</Text>
                          </HStack>
                        )}
                        
                        <HStack gap={3} fontSize="xs" color="gray.500">
                          {place.phone && (
                            <HStack gap={1}>
                              <Phone size={12} />
                              <Text>{place.phone}</Text>
                            </HStack>
                          )}
                          {place.distance && (
                            <HStack gap={1}>
                              <Navigation size={12} />
                              <Text>{(parseInt(place.distance) / 1000).toFixed(1)}km</Text>
                            </HStack>
                          )}
                        </HStack>
                      </VStack>
                      
                      <ChevronRight size={20} color="#6b7280" />
                    </HStack>
                  </Box>
                ))}
              </VStack>
            ) : (
              <Box textAlign="center" py={8}>
                <Search size={48} color="#d1d5db" style={{ margin: "0 auto 12px" }} />
                <Text fontSize="sm" color="gray.500">
                  장소를 검색해보세요
                </Text>
                <Text fontSize="xs" color="gray.400" mt={1}>
                  {mapProvider === 'naver' ? '네이버' : '카카오'} 검색 사용 중
                </Text>
              </Box>
            )}
          </Box>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}

export default UnifiedMapSearch;