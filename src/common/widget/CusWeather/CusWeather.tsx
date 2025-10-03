import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Stack,
  Text,
  Grid,
  HStack,
  VStack,
  Flex,
  Circle,
  Badge
} from "@chakra-ui/react";
import {
  Cloud,
  Droplets,
  Wind,
  Thermometer,
  Sun,
  CloudRain,
  CloudSnow,
  Zap,
  Eye,
  Sunrise,
  Sunset,
  Navigation
} from "lucide-react";
import useCusWeather from "./useCusWeather";
import { round } from "lodash";

export interface CusWeatherProps {}

function CusWeather(props: CusWeatherProps) {
  const { weatherData } = useCusWeather(props);
  const [currentTime, setCurrentTime] = useState(new Date());
  
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
  
  const getWeatherGradient = (iconCode?: string) => {
    if (!iconCode) return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    
    const gradientMap: { [key: string]: string } = {
      '01d': "linear-gradient(135deg, #f5af19 0%, #f12711 100%)", // Clear day
      '01n': "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)", // Clear night
      '02d': "linear-gradient(135deg, #56ccf2 0%, #2f80ed 100%)", // Few clouds day
      '02n': "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)", // Few clouds night
      '03d': "linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)", // Scattered clouds
      '03n': "linear-gradient(135deg, #232526 0%, #414345 100%)", // Scattered clouds night
      '04d': "linear-gradient(135deg, #757f9a 0%, #d7dde8 100%)", // Broken clouds
      '04n': "linear-gradient(135deg, #373b44 0%, #4286f4 100%)", // Broken clouds night
      '09d': "linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)", // Shower rain
      '09n': "linear-gradient(135deg, #141e30 0%, #243b55 100%)", // Shower rain night
      '10d': "linear-gradient(135deg, #3a7bd5 0%, #3a6073 100%)", // Rain
      '10n': "linear-gradient(135deg, #283048 0%, #859398 100%)", // Rain night
      '11d': "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)", // Thunderstorm
      '11n': "linear-gradient(135deg, #16222a 0%, #3a6073 100%)", // Thunderstorm night
      '13d': "linear-gradient(135deg, #e6dada 0%, #274046 100%)", // Snow
      '13n': "linear-gradient(135deg, #2c5364 0%, #203a43 50%, #0f2027 100%)", // Snow night
      '50d': "linear-gradient(135deg, #d3cce3 0%, #e9e4f0 100%)", // Mist
      '50n': "linear-gradient(135deg, #485563 0%, #29323c 100%)", // Mist night
    };
    
    return gradientMap[iconCode] || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  };
  
  const getWeatherIcon = (iconCode?: string) => {
    if (!iconCode) return <Cloud size={48} />;
    
    const iconComponents: { [key: string]: JSX.Element } = {
      '01d': <Sun size={48} />,
      '01n': <Sun size={48} />,
      '02d': <Cloud size={48} />,
      '02n': <Cloud size={48} />,
      '03d': <Cloud size={48} />,
      '03n': <Cloud size={48} />,
      '04d': <Cloud size={48} />,
      '04n': <Cloud size={48} />,
      '09d': <CloudRain size={48} />,
      '09n': <CloudRain size={48} />,
      '10d': <CloudRain size={48} />,
      '10n': <CloudRain size={48} />,
      '11d': <Zap size={48} />,
      '11n': <Zap size={48} />,
      '13d': <CloudSnow size={48} />,
      '13n': <CloudSnow size={48} />,
      '50d': <Eye size={48} />,
      '50n': <Eye size={48} />,
    };
    
    return iconComponents[iconCode] || <Cloud size={48} />;
  };
  
  const getWeatherDescription = (desc?: string) => {
    if (!desc) return 'Loading...';
    const translations: { [key: string]: string } = {
      'clear sky': '맑음',
      'few clouds': '구름 조금',
      'scattered clouds': '구름 많음',
      'broken clouds': '흐림',
      'overcast clouds': '매우 흐림',
      'shower rain': '소나기',
      'rain': '비',
      'thunderstorm': '천둥번개',
      'snow': '눈',
      'mist': '안개'
    };
    return translations[desc] || desc;
  };
  
  const temp = weatherData?.main?.temp ? round(weatherData.main.temp - 273.15, 0) : null;
  const feelsLike = weatherData?.main?.feels_like ? round(weatherData.main.feels_like - 273.15, 0) : null;
  
  return (
    <Card.Root
      overflow="hidden"
      css={{
        background: getWeatherGradient(weatherData?.weather?.[0]?.icon),
        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        "&:hover": {
          transform: "translateY(-8px) scale(1.02)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
        }
      }}
    >
      <Card.Body p={6}>
        <VStack align="stretch" gap={4}>
          {/* Header */}
          <Flex justify="space-between" align="center">
            <VStack align="start" gap={0}>
              <HStack gap={1} opacity={0.9}>
                <Navigation size={14} />
                <Text fontSize="xs" fontWeight="medium" color="white">
                  현재 위치
                </Text>
              </HStack>
              <Text fontSize="xl" fontWeight="bold" color="white">
                {weatherData?.name || "Seoul"}
              </Text>
            </VStack>
            <Badge
              colorScheme="whiteAlpha"
              bg="whiteAlpha.200"
              px={3}
              py={1}
              borderRadius="full"
              fontSize="sm"
              fontWeight="bold"
            >
              {formatTime(currentTime)}
            </Badge>
          </Flex>
          
          {/* Main Weather Display */}
          <Grid
            w={"100%"}
            templateColumns={{base: "1fr", md: "repeat(2, 1fr)"}}
            gap={"1rem"}
            h={"7rem"}
          >
            <Box textAlign="center" py={4} justifyContent={"center"} h={"100%"}>
              <Flex direction={"column"} justify="center" mb={3} >
                <Circle
                  size="100%"
                  bg="whiteAlpha.200"
                  backdropFilter="blur(10px)"
                  css={{
                    animation: "float 3s ease-in-out infinite",
                    "@keyframes float": {
                      "0%, 100%": { transform: "translateY(0)" },
                      "50%": { transform: "translateY(-10px)" }
                    }
                  }}
                >
                  <Box color="white">
                    {getWeatherIcon(weatherData?.weather?.[0]?.icon)}
                  </Box>
                </Circle>
                <Text
                  fontSize="lg"
                  color="whiteAlpha.900"
                  mt={2}
                  fontWeight="medium"
                >
                  {weatherData?.weather?.[0]?.description
                    ? getWeatherDescription(weatherData.weather[0].description)
                    : 'Loading...'}
                </Text>
              </Flex>
            </Box>
            <Box textAlign="center" py={4} justifyContent={"center"}>
              <Flex direction={"column"} justify="center" mb={3}>
              <Text
                fontSize="3rem"
                fontWeight="bold"
                color="white"
                lineHeight="1"
                css={{
                  textShadow: "2px 2px 4px rgba(0,0,0,0.2)"
                }}
              >
                {temp !== null ? `${temp}°` : '--°'}
              </Text>
              {feelsLike !== null && (
                <Text fontSize="sm" color="whiteAlpha.800" mt={1}>
                  체감 {feelsLike}°
                </Text>
              )}
              </Flex>
            </Box>
          </Grid>
          {/* Weather Details Grid */}
          <Grid templateColumns="repeat(3, 1fr)" gap={3}>
            <Box
              bg="whiteAlpha.200"
              backdropFilter="blur(10px)"
              borderRadius="xl"
              p={3}
              textAlign="center"
              transition="all 0.3s"
              _hover={{
                bg: "whiteAlpha.300",
                transform: "translateY(-2px)"
              }}
            >
              <Circle size="35px" bg="whiteAlpha.300" mb={2} mx="auto">
                <Droplets size={18} color="white" />
              </Circle>
              <Text fontSize="xs" color="whiteAlpha.800">습도</Text>
              <Text fontSize="lg" fontWeight="bold" color="white">
                {weatherData?.main?.humidity || '--'}%
              </Text>
            </Box>
            
            <Box
              bg="whiteAlpha.200"
              backdropFilter="blur(10px)"
              borderRadius="xl"
              p={3}
              textAlign="center"
              transition="all 0.3s"
              _hover={{
                bg: "whiteAlpha.300",
                transform: "translateY(-2px)"
              }}
            >
              <Circle size="35px" bg="whiteAlpha.300" mb={2} mx="auto">
                <Wind size={18} color="white" />
              </Circle>
              <Text fontSize="xs" color="whiteAlpha.800">풍속</Text>
              <Text fontSize="lg" fontWeight="bold" color="white">
                {weatherData?.wind?.speed || '--'} m/s
              </Text>
            </Box>
            
            <Box
              bg="whiteAlpha.200"
              backdropFilter="blur(10px)"
              borderRadius="xl"
              p={3}
              textAlign="center"
              transition="all 0.3s"
              _hover={{
                bg: "whiteAlpha.300",
                transform: "translateY(-2px)"
              }}
            >
              <Circle size="35px" bg="whiteAlpha.300" mb={2} mx="auto">
                <Eye size={18} color="white" />
              </Circle>
              <Text fontSize="xs" color="whiteAlpha.800">가시거리</Text>
              <Text fontSize="lg" fontWeight="bold" color="white">
                {weatherData?.visibility ? `${(weatherData.visibility / 1000).toFixed(1)}km` : '--'}
              </Text>
            </Box>
          </Grid>
          
          {/* Min/Max Temperature */}
          {weatherData?.main?.temp_min && weatherData?.main?.temp_max && (
            <HStack
              justify="center"
              gap={6}
              pt={2}
              borderTop="1px solid"
              borderColor="whiteAlpha.200"
            >
              <HStack gap={2}>
                <Text fontSize="sm" color="whiteAlpha.700">최저</Text>
                <Text fontSize="md" fontWeight="bold" color="white">
                  {round(weatherData.main.temp_min - 273.15, 0)}°
                </Text>
              </HStack>
              <Box w="1px" h="20px" bg="whiteAlpha.300" />
              <HStack gap={2}>
                <Text fontSize="sm" color="whiteAlpha.700">최고</Text>
                <Text fontSize="md" fontWeight="bold" color="white">
                  {round(weatherData.main.temp_max - 273.15, 0)}°
                </Text>
              </HStack>
            </HStack>
          )}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}

export default CusWeather;