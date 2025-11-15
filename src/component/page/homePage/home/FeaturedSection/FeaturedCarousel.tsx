// src/components/home/FeaturedSection/FeaturedCarousel.tsx
import React, { useState, useEffect } from 'react';
import { Box, Container, Stack, Text, IconButton, HStack, VStack } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CusButton from "../../../../../common/elements/buttons/CusButton";
import CusIconButton from "../../../../../common/elements/buttons/CusIconButton";

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
    }, 10000); // 5초마다 변경
    
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
      <HStack justify="space-between" align="center" mb={6}>
        <Text fontSize="2xl" fontWeight="bold" color="gray.900">
          Featured This Month
        </Text>
        
        {/* 데스크톱용 네비게이션 */}
        <HStack display={{ base: "none", md: "flex" }} gap={2}>
          <CusIconButton
            aria-label="Previous"
            variant="ghost"
            size="sm"
            onClick={handlePrevious}
            icon={<ChevronLeft size={20} />}
          />
          <CusIconButton
            aria-label="Next"
            variant="ghost"
            size="sm"
            onClick={handleNext}
            icon={<ChevronRight size={20} />}
          />
        </HStack>
      </HStack>
      
      <Box position="relative">
        {/* 메인 캐러셀 컨테이너 */}
        <Box
          position="relative"
          borderRadius="2xl"
          overflow="hidden"
          boxShadow="xl"
          h={{ base: "96", md: "80" }}
        >
          {/* 슬라이드 래퍼 */}
          <Box
            display="flex"
            transition="transform 0.5s ease-in-out"
            transform={`translateX(-${currentIndex * 100}%)`}
            h="full"
          >
            {featuredDocs.map((doc) => {
              const imageUrl = doc.featuredInfo?.featuredImageUrl || doc.thumbnailImgUrl;
              const hasImage = imageUrl && imageUrl !== '';
              const gradientFrom = doc.featuredInfo?.featuredGradientFrom || '#6366F1';
              const gradientTo = doc.featuredInfo?.featuredGradientTo || '#9333EA';
              
              return (
                <Box
                  key={doc.id}
                  minW="full"
                  h="full"
                  position="relative"
                  cursor="pointer"
                  onClick={() => navigate(`/blog/view/${doc.id}`)}
                >
                  {/* 배경 레이어 */}
                  <Box
                    position="absolute"
                    inset="0"
                    bg={!hasImage ? `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` : undefined}
                    bgImage={hasImage ? `url(${imageUrl})` : undefined}
                    bgSize="cover"
                    bgPos="center"
                    bgRepeat="no-repeat"
                  >
                    {/* 오버레이 - 이미지가 있을 때만 */}
                    {hasImage && (
                      <Box
                        position="absolute"
                        inset="0"
                        bg="linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.8) 100%)"
                      />
                    )}
                  </Box>
                  
                  {/* 콘텐츠 */}
                  <VStack
                    position="absolute"
                    bottom="0"
                    left="0"
                    right="0"
                    p={{ base: 6, md: 8 }}
                    align="flex-start"
                    gap={3}
                    color="white"
                  >
                    {/* 위치 정보 */}
                    {doc.featuredInfo?.location && (
                      <HStack gap={2} opacity={0.9}>
                        <MapPin size={16} />
                        <Text fontSize="sm" fontWeight="medium">
                          {doc.featuredInfo.location}
                        </Text>
                      </HStack>
                    )}
                    
                    {/* 제목 */}
                    <Text
                      fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                      fontWeight="bold"
                      lineHeight="shorter"
                      textShadow="0 2px 4px rgba(0,0,0,0.4)"
                    >
                      {doc.featuredInfo?.featuredTitle || doc.title}
                    </Text>
                    
                    {/* 부제목 */}
                    {doc.featuredInfo?.featuredSubtitle && (
                      <Text
                        fontSize={{ base: "md", md: "lg" }}
                        opacity={0.95}
                        display={{ base: "none", sm: "block" }}
                        maxW="2xl"
                        textShadow="0 1px 2px rgba(0,0,0,0.3)"
                      >
                        {doc.featuredInfo.featuredSubtitle}
                      </Text>
                    )}
                    
                    {/* 하이라이트 태그 */}
                    {doc.featuredInfo?.highlights && doc.featuredInfo.highlights.length > 0 && (
                      <HStack
                        gap={2}
                        display={{ base: "none", md: "flex" }}
                        flexWrap="wrap"
                      >
                        {doc.featuredInfo.highlights.slice(0, 3).map((highlight, idx) => (
                          <Box
                            key={idx}
                            px={3}
                            py={1}
                            bg="whiteAlpha.200"
                            borderRadius="full"
                            backdropFilter="blur(10px)"
                            border="1px solid"
                            borderColor="whiteAlpha.300"
                          >
                            <Text fontSize="sm" fontWeight="medium">
                              {highlight}
                            </Text>
                          </Box>
                        ))}
                      </HStack>
                    )}
                    
                    {/* CTA 버튼 */}
                    <Box onClick={(e) => e.stopPropagation()}>
                      <CusButton
                        variant="solid"
                        bg="white"
                        color="gray.900"
                        borderRadius="full"
                        size={{ base: "md", md: "lg" }}
                        _hover={{
                          bg: "gray.100",
                          transform: "translateX(4px)"
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/blog/view/${doc.id}`);
                        }}
                        rightIcon={<ChevronRight size={20} />}
                      >
                        {doc.featuredInfo?.ctaButtonText || '자세히 보기'}
                      </CusButton>
                    </Box>
                  </VStack>
                </Box>
              );
            })}
          </Box>
          
          {/* 모바일용 좌우 네비게이션 버튼 */}
          <CusIconButton
            aria-label="Previous slide"
            position="absolute"
            left={{ base: 2, md: 4 }}
            top="50%"
            transform="translateY(-50%)"
            variant="ghost"
            bg="blackAlpha.400"
            color="white"
            backdropFilter="blur(10px)"
            borderRadius="full"
            size={{ base: "sm", md: "md" }}
            onClick={handlePrevious}
            display={{ base: "flex", md: "none" }}
            _hover={{ bg: "blackAlpha.600" }}
            icon={<ChevronLeft size={20} />}
          />
          
          <CusIconButton
            aria-label="Next slide"
            position="absolute"
            right={{ base: 2, md: 4 }}
            top="50%"
            transform="translateY(-50%)"
            variant="ghost"
            bg="blackAlpha.400"
            color="white"
            backdropFilter="blur(10px)"
            borderRadius="full"
            size={{ base: "sm", md: "md" }}
            onClick={handleNext}
            display={{ base: "flex", md: "none" }}
            _hover={{ bg: "blackAlpha.600" }}
            icon={<ChevronRight size={20} />}
          />
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
              bg={index === currentIndex ? "purple.500" : "gray.300"}
              transition="all 0.3s"
              onClick={() => handleDotClick(index)}
              _hover={{ bg: index === currentIndex ? "purple.600" : "gray.400" }}
            />
          ))}
        </HStack>
        
        {/* 썸네일 미리보기 (데스크톱 전용) */}
        <HStack
          gap={4}
          mt={6}
          display={{ base: "none", lg: "flex" }}
          justify="center"
        >
          {featuredDocs.map((doc, index) => {
            const thumbUrl = doc.featuredInfo?.featuredImageUrl || doc.thumbnailImgUrl;
            const hasThumb = thumbUrl && thumbUrl !== '';
            const gradFrom = doc.featuredInfo?.featuredGradientFrom || '#6366F1';
            const gradTo = doc.featuredInfo?.featuredGradientTo || '#9333EA';
            
            return (
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
                boxShadow={index === currentIndex ? "lg" : "md"}
              >
                {/* 썸네일 배경 */}
                <Box
                  w="full"
                  h="full"
                  bg={!hasThumb ? `linear-gradient(135deg, ${gradFrom}, ${gradTo})` : undefined}
                  bgImage={hasThumb ? `url(${thumbUrl})` : undefined}
                  bgSize="cover"
                  bgPos="center"
                />
                
                {/* 오버레이 */}
                <Box
                  position="absolute"
                  inset="0"
                  bg="linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.7) 100%)"
                />
                
                {/* 제목 */}
                <Box
                  position="absolute"
                  bottom="2"
                  left="2"
                  right="2"
                  color="white"
                >
                  <Text
                    fontSize="xs"
                    fontWeight="bold"
                    textShadow="0 1px 2px rgba(0,0,0,0.5)"
                  >
                    {doc.featuredInfo?.featuredTitle || doc.title}
                  </Text>
                </Box>
                
                {/* 현재 선택 인디케이터 */}
                {index === currentIndex && (
                  <Box
                    position="absolute"
                    bottom="0"
                    left="0"
                    right="0"
                    h="1"
                    bg="purple.500"
                  />
                )}
              </Box>
            );
          })}
        </HStack>
      </Box>
    </Container>
  );
}

export default FeaturedCarousel;