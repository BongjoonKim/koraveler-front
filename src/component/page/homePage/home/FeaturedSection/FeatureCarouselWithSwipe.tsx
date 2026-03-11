// src/components/home/FeaturedSection/FeaturedCarouselWithSwiper.tsx
import React from 'react';
import { Box, Container, Text, HStack, VStack } from "@chakra-ui/react";
import { ChevronRight, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CusButton from "../../../../../common/elements/buttons/CusButton";
import styled from "styled-components";
import { useAtomValue } from "jotai";
import { preferredLocaleAtom, resolveLocale } from "../../../../../stores/jotai/localeAtom";
import { useCurrentUser } from "../../../../../hooks/useCurrentUser";

// Swiper 관련 imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade, Thumbs } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// Swiper 스타일 import
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/thumbs';

interface FeaturedCarouselProps {
  featuredDocs: DocumentDTO[];
}

// Styled Components로 Swiper 스타일 정의
const StyledSwiperContainer = styled.div`
    & .swiper-button-prev,
    & .swiper-button-next {
        color: white;
        border-radius: 50%;
        width: 1.5rem;
        height: 1.5rem;

        &::after {
            font-size: 20px;
            font-weight: bold;
        }
    }

    //& .swiper-pagination-bullet {
    //    //background: rgba(255, 255, 255, 0.6);
    //    width: 1rem;
    //    height: 1rem;
    //
    //    &.swiper-pagination-bullet-active {
    //        background: white;
    //        width: 2rem;
    //        border-radius: 9999px;
    //    }
    //}

    //& .swiper-pagination {
    //    bottom: 80px;
    //}
`;

const StyledThumbsContainer = styled.div`
    & .swiper-slide {
        opacity: 0.6;
        transition: opacity 0.3s;
        cursor: pointer;

        &:hover {
            opacity: 1;
        }

        &.swiper-slide-thumb-active {
            opacity: 1;
            transform: scale(1.05);
        }
    }
`;

function FeaturedCarouselWithSwiper({ featuredDocs }: FeaturedCarouselProps) {
  const navigate = useNavigate();
  const [thumbsSwiper, setThumbsSwiper] = React.useState<SwiperType | null>(null);
  const preferredLocale = useAtomValue(preferredLocaleAtom);
  const { data: currentUser } = useCurrentUser();
  const activeLocale = resolveLocale(null, preferredLocale, !!currentUser?.id);
  
  return (
    <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }} mt={12}>
      <Text fontSize="2xl" fontWeight="bold" mb={6} color="gray.900">
        Featured This Month
      </Text>
      
      {/* 메인 Swiper */}
      <StyledSwiperContainer>
        <Box
          borderRadius="2xl"
          overflow="hidden"
          boxShadow="xl"
          position="relative"
        >
          <Swiper
            spaceBetween={0}
            slidesPerView={1}
            navigation={true}
            pagination={{
              clickable: true,
              dynamicBullets: true
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            effect="slide"
            speed={600}
            loop={featuredDocs.length > 1}
            grabCursor={true}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            modules={[Navigation, Pagination, Autoplay, EffectFade, Thumbs]}
            className="featured-main-swiper"
          >
            {featuredDocs.map((doc) => {
              const imageUrl = doc.featuredInfo?.featuredImageUrl || doc.thumbnailImgUrl;
              const hasImage = imageUrl && imageUrl !== '';
              const gradientFrom = doc.featuredInfo?.featuredGradientFrom || '#6366F1';
              const gradientTo = doc.featuredInfo?.featuredGradientTo || '#9333EA';
              
              return (
                <SwiperSlide key={doc.id}>
                  <Box
                    h={{ base: "96", md: "80" }}
                    position="relative"
                    cursor="pointer"
                    onClick={() => navigate(`/blog/view/${activeLocale}/${doc.id}`)}
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
                      zIndex={1}
                    >
                      {doc.featuredInfo?.location && (
                        <HStack gap={2} opacity={0.9}>
                          <MapPin size={16} />
                          <Text fontSize="sm" fontWeight="medium">
                            {doc.featuredInfo.location}
                          </Text>
                        </HStack>
                      )}
                      
                      <Text
                        fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                        fontWeight="bold"
                        lineHeight="shorter"
                        textShadow="0 2px 4px rgba(0,0,0,0.4)"
                      >
                        {doc.featuredInfo?.featuredTitle || doc.title}
                      </Text>
                      
                      {doc.featuredInfo?.featuredSubtitle && (
                        <Text
                          fontSize={{ base: "md", md: "lg" }}
                          opacity={0.95}
                          maxW="2xl"
                          textShadow="0 1px 2px rgba(0,0,0,0.3)"
                        >
                          {doc.featuredInfo.featuredSubtitle}
                        </Text>
                      )}
                      
                      {doc.featuredInfo?.highlights && doc.featuredInfo.highlights.length > 0 && (
                        <HStack gap={2} flexWrap="wrap">
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
                      
                      {/* CusButton에서 rightIcon 제거 */}
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
                            navigate(`/blog/view/${activeLocale}/${doc.id}`);
                          }}
                        >
                          <HStack gap={1}>
                            <span>{doc.featuredInfo?.ctaButtonText || '자세히 보기'}</span>
                            <ChevronRight size={20} />
                          </HStack>
                        </CusButton>
                      </Box>
                    </VStack>
                  </Box>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </Box>
      </StyledSwiperContainer>
      
      {/* 썸네일 Swiper (데스크톱 전용) */}
      {featuredDocs.length > 1 && (
        <StyledThumbsContainer>
          <Box
            mt={6}
            display={{ base: "none", lg: "block" }}
          >
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={16}
              slidesPerView={4}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[Thumbs]}
              className="featured-thumbs-swiper"
            >
              {featuredDocs.map((doc) => {
                const thumbUrl = doc.featuredInfo?.featuredImageUrl || doc.thumbnailImgUrl;
                const hasThumb = thumbUrl && thumbUrl !== '';
                const gradFrom = doc.featuredInfo?.featuredGradientFrom || '#6366F1';
                const gradTo = doc.featuredInfo?.featuredGradientTo || '#9333EA';
                
                return (
                  <SwiperSlide key={doc.id}>
                    <Box
                      position="relative"
                      h="100px"
                      borderRadius="lg"
                      overflow="hidden"
                      boxShadow="md"
                    >
                      <Box
                        w="full"
                        h="full"
                        bg={!hasThumb ? `linear-gradient(135deg, ${gradFrom}, ${gradTo})` : undefined}
                        bgImage={hasThumb ? `url(${thumbUrl})` : undefined}
                        bgSize="cover"
                        bgPos="center"
                      />
                      
                      <Box
                        position="absolute"
                        inset="0"
                        bg="linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.7) 100%)"
                      />
                      
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
                          lineClamp={2}
                          textShadow="0 1px 2px rgba(0,0,0,0.5)"
                        >
                          {doc.featuredInfo?.featuredTitle || doc.title}
                        </Text>
                      </Box>
                    </Box>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </Box>
        </StyledThumbsContainer>
      )}
    </Container>
  );
}

export default FeaturedCarouselWithSwiper;