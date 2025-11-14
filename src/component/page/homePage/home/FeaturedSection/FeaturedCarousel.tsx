// src/components/home/FeaturedSection/FeaturedCarousel.tsx
import React, { useState, useEffect } from 'react';
import { Box, Container, Stack, Text, IconButton, HStack } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight, MapPin, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CusButton from "../../../../../common/elements/buttons/CusButton";

interface FeaturedCarouselProps {
  featuredDocs: DocumentDTO[];
}

function FeaturedCarousel({ featuredDocs }: FeaturedCarouselProps) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  // 자동 슬라이드
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredDocs.length);
    }, 5000); // 5초마다 변경
    
    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, featuredDocs.length]);
  
  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) =>
      prev === 0 ? featuredDocs.length - 1 : prev - 1
    );
  };
  
  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % featuredDocs.length);
  };
  
  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };
  
  const current = featuredDocs[currentIndex];
  const { featuredInfo } = current;
  
  return (
    <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }} mt={12}>
      <Stack direction="row" justify="space-between" align="center" mb={6}>
        <Text textStyle="2xl" fontWeight="bold">Featured This Month</Text>
        
        {/* 데스크톱용 네비게이션 */}
        <HStack display={{ base: "none", md: "flex" }} gap={2}>
          <IconButton
            aria-label="Previous"
            variant="ghost"
            size="sm"
            onClick={handlePrevious}
          >
            <ChevronLeft size={20} />
          </IconButton>
          <IconButton
            aria-label="Next"
            variant="ghost"
            size="sm"
            onClick={handleNext}
          >
            <ChevronRight size={20} />
          </IconButton>
        </HStack>
      </Stack>
      
      <Box position="relative">
        {/* 메인 캐러셀 컨테이너 */}
        <Box
          position="relative"
          borderRadius="2xl"
          overflow="hidden"
          shadow="lg"
          h={{ base: "96", md: "80" }}
        >
          {/* 슬라이드 래퍼 */}
          <Box
            display="flex"
            transition="transform 0.5s ease-in-out"
            transform={`translateX(-${currentIndex * 100}%)`}
            h="full"
          >
            {featuredDocs.map((doc, index) => (
              <Box
                key={doc.id}
                minW="full"
                h="full"
                position="relative"
                bgImage={`url(${doc.featuredInfo?.featuredImageUrl || doc.thumbnailImgUrl})`}
                bgSize="cover"
                bgGradient={
                  doc.featuredInfo?.featuredGradientFrom && doc.featuredInfo?.featuredGradientTo
                    ? `linear(to-r, ${doc.featuredInfo.featuredGradientFrom}, ${doc.featuredInfo.featuredGradientTo})`
                    : "linear(to-r, indigo.400, purple.600)"
                }
              >
                {/* 오버레이 */}
                <Box
                  position="absolute"
                  inset="0"
                  bgGradient="linear(to-t, black/70, transparent)"
                />
                
                {/* 콘텐츠 */}
                <Box
                  position="absolute"
                  bottom="0"
                  left="0"
                  right="0"
                  p={{ base: 6, md: 8 }}
                  color="white"
                >
                  {doc.featuredInfo?.location && (
                    <Stack direction="row" align="center" gap={2} mb={2}>
                      <MapPin size={20} />
                      <Text textStyle="sm">{doc.featuredInfo.location}</Text>
                    </Stack>
                  )}
                  
                  <Text
                    textStyle={{ base: "2xl", md: "3xl" }}
                    fontWeight="bold"
                    mb={2}
                  >
                    {doc.featuredInfo?.featuredTitle || doc.title}
                  </Text>
                  
                  <Text
                    textStyle={{ base: "md", md: "lg" }}
                    mb={4}
                    display={{ base: "none", sm: "block" }}
                  >
                    {doc.featuredInfo?.featuredSubtitle}
                  </Text>
                  
                  {doc.featuredInfo?.highlights && (
                    <Stack
                      direction="row"
                      gap={2}
                      mb={4}
                      display={{ base: "none", md: "flex" }}
                      flexWrap="wrap"
                    >
                      {doc.featuredInfo.highlights.slice(0, 3).map((highlight, idx) => (
                        <Box
                          key={idx}
                          px={3}
                          py={1}
                          bg="white/20"
                          borderRadius="full"
                          backdropFilter="blur(10px)"
                        >
                          <Text textStyle="sm">{highlight}</Text>
                        </Box>
                      ))}
                    </Stack>
                  )}
                  
                  <CusButton
                    variant="solid"
                    borderRadius="full"
                    size={{ base: "md", md: "lg" }}
                    onClick={() => navigate(`/blog/${doc.id}`)}
                    bg="white"
                    color="black"
                    _hover={{ bg: "gray.100" }}
                  >
                    {doc.featuredInfo?.ctaButtonText || 'Explore More'}
                    <ChevronRight size={20} />
                  </CusButton>
                </Box>
              </Box>
            ))}
          </Box>
          
          {/* 모바일용 좌우 네비게이션 버튼 */}
          <IconButton
            aria-label="Previous slide"
            position="absolute"
            left={{ base: 2, md: 4 }}
            top="50%"
            transform="translateY(-50%)"
            variant="ghost"
            colorPalette="white"
            bg="black/30"
            backdropFilter="blur(10px)"
            borderRadius="full"
            size={{ base: "sm", md: "md" }}
            onClick={handlePrevious}
            display={{ base: "flex", md: "none" }}
            _hover={{ bg: "black/50" }}
          >
            <ChevronLeft size={20} />
          </IconButton>
          
          <IconButton
            aria-label="Next slide"
            position="absolute"
            right={{ base: 2, md: 4 }}
            top="50%"
            transform="translateY(-50%)"
            variant="ghost"
            colorPalette="white"
            bg="black/30"
            backdropFilter="blur(10px)"
            borderRadius="full"
            size={{ base: "sm", md: "md" }}
            onClick={handleNext}
            display={{ base: "flex", md: "none" }}
            _hover={{ bg: "black/50" }}
          >
            <ChevronRight size={20} />
          </IconButton>
        </Box>
        
        {/* 인디케이터 (점) */}
        <HStack justify="center" mt={4} gap={2}>
          {featuredDocs.map((_, index) => (
            <Box
              key={index}
              as="button"
              w={index === currentIndex ? "8" : "2"}
              h="2"
              borderRadius="full"
              bg={index === currentIndex ? "blue.500" : "gray.300"}
              transition="all 0.3s"
              onClick={() => handleDotClick(index)}
              _hover={{ bg: index === currentIndex ? "blue.600" : "gray.400" }}
            />
          ))}
        </HStack>
        
        {/* 썸네일 미리보기 (데스크톱 전용) */}
        <Stack
          direction="row"
          gap={4}
          mt={6}
          display={{ base: "none", lg: "flex" }}
          justify="center"
        >
          {featuredDocs.map((doc, index) => (
            <Box
              key={doc.id}
              position="relative"
              w="200px"
              h="100px"
              borderRadius="lg"
              overflow="hidden"
              cursor="pointer"
              onClick={() => handleDotClick(index)}
              opacity={index === currentIndex ? 1 : 0.6}
              transform={index === currentIndex ? "scale(1.05)" : "scale(1)"}
              transition="all 0.3s"
              _hover={{ opacity: 1, transform: "scale(1.05)" }}
            >
              <Box
                w="full"
                h="full"
                bgImage={`url(${doc.featuredInfo?.featuredImageUrl || doc.thumbnailImgUrl})`}
                bgSize="cover"
              />
              <Box
                position="absolute"
                inset="0"
                bgGradient="linear(to-t, black/60, transparent)"
              />
              <Box
                position="absolute"
                bottom="2"
                left="2"
                right="2"
                color="white"
              >
                <Text textStyle="xs" fontWeight="bold" >
                  {doc.featuredInfo?.featuredTitle || doc.title}
                </Text>
              </Box>
              {index === currentIndex && (
                <Box
                  position="absolute"
                  bottom="0"
                  left="0"
                  right="0"
                  h="1"
                  bg="blue.500"
                />
              )}
            </Box>
          ))}
        </Stack>
      </Box>
    </Container>
  );
}

export default FeaturedCarousel;