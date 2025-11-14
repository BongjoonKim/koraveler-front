import React, { useState } from 'react';
import {
  Box,
  Card,
  Text,
  HStack,
  VStack,
  Flex,
  Circle,
  Grid,
  GridItem
} from "@chakra-ui/react";
import {
  Cloud,
  Droplets,
  Thermometer,
  Sun,
  CloudRain,
  CloudSnow,
  Zap,
  Eye,
  ChevronDown,
  ChevronUp,
  Wind
} from "lucide-react";
import useCusWeather from "./useCusWeather";

// Weather data interface
interface WeatherData {
  name?: string;
  main?: {
    temp?: number;
    feels_like?: number;
    temp_min?: number;
    temp_max?: number;
    humidity?: number;
  };
  weather?: Array<{
    description?: string;
    icon?: string;
  }>;
  wind?: {
    speed?: number;
  };
  visibility?: number;
}

export interface CusWeatherProps {}

function CusWeather(props: CusWeatherProps) {
  const { weatherData } = useCusWeather();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getWeatherIcon = (iconCode?: string) => {
    if (!iconCode) return <Cloud size={28} />;
    
    const iconComponents: { [key: string]: JSX.Element } = {
      '01d': <Sun size={28} />,
      '01n': <Sun size={28} />,
      '02d': <Cloud size={28} />,
      '02n': <Cloud size={28} />,
      '03d': <Cloud size={28} />,
      '03n': <Cloud size={28} />,
      '04d': <Cloud size={28} />,
      '04n': <Cloud size={28} />,
      '09d': <CloudRain size={28} />,
      '09n': <CloudRain size={28} />,
      '10d': <CloudRain size={28} />,
      '10n': <CloudRain size={28} />,
      '11d': <Zap size={28} />,
      '11n': <Zap size={28} />,
      '13d': <CloudSnow size={28} />,
      '13n': <CloudSnow size={28} />,
      '50d': <Eye size={28} />,
      '50n': <Eye size={28} />,
    };
    
    return iconComponents[iconCode] || <Cloud size={28} />;
  };
  
  const getWeatherDescription = (desc?: string) => {
    if (!desc) return 'Loading...';
    const translations: { [key: string]: string } = {
      'clear sky': 'Clear Sky',
      'few clouds': 'Few Clouds',
      'scattered clouds': 'Scattered Clouds',
      'broken clouds': 'Broken Clouds',
      'partly cloudy': 'Partly Cloudy',
      'overcast clouds': 'Overcast',
      'shower rain': 'Showers',
      'rain': 'Rain',
      'thunderstorm': 'Thunderstorm',
      'snow': 'Snow',
      'mist': 'Mist'
    };
    return translations[desc] || desc;
  };
  
  const round = (num: number, decimals: number) => {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  };
  
  const temp = weatherData?.main?.temp ? round(weatherData.main.temp - 273.15, 0) : null;
  const feelsLike = weatherData?.main?.feels_like ? round(weatherData.main.feels_like - 273.15, 0) : null;
  const tempMin = weatherData?.main?.temp_min ? round(weatherData.main.temp_min - 273.15, 0) : null;
  const tempMax = weatherData?.main?.temp_max ? round(weatherData.main.temp_max - 273.15, 0) : null;
  
  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <Card.Root
      bg="white"
      borderRadius="lg"
      boxShadow="md"
      cursor="pointer"
      transition="all 0.3s"
      _hover={{ boxShadow: "lg" }}
      onClick={handleCardClick}
      // gridColumn={isExpanded ? { md: "span 2" } : "span 1"}
    >
      <Card.Body p={6}>
        <VStack align="stretch" gap={0}>
          {/* Compact View - Always Visible */}
          <Flex align="center" gap={4}>
            <Circle size="56px" bg="blue.100">
              <Box color="blue.600">
                {getWeatherIcon(weatherData?.weather?.[0]?.icon)}
              </Box>
            </Circle>
            
            <Box flex={1}>
              <Text fontSize="sm" color="gray.500">
                Seoul Weather
              </Text>
              <Text fontSize="2xl" fontWeight="bold">
                {temp !== null ? `${temp}°C` : '--°C'}
              </Text>
              <Text fontSize="sm" color="gray.600">
                {weatherData?.weather?.[0]?.description
                  ? getWeatherDescription(weatherData.weather[0].description)
                  : 'Loading...'}
              </Text>
            </Box>
            
            <Box color="gray.400">
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </Box>
          </Flex>
          
          {/* Expanded View - Shown on Click */}
          {isExpanded && (
            <Box
              mt={6}
              pt={6}
              borderTop="1px"
              borderColor="gray.200"
              css={{
                animation: "fadeIn 0.3s ease-in-out",
                "@keyframes fadeIn": {
                  from: { opacity: 0, transform: "translateY(-10px)" },
                  to: { opacity: 1, transform: "translateY(0)" }
                }
              }}
            >
              <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={4}>
                {/* Feels Like */}
                <GridItem>
                  <Box bg="gray.50" borderRadius="lg" p={3}>
                    <HStack gap={2} mb={1}>
                      <Thermometer size={16} color="gray" />
                      <Text fontSize="xs" color="gray.500">
                        Feels Like
                      </Text>
                    </HStack>
                    <Text fontSize="lg" fontWeight="semibold">
                      {feelsLike !== null ? `${feelsLike}°C` : '--°C'}
                    </Text>
                  </Box>
                </GridItem>
                
                {/* Humidity */}
                <GridItem>
                  <Box bg="gray.50" borderRadius="lg" p={3}>
                    <HStack gap={2} mb={1}>
                      <Droplets size={16} color="gray" />
                      <Text fontSize="xs" color="gray.500">
                        Humidity
                      </Text>
                    </HStack>
                    <Text fontSize="lg" fontWeight="semibold">
                      {weatherData?.main?.humidity || '--'}%
                    </Text>
                  </Box>
                </GridItem>
                
                {/* Min/Max Temp */}
                <GridItem>
                  <Box bg="gray.50" borderRadius="lg" p={3}>
                    <HStack gap={2} mb={1}>
                      <Thermometer size={16} color="gray" />
                      <Text fontSize="xs" color="gray.500">
                        Min/Max
                      </Text>
                    </HStack>
                    <Text fontSize="lg" fontWeight="semibold">
                      {tempMin !== null && tempMax !== null ? `${tempMin}°/${tempMax}°` : '--/--'}
                    </Text>
                  </Box>
                </GridItem>
                
                {/* Wind Speed */}
                <GridItem>
                  <Box bg="gray.50" borderRadius="lg" p={3}>
                    <HStack gap={2} mb={1}>
                      <Wind size={16} color="gray" />
                      <Text fontSize="xs" color="gray.500">
                        Wind
                      </Text>
                    </HStack>
                    <Text fontSize="lg" fontWeight="semibold">
                      {weatherData?.wind?.speed || '--'} m/s
                    </Text>
                  </Box>
                </GridItem>
              </Grid>
            </Box>
          )}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}

// Main layout component for demonstration
function MainLayout() {
  return (
    <Box maxW="7xl" mx="auto" px={{ base: 4, sm: 6, lg: 8 }} py={8}>
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4} mb={8}>
        {/* Weather Card */}
        <CusWeather />
        
        {/* Today's Events Card */}
        <Card.Root bg="white" borderRadius="lg" boxShadow="md">
          <Card.Body p={6}>
            <Flex align="center" gap={4}>
              <Circle size="56px" bg="purple.100">
                <Box color="purple.600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path>
                  </svg>
                </Box>
              </Circle>
              <Box>
                <Text fontSize="sm" color="gray.500">Today's Events</Text>
                <Text fontSize="2xl" fontWeight="bold">3 Events</Text>
                <Text fontSize="sm" color="gray.600">Near you</Text>
              </Box>
            </Flex>
          </Card.Body>
        </Card.Root>
        
        {/* Transit Status Card */}
        <Card.Root bg="white" borderRadius="lg" boxShadow="md">
          <Card.Body p={6}>
            <Flex align="center" gap={4}>
              <Circle size="56px" bg="green.100">
                <Box color="green.600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" x2="12" y1="8" y2="12"></line>
                    <line x1="12" x2="12.01" y1="16" y2="16"></line>
                  </svg>
                </Box>
              </Circle>
              <Box>
                <Text fontSize="sm" color="gray.500">Transit Status</Text>
                <Text fontSize="2xl" fontWeight="bold">Normal</Text>
                <Text fontSize="sm" color="gray.600">All lines operating</Text>
              </Box>
            </Flex>
          </Card.Body>
        </Card.Root>
      </Grid>
    </Box>
  );
}

export default CusWeather;