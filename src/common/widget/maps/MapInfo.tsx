// common/widget/maps/MapInfo.tsx
import React, { useCallback, useState, useRef, useEffect } from 'react';
import {MapInfoProps, MapPosition} from "../../../types/maps/mapTypes";
import { useNaverMapController } from "./NaverMaps/useNaverMapController";
import NaverMap from "./NaverMaps/NaverMap";
import {useKakaoMapController} from "./KakaoMaps";
import KakaoMap from "./KakaoMaps/KakaoMap";
import {usePlaceQueries} from "../../../hooks/usePlaceQueries";
import {PlaceItem} from "../../../types/place/placeTypes";
import {Badge, Box, HStack, IconButton, Input, Spinner, Text, VStack} from "@chakra-ui/react";
import {Building, ChevronDown, ChevronUp, MapPin, Navigation, Phone, Search, X} from "lucide-react";
import CusIconButton from "../../elements/buttons/CusIconButton";
import CusButton from "../../elements/buttons/CusButton";
import { motion, useMotionValue, useDragControls, PanInfo, AnimatePresence } from "framer-motion";

// 바텀 시트 스냅 포인트 설정
type SheetState = 'collapsed' | 'half' | 'full';
const SHEET_PEEK_HEIGHT = 56;
const SHEET_HALF_RATIO = 0.45;
const SHEET_FULL_RATIO = 0.85;

function MapInfo(props: MapInfoProps) {
  const {
    provider = 'naver',
    center = { lat: 37.5665, lng: 126.9780 },
    zoom,
    width,
    height ,
    onMapLoad,
    showSearch = true
  } = props;

  const [kakaoRawMap, setKakaoRawMap] = useState<kakao.maps.Map | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [searchResults, setSearchResults] = useState<PlaceItem[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceItem | null>(null);
  const [mapCenter, setMapCenter] = useState<MapPosition>(center);
  const [isMapReady, setIsMapReady] = useState(false);
  const hasLoadedRef = useRef(false);

  // 바텀 시트 상태
  const [sheetState, setSheetState] = useState<SheetState>('collapsed');
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const dragControls = useDragControls();
  const sheetY = useMotionValue(0);

  const placeSearchMutation = usePlaceQueries();

  const naverController = useNaverMapController({
    center: center,
    zoom: zoom,
    onMapLoad: () => {
      // 소비자에게는 원시 map 이 아니라 아래 effect 에서 MapController 를 전달한다
      setIsMapReady(true);
    },
    provider: provider
  })

  const kakaoController = useKakaoMapController(provider === 'kakao' ? kakaoRawMap : null);
  const mapController = provider === 'naver' ? naverController : kakaoController;

  // 컨테이너 높이 추적
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 카카오맵 로드 핸들러
  const handleKakaoMapLoad = useCallback((map: kakao.maps.Map) => {
    if (!kakaoRawMap) {
      setKakaoRawMap(map);
      setIsMapReady(true);
    }
  }, [kakaoRawMap]);

  // 지도가 준비되면 한 번만 onMapLoad 로 MapController 전달
  useEffect(() => {
    if (isMapReady && mapController && onMapLoad && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      onMapLoad(mapController);
    }
  }, [isMapReady, mapController, onMapLoad]);

  // provider 변경 시 초기화
  useEffect(() => {
    hasLoadedRef.current = false;
    setKakaoRawMap(null);
    setSearchKeyword("");
    setSearchResults([]);
    setSelectedPlace(null);
    setIsMapReady(false);
    setSheetState('collapsed');
  }, [provider]);

  // 컨트롤러가 준비되고 검색 결과가 있을 때만 맵에 표시
  useEffect(() => {
    if (mapController && searchResults.length > 0 && isMapReady) {
      setTimeout(() => {
        displayPlacesOnMap(searchResults);
      }, 100);
    }
  }, [mapController, searchResults, isMapReady]);

  // 검색 결과 도착 시 바텀 시트 자동 확장
  useEffect(() => {
    if (searchResults.length > 0) {
      setSheetState('half');
    }
  }, [searchResults]);

  // 바텀 시트 스냅 포인트 계산
  const getSnapY = useCallback((state: SheetState) => {
    if (containerHeight === 0) return 0;
    switch (state) {
      case 'collapsed': return containerHeight - SHEET_PEEK_HEIGHT;
      case 'half': return containerHeight * (1 - SHEET_HALF_RATIO);
      case 'full': return containerHeight * (1 - SHEET_FULL_RATIO);
    }
  }, [containerHeight]);

  // 드래그 종료 시 스냅 처리
  const handleDragEnd = useCallback((_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const velocity = info.velocity.y;
    const currentY = sheetY.get();

    if (velocity > 400) {
      // 빠른 하단 스와이프 → 축소
      setSheetState(sheetState === 'full' ? 'half' : 'collapsed');
    } else if (velocity < -400) {
      // 빠른 상단 스와이프 → 확장
      setSheetState(sheetState === 'collapsed' ? 'half' : 'full');
    } else {
      // 가장 가까운 스냅 포인트로 이동
      const snapPoints: { state: SheetState; y: number }[] = [
        { state: 'collapsed', y: getSnapY('collapsed') },
        { state: 'half', y: getSnapY('half') },
        { state: 'full', y: getSnapY('full') },
      ];
      const nearest = snapPoints.reduce((prev, curr) =>
        Math.abs(curr.y - currentY) < Math.abs(prev.y - currentY) ? curr : prev
      );
      setSheetState(nearest.state);
    }
  }, [sheetState, sheetY, getSnapY]);

  // 핸들 탭 토글
  const handleSheetToggle = useCallback(() => {
    setSheetState(prev => prev === 'collapsed' ? 'half' : 'collapsed');
  }, []);

  const handleSearch = useCallback(async() => {
    if (!searchKeyword.trim()) {
      return;
    }

    try {
      const response = await placeSearchMutation.mutateAsync({
        keyword: searchKeyword,
      });

      if (response.data?.places?.length) {
        setSearchResults(response.data.places);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      alert("Search Error")
    }
  }, [searchKeyword, placeSearchMutation])

  const displayPlacesOnMap = useCallback((places: PlaceItem[]) => {
    if (!mapController || !isMapReady) return;

    mapController.clearMarkers();

    const positions: MapPosition[] = [];

    places.forEach((place: PlaceItem) => {
      const position = {lat: place.lat, lng: place.lng};

      mapController.addMarker({
        position: position,
        title: place.nameEn || place.name,
        onClick: () => {
          setSelectedPlace(place);
          setSheetState('collapsed');

          if (provider === 'naver' && mapController.morph) {
            setTimeout(() => {
              mapController.morph?.(position, 15, {
                duration: 600,
                easing: 'easeOutCubic'
              });
            }, 0);
          } else {
            mapController.setCenter(position);
            mapController.setZoom(15);
          }
        }
      });
      positions.push(position);
    });

    // 지도 범위 조정 - 첫 검색 시에만 실행
    if (positions.length > 0 && !selectedPlace) {
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

      setTimeout(() => {
        // 검색바와 바텀 시트를 고려한 패딩
        mapController.fitBounds(bounds, 80);
      }, 50);
    }
  }, [mapController, provider, selectedPlace, isMapReady]);

  const handlePlaceSelect = useCallback((place: PlaceItem) => {
    setSelectedPlace(place);
    setSheetState('collapsed');

    if (mapController && isMapReady) {
      const position = {lat: place.lat, lng: place.lng};

      if (provider === 'naver' && mapController.morph) {
        requestAnimationFrame(() => {
          mapController.morph?.(position, 15, {
            duration: 600,
            easing: 'easeOutCubic'
          });
        });
      } else {
        mapController.setCenter(position);
        mapController.setZoom(15);
      }
    }
  }, [mapController, provider, isMapReady]);

  const clearSearch = useCallback(() => {
    setSearchKeyword("");
    setSearchResults([]);
    setSelectedPlace(null);
    setSheetState('collapsed');
    if (mapController) {
      mapController.clearMarkers();
    }
  }, [mapController]);

  // 현재 위치 가져오기
  const getCurrentLocation = useCallback(async () => {
    if (!mapController || !isMapReady) return;

    try {
      const position = await mapController.getCurrentLocation();
      setMapCenter(position);

      if (provider === 'naver' && mapController.morph) {
        mapController.morph(position, 3, {
          duration: 800,
          easing: 'easeOutCubic'
        });
      } else {
        mapController.setCenter(position);
        mapController.setZoom(3);
      }

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
  }, [mapController, provider, isMapReady]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box
      ref={containerRef}
      position="relative"
      w={width || "100%"}
      h={height || "100%"}
      overflow="hidden"
      borderRadius="lg"
    >
      {/* 레이어 1: 전체 너비 지도 */}
      <Box position="absolute" top={0} left={0} right={0} bottom={0}>
        {provider === 'naver' ? (
          <NaverMap
            center={mapCenter}
            zoom={zoom}
            width="100%"
            height="100%"
            provider={provider}
            controller={naverController}
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

      {/* 레이어 2: 상단 검색바 오버레이 */}
      {showSearch && (
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        zIndex={10}
        p={2}
        css={{
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <HStack gap={1.5} w="full">
          <Box flex={1} position="relative">
            <Input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search places..."
              pl={9}
              pr={searchKeyword ? 9 : 3}
              bg="white"
              borderColor="gray.300"
              size="sm"
              css={{
                fontSize: "13px",
                "&::placeholder": { color: "#9ca3af" },
                "&:focus": { borderColor: "#6366f1", boxShadow: "0 0 0 1px #6366f1" }
              }}
            />
            <Box position="absolute" left={2.5} top="50%" transform="translateY(-50%)">
              <Search size={15} color="#6b7280" />
            </Box>
            {searchKeyword && (
              <CusIconButton
                aria-label="Clear"
                size="xs"
                variant="ghost"
                position="absolute"
                right={1}
                top="50%"
                transform="translateY(-50%)"
                onClick={clearSearch}
              >
                <X size={13} />
              </CusIconButton>
            )}
          </Box>
          <CusButton
            size="sm"
            leftIcon={<Search size={13} />}
            onClick={handleSearch}
            isLoading={placeSearchMutation.isPending}
            loadingText=""
            css={{
              background: "#6366f1",
              color: "white",
              fontSize: "13px",
              paddingLeft: "10px",
              paddingRight: "12px",
              "&:hover": { background: "#4f46e5" }
            }}
          >
            Search
          </CusButton>
        </HStack>
      </Box>
      )}

      {/* 현재 위치 플로팅 버튼 (검색바 아래, 지도 오른쪽) */}
      {showSearch && (
      <IconButton
        aria-label="Current location"
        onClick={getCurrentLocation}
        variant="outline"
        size="sm"
        bg="white"
        position="absolute"
        top="52px"
        right="10px"
        zIndex={10}
        borderRadius="full"
        css={{
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          border: "1px solid #e5e7eb",
          "&:hover": { background: "#f3f4f6" }
        }}
      >
        <Navigation size={16} />
      </IconButton>
      )}

      {/* 레이어 3: 바텀 시트 */}
      {showSearch && containerHeight > 0 && (
        <motion.div
          drag="y"
          dragControls={dragControls}
          dragListener={false}
          dragConstraints={{
            top: getSnapY('full'),
            bottom: getSnapY('collapsed'),
          }}
          dragElastic={0.05}
          onDragEnd={handleDragEnd}
          animate={{ y: getSnapY(sheetState) }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: containerHeight,
            zIndex: 20,
            background: 'white',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
            touchAction: 'none',
            display: 'flex',
            flexDirection: 'column',
            y: sheetY,
          }}
        >
          {/* 드래그 핸들 */}
          <Box
            py={3}
            display="flex"
            flexDirection="column"
            alignItems="center"
            cursor="grab"
            onPointerDown={(e) => dragControls.start(e)}
            onClick={handleSheetToggle}
            css={{ userSelect: "none" }}
          >
            <Box w="40px" h="4px" bg="gray.300" borderRadius="full" mb={2} />
            <HStack gap={2} px={4} w="full" justify="space-between">
              <Text fontSize="sm" color="gray.600" fontWeight="medium">
                {placeSearchMutation.isPending
                  ? "Searching..."
                  : searchResults.length > 0
                    ? `${searchResults.length} places found`
                    : selectedPlace
                      ? selectedPlace.nameEn || selectedPlace.name
                      : "Search for places"
                }
              </Text>
              <Box color="gray.400">
                {sheetState === 'collapsed' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Box>
            </HStack>
          </Box>

          {/* 선택된 장소 요약 (collapsed 상태에서 보임) */}
          <AnimatePresence>
            {selectedPlace && sheetState === 'collapsed' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <Box
                  mx={4}
                  mb={2}
                  p={3}
                  bg="blue.50"
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="blue.200"
                >
                  <HStack justify="space-between">
                    <VStack align="start" gap={0}>
                      <Text fontWeight="semibold" fontSize="sm">
                        {selectedPlace.nameEn || selectedPlace.name}
                      </Text>
                      {selectedPlace.addressKo && (
                        <Text fontSize="xs" color="gray.600">
                          {selectedPlace.addressKo}
                        </Text>
                      )}
                    </VStack>
                    <CusIconButton
                      aria-label="Close"
                      size="xs"
                      variant="ghost"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        clearSearch();
                      }}
                    >
                      <X size={14} />
                    </CusIconButton>
                  </HStack>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 스크롤 가능한 검색 결과 목록 */}
          <Box
            flex={1}
            overflowY="auto"
            css={{
              touchAction: "pan-y",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {placeSearchMutation.isPending ? (
              <VStack py={8}>
                <Spinner size="lg" color="blue.500" />
                <Text fontSize="sm" color="gray.600">Searching...</Text>
              </VStack>
            ) : searchResults.length ? (
              <VStack align="stretch" gap={0}>
                {searchResults.map((place) => (
                  <Box
                    key={place.id}
                    px={4}
                    py={3}
                    borderBottom="1px solid"
                    borderColor="gray.100"
                    cursor="pointer"
                    bg={selectedPlace?.id === place.id ? "blue.50" : "white"}
                    _hover={{ bg: "gray.50" }}
                    onClick={() => handlePlaceSelect(place)}
                    css={{ transition: "background 0.15s" }}
                  >
                    <VStack align="start" gap={1.5}>
                      <HStack justify="space-between" w="full">
                        <VStack align="start" gap={0}>
                          <Text fontWeight="semibold" fontSize="sm">
                            {place.nameEn || place.name}
                          </Text>
                          {place.name !== place.nameEn && (
                            <Text fontSize="xs" color="gray.600">
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

                      <VStack align="start" gap={0.5} w="full" fontSize="xs">
                        {place.addressEn && (
                          <HStack gap={1} color="gray.600">
                            <MapPin size={12} />
                            <Text>{place.addressEn}</Text>
                          </HStack>
                        )}

                        <HStack gap={1} color="gray.500">
                          <Building size={12} />
                          <Text>{place.addressKo}</Text>
                        </HStack>

                        {place.phone && (
                          <HStack gap={1} color="gray.500">
                            <Phone size={12} />
                            <Text>{place.phone}</Text>
                          </HStack>
                        )}
                      </VStack>
                    </VStack>
                  </Box>
                ))}
              </VStack>
            ) : (
              <Box textAlign="center" py={8}>
                <Search size={36} color="#d1d5db" style={{ margin: "0 auto 8px" }} />
                <Text fontSize="sm" color="gray.500">
                  Search Places
                </Text>
                <Text fontSize="xs" color="gray.400" mt={1}>
                  you can get some information
                </Text>
              </Box>
            )}
          </Box>
        </motion.div>
      )}
    </Box>
  )
}

export default MapInfo;
