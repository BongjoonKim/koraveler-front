import React from 'react';
import { useNavigate } from "react-router-dom";
import { useFeaturedDocuments } from "../../../../../hooks/useFeaturedQueries";
import { Box, Container, Stack, Text, HStack, VStack } from "@chakra-ui/react";
import { ChevronRight, MapPin } from "lucide-react";
import CusButton from "../../../../../common/elements/buttons/CusButton";
import FeaturedCarousel from "./FeaturedCarousel";
import FeaturedCarouselWithSwiper from "./FeatureCarouselWithSwipe";
import { useAtomValue } from "jotai";
import { preferredLocaleAtom, resolveLocale } from "../../../../../stores/jotai/localeAtom";
import { useCurrentUser } from "../../../../../hooks/useCurrentUser";

function FeaturedSection() {
  const navigate = useNavigate();
  const { data: featuredDocs, isLoading } = useFeaturedDocuments();
  const preferredLocale = useAtomValue(preferredLocaleAtom);
  const { data: currentUser } = useCurrentUser();
  const activeLocale = resolveLocale(null, preferredLocale, !!currentUser?.id);
  if (isLoading || !featuredDocs?.length) return null;
  
  console.log("featureDocs", featuredDocs)
  
  // 단일 Featured일 때와 여러 개일 때 다르게 렌더링
  if (featuredDocs.length === 1) {
    const featured = featuredDocs[0];
    const { featuredInfo } = featured;
    
    // 배경 이미지 URL 처리
    const backgroundImageUrl = featuredInfo?.featuredImageUrl;
    const hasBackgroundImage = backgroundImageUrl && backgroundImageUrl !== '';
    
    // 그라디언트 색상 설정
    const gradientFrom = featuredInfo?.featuredGradientFrom || '#6366F1'; // indigo.500
    const gradientTo = featuredInfo?.featuredGradientTo || '#9333EA'; // purple.600
    
    return (
      <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }} mt={12}>
        <Text fontSize="2xl" fontWeight="bold" mb={6} color="gray.900">
          Featured This Month
        </Text>
        
        <Box
          position="relative"
          borderRadius="2xl"
          overflow="hidden"
          boxShadow="lg"
          h={{ base: "sm", md: "md", lg: "80" }}
          cursor="pointer"
          onClick={() => navigate(`/blog/view/${activeLocale}/${featured.id}`)}
          _hover={{ transform: "scale(1.02)", transition: "transform 0.3s" }}
        >
          {/* 배경 레이어 - 그라디언트 또는 이미지 */}
          <Box
            position="absolute"
            inset="0"
            bg={!hasBackgroundImage ? `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` : undefined}
            bgImage={hasBackgroundImage ? `url(${backgroundImageUrl})` : undefined}
            bgSize="cover"
            bgPos="center"
            bgRepeat="no-repeat"
          >
            {/* 이미지가 있을 때만 오버레이 적용 */}
            {hasBackgroundImage && (
              <Box
                position="absolute"
                inset="0"
                bg="linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 100%)"
              />
            )}
          </Box>
          
          {/* 콘텐츠 레이어 */}
          <VStack
            position="absolute"
            bottom="0"
            left="0"
            right="0"
            p={{ base: 6, md: 8 }}
            align="flex-start"
            gap={4}
            color="white"
          >
            {/* 위치 정보 */}
            {featuredInfo?.location && (
              <HStack gap={2} opacity={0.9}>
                <MapPin size={16} />
                <Text fontSize="sm" fontWeight="medium">
                  {featuredInfo.location}
                </Text>
              </HStack>
            )}
            
            {/* 제목 */}
            <VStack align="flex-start" gap={2}>
              <Text
                fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                fontWeight="bold"
                lineHeight="shorter"
                textShadow="0 2px 4px rgba(0,0,0,0.3)"
              >
                {featuredInfo?.featuredTitle || featured.title}
              </Text>
              
              {/* 부제목 */}
              {featuredInfo?.featuredSubtitle && (
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  opacity={0.95}
                  maxW="2xl"
                >
                  {featuredInfo.featuredSubtitle}
                </Text>
              )}
            </VStack>
            
            {/* 하이라이트 태그 */}
            {featuredInfo?.highlights && featuredInfo.highlights.length > 0 && (
              <HStack gap={2} flexWrap="wrap">
                {featuredInfo.highlights.map((highlight, idx) => (
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
                colorScheme="white"
                bg="white"
                color="gray.900"
                borderRadius="full"
                size="lg"
                _hover={{
                  bg: "gray.100",
                  transform: "translateX(4px)"
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/blog/view/${activeLocale}/${featured.id}`);
                }}
                rightIcon={<ChevronRight size={20} />}
              >
                {featuredInfo?.ctaButtonText || '자세히 보기'}
              </CusButton>
            </Box>
          </VStack>
          
          {/* 디버그용: 이미지가 없을 때 표시 (개발 중에만 사용) */}
          {/*{!hasBackgroundImage && process.env.NODE_ENV === 'development' && (*/}
          {/*  <Box*/}
          {/*    position="absolute"*/}
          {/*    top="4"*/}
          {/*    right="4"*/}
          {/*    px={2}*/}
          {/*    py={1}*/}
          {/*    bg="blackAlpha.600"*/}
          {/*    borderRadius="md"*/}
          {/*    fontSize="xs"*/}
          {/*    color="white"*/}
          {/*  >*/}
          {/*    No Image*/}
          {/*  </Box>*/}
          {/*)}*/}
        </Box>
      </Container>
    );
  }
  
  // 여러 개일 때는 캐러셀로 표시
  return <FeaturedCarouselWithSwiper featuredDocs={featuredDocs} />;
}

export default FeaturedSection;