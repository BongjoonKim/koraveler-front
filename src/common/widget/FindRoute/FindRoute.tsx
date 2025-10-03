import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  Text,
  HStack,
  VStack,
  Input,
  Button,
  IconButton,
  Tabs,
  Badge,
  Spinner,
  Grid
} from "@chakra-ui/react";
import {
  MapPin,
  Navigation,
  Route,
  Clock,
  Car,
  Train,
  Footprints,
  Search,
  Star,
  Bookmark,
  RotateCcw,
  ArrowRight,
  Map as MapIcon,
  ChevronRight
} from "lucide-react";
import CusButton from "../../elements/buttons/CusButton";
import CusIconButton from "../../elements/buttons/CusIconButton";

export interface FindRouteProps {}

interface SavedRoute {
  id: string;
  from: string;
  to: string;
  duration: string;
  distance: string;
  type: 'car' | 'transit' | 'walk';
  favorite?: boolean;
}

interface PopularPlace {
  name: string;
  nameKr: string;
  address: string;
  category: string;
  lat: number;
  lng: number;
}

declare global {
  interface Window {
    naver: any;
  }
}

function FindRoute(props: FindRouteProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [routeType, setRouteType] = useState<'car' | 'transit' | 'walk'>('transit');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([
    {
      id: '1',
      from: '명동역',
      to: '강남역',
      duration: '35분',
      distance: '12.5km',
      type: 'transit',
      favorite: true
    },
    {
      id: '2',
      from: '인천공항',
      to: '서울역',
      duration: '55분',
      distance: '62km',
      type: 'car',
      favorite: false
    },
    {
      id: '3',
      from: '호텔',
      to: '경복궁',
      duration: '20분',
      distance: '3.2km',
      type: 'walk',
      favorite: true
    }
  ]);
  
  const popularPlaces: PopularPlace[] = [
    {
      name: 'N Seoul Tower',
      nameKr: 'N서울타워',
      address: '남산공원, 용산구',
      category: '랜드마크',
      lat: 37.5511,
      lng: 126.9882
    },
    {
      name: 'Myeongdong',
      nameKr: '명동',
      address: '중구, 서울',
      category: '쇼핑',
      lat: 37.5636,
      lng: 126.9869
    },
    {
      name: 'Hongdae',
      nameKr: '홍대',
      address: '마포구, 서울',
      category: '엔터테인먼트',
      lat: 37.5563,
      lng: 126.9219
    },
    {
      name: 'Bukchon Village',
      nameKr: '북촌한옥마을',
      address: '종로구, 서울',
      category: '문화',
      lat: 37.5815,
      lng: 126.9850
    }
  ];
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };
  
  // Naver Map 초기화
  useEffect(() => {
    const initializeMap = () => {
      if (mapRef.current && window.naver && window.naver.maps) {
        const mapOptions = {
          center: new window.naver.maps.LatLng(37.5665, 126.9780), // 서울 중심
          zoom: 13,
          zoomControl: true,
          zoomControlOptions: {
            position: window.naver.maps.Position.TOP_RIGHT
          }
        };
        
        const mapInstance = new window.naver.maps.Map(mapRef.current, mapOptions);
        setMap(mapInstance);
        
        // 현재 위치 마커 추가
        new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(37.5665, 126.9780),
          map: mapInstance
        });
      }
    };
    
    // Naver Map API 스크립트 로드 확인
    if (window.naver && window.naver.maps) {
      initializeMap();
    } else {
      // 실제 구현 시 Naver Map API 스크립트 로드 필요
      // <script type="text/javascript" src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=YOUR_CLIENT_ID"></script>
      console.log('Naver Map API needs to be loaded');
    }
  }, []);
  
  const handleSearch = async () => {
    if (!fromLocation || !toLocation) return;
    
    setIsSearching(true);
    try {
      // TODO: Naver Directions API 연동
      // const response = await fetch('/api/naver/directions', {
      //   method: 'POST',
      //   headers: {
      //     'X-NCP-APIGW-API-KEY-ID': 'YOUR_API_KEY',
      //     'X-NCP-APIGW-API-KEY': 'YOUR_SECRET',
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     start: fromLocation,
      //     goal: toLocation,
      //     option: routeType
      //   })
      // });
      // const data = await response.json();
      
      // Mock 검색 지연
      setTimeout(() => {
        setIsSearching(false);
        console.log(`Searching route from ${fromLocation} to ${toLocation}`);
        // 실제로는 경로를 지도에 그리기
      }, 1500);
    } catch (error) {
      console.error('Route search error:', error);
      setIsSearching(false);
    }
  };
  
  const swapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };
  
  const setQuickLocation = (place: PopularPlace) => {
    setToLocation(place.nameKr);
    if (map && window.naver && window.naver.maps) {
      map.setCenter(new window.naver.maps.LatLng(place.lat, place.lng));
      map.setZoom(15);
      
      // 마커 추가
      new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(place.lat, place.lng),
        map: map
      });
    }
  };
  
  const toggleFavorite = (id: string) => {
    setSavedRoutes(prev =>
      prev.map(route =>
        route.id === id ? { ...route, favorite: !route.favorite } : route
      )
    );
  };
  
  const getRouteIcon = (type: 'car' | 'transit' | 'walk') => {
    switch(type) {
      case 'car': return <Car size={14} />;
      case 'transit': return <Train size={14} />;
      case 'walk': return <Footprints size={14} />;
      default: return <Route size={14} />;
    }
  };
  
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          if (map && window.naver && window.naver.maps) {
            const currentPos = new window.naver.maps.LatLng(lat, lng);
            map.setCenter(currentPos);
            map.setZoom(15);
            
            // 현재 위치 마커
            new window.naver.maps.Marker({
              position: currentPos,
              map: map,
              icon: {
                content: '<div style="background: #4285F4; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
                anchor: new window.naver.maps.Point(10, 10)
              }
            });
          }
          setFromLocation('현재 위치');
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };
  
  return (
    <Card.Root
      bg="white"
      shadow="lg"
      overflow="hidden"
      css={{
        background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        transition: "all 0.3s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.15)"
        }
      }}
    >
      <Card.Body color="black">
        <VStack align="stretch" gap={3}>
          {/* 상단: 제목과 시간 */}
          <HStack justify="space-between">
            <HStack gap={2}>
              <MapIcon size={24} />
              <Text fontSize="lg" fontWeight="semibold">
                Route Finder
              </Text>
            </HStack>
            <Text fontSize="sm" opacity={0.8}>
              {formatTime(currentTime)}
            </Text>
          </HStack>
          
          {/* Tabs */}
          <Tabs.Root
            value={selectedTab.toString()}
            onValueChange={(e : any) => setSelectedTab(parseInt(e.value))}
          >
            <Tabs.List bg="whiteAlpha.200" borderRadius="lg">
              <Tabs.Trigger value="0" color="black">
                경로 검색
              </Tabs.Trigger>
              <Tabs.Trigger value="1" color="black">
                저장된 경로
              </Tabs.Trigger>
              <Tabs.Trigger value="2" color="black">
                지도 보기
              </Tabs.Trigger>
            </Tabs.List>
            
            <Tabs.Content value="0">
              <VStack gap={3} mt={3}>
                {/* 이동 수단 선택 */}
                <HStack w="full" justify="center" gap={2}>
                  <CusButton
                    size="sm"
                    leftIcon={<Train size={16} />}
                    variant={routeType === 'transit' ? 'solid' : 'outline'}
                    bg={routeType === 'transit' ? 'whiteAlpha.400' : 'transparent'}
                    borderColor="whiteAlpha.400"
                    color="black"
                    onClick={() => setRouteType('transit')}
                    _hover={{ bg: "whiteAlpha.300" }}
                  >
                    대중교통
                  </CusButton>
                  <CusButton
                    size="sm"
                    leftIcon={<Car size={16} />}
                    variant={routeType === 'car' ? 'solid' : 'outline'}
                    bg={routeType === 'car' ? 'whiteAlpha.400' : 'transparent'}
                    borderColor="whiteAlpha.400"
                    color="black"
                    onClick={() => setRouteType('car')}
                    _hover={{ bg: "whiteAlpha.300" }}
                  >
                    자동차
                  </CusButton>
                  <CusButton
                    size="sm"
                    leftIcon={<Footprints size={16} />}
                    variant={routeType === 'walk' ? 'solid' : 'outline'}
                    bg={routeType === 'walk' ? 'whiteAlpha.400' : 'transparent'}
                    borderColor="whiteAlpha.400"
                    color="black"
                    onClick={() => setRouteType('walk')}
                    _hover={{ bg: "whiteAlpha.300" }}
                  >
                    도보
                  </CusButton>
                </HStack>
                
                {/* 위치 입력 */}
                <VStack w="full" gap={2} position="relative">
                  <HStack w="full" gap={2}>
                    <Box flex={1} position="relative">
                      <Input
                        value={fromLocation}
                        onChange={(e) => setFromLocation(e.target.value)}
                        placeholder="출발지"
                        pl={10}
                        bg="whiteAlpha.200"
                        borderColor="whiteAlpha.400"
                        color="black"
                        _placeholder={{ color: "whiteAlpha.600" }}
                        _hover={{ borderColor: "whiteAlpha.600" }}
                        _focus={{ borderColor: "white", bg: "whiteAlpha.300" }}
                      />
                      <Box position="absolute" left={3} top="50%" transform="translateY(-50%)">
                        <MapPin size={18} />
                      </Box>
                    </Box>
                    <CusIconButton
                      aria-label="현재 위치"
                      icon={<Navigation size={16} />}
                      size="sm"
                      variant="ghost"
                      color="black"
                      onClick={getCurrentLocation}
                      _hover={{ bg: "whiteAlpha.300" }}
                    />
                  </HStack>
                  
                  <CusIconButton
                    aria-label="위치 바꾸기"
                    icon={<RotateCcw size={16} />}
                    size="xs"
                    variant="ghost"
                    color="black"
                    position="absolute"
                    right={12}
                    top="50%"
                    transform="translateY(-50%)"
                    onClick={swapLocations}
                    _hover={{ bg: "whiteAlpha.300" }}
                    zIndex={2}
                  />
                  
                  <Box w="full" position="relative">
                    <Input
                      value={toLocation}
                      onChange={(e) => setToLocation(e.target.value)}
                      placeholder="도착지"
                      pl={10}
                      bg="whiteAlpha.200"
                      borderColor="whiteAlpha.400"
                      color="black"
                      _placeholder={{ color: "whiteAlpha.600" }}
                      _hover={{ borderColor: "whiteAlpha.600" }}
                      _focus={{ borderColor: "white", bg: "whiteAlpha.300" }}
                    />
                    <Box position="absolute" left={3} top="50%" transform="translateY(-50%)">
                      <Route size={18} />
                    </Box>
                  </Box>
                </VStack>
                
                {/* 검색 버튼 */}
                <CusButton
                  w="full"
                  leftIcon={<Search size={18} />}
                  onClick={handleSearch}
                  isLoading={isSearching}
                  loadingText="경로 검색 중..."
                  bg="whiteAlpha.300"
                  color="black"
                  _hover={{ bg: "whiteAlpha.400" }}
                >
                  경로 찾기
                </CusButton>
                
                {/* 인기 장소 */}
                <Box w="full">
                  <Text fontSize="sm" mb={2} opacity={0.9}>
                    인기 목적지
                  </Text>
                  <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                    {popularPlaces.map((place, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant="outline"
                        borderColor="whiteAlpha.400"
                        color="black"
                        fontSize="xs"
                        onClick={() => setQuickLocation(place)}
                        _hover={{ bg: "whiteAlpha.200" }}
                        p={2}
                      >
                        <VStack align="start" gap={0} w="full">
                          <Text fontWeight="bold">{place.nameKr}</Text>
                          <Text opacity={0.8} fontSize="xs">{place.category}</Text>
                        </VStack>
                      </Button>
                    ))}
                  </Grid>
                </Box>
              </VStack>
            </Tabs.Content>
            
            <Tabs.Content value="1">
              <VStack gap={2} mt={3} maxH="300px" overflowY="auto">
                {savedRoutes.map((route) => (
                  <Box
                    key={route.id}
                    w="full"
                    p={3}
                    bg="whiteAlpha.200"
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor="whiteAlpha.300"
                    _hover={{ bg: "whiteAlpha.300" }}
                    cursor="pointer"
                    onClick={() => {
                      setFromLocation(route.from);
                      setToLocation(route.to);
                      setRouteType(route.type);
                      setSelectedTab(0);
                    }}
                  >
                    <HStack justify="space-between">
                      <VStack align="start" gap={1} flex={1}>
                        <HStack>
                          {getRouteIcon(route.type)}
                          <Text fontWeight="semibold" fontSize="sm">
                            {route.from}
                          </Text>
                        </HStack>
                        <HStack fontSize="xs" opacity={0.9}>
                          <ChevronRight size={12} />
                          <Text>{route.to}</Text>
                        </HStack>
                        <HStack fontSize="xs" gap={3}>
                          <HStack gap={1}>
                            <Clock size={12} />
                            <Text>{route.duration}</Text>
                          </HStack>
                          <Text>•</Text>
                          <Text>{route.distance}</Text>
                        </HStack>
                      </VStack>
                      <CusIconButton
                        aria-label="즐겨찾기"
                        icon={<Star size={16} fill={route.favorite ? 'white' : 'none'} />}
                        size="sm"
                        variant="ghost"
                        color="black"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(route.id);
                        }}
                        _hover={{ bg: "whiteAlpha.400" }}
                      />
                    </HStack>
                  </Box>
                ))}
                
                {savedRoutes.length === 0 && (
                  <Box textAlign="center" py={4}>
                    <Bookmark size={32} opacity={0.5} />
                    <Text fontSize="sm" opacity={0.7} mt={2}>
                      저장된 경로가 없습니다
                    </Text>
                  </Box>
                )}
              </VStack>
            </Tabs.Content>
            
            <Tabs.Content value="2">
              <Box mt={3}>
                {/* Naver Map Container */}
                <Box
                  ref={mapRef}
                  w="full"
                  h="250px"
                  borderRadius="lg"
                  overflow="hidden"
                  bg="whiteAlpha.200"
                  position="relative"
                >
                  {!map && (
                    <VStack
                      justify="center"
                      align="center"
                      h="full"
                      bg="whiteAlpha.100"
                    >
                      <Spinner size="lg" color="white" />
                      <Text fontSize="sm" opacity={0.8}>
                        지도 로딩 중...
                      </Text>
                    </VStack>
                  )}
                </Box>
                
                <HStack mt={3} gap={2}>
                  <CusButton
                    size="sm"
                    leftIcon={<Navigation size={14} />}
                    flex={1}
                    bg="whiteAlpha.300"
                    color="black"
                    onClick={getCurrentLocation}
                    _hover={{ bg: "whiteAlpha.400" }}
                  >
                    내 위치
                  </CusButton>
                  <CusButton
                    size="sm"
                    leftIcon={<MapPin size={14} />}
                    flex={1}
                    bg="whiteAlpha.300"
                    color="black"
                    onClick={handleSearch}
                    _hover={{ bg: "whiteAlpha.400" }}
                  >
                    경로 보기
                  </CusButton>
                </HStack>
              </Box>
            </Tabs.Content>
          </Tabs.Root>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}

export default FindRoute;