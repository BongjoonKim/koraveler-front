import {useNavigate} from "react-router-dom";
import {useFeaturedDocuments} from "../../../../../hooks/useFeaturedQueries";
import {Box, Container, Stack, Text} from "@chakra-ui/react";
import {ChevronRight, MapPin} from "lucide-react";
import CusButton from "../../../../../common/elements/buttons/CusButton";
import FeaturedCarousel from "./FeaturedCarousel";

function FeaturedSection() {
  const navigate = useNavigate()
  const { data: featuredDocs, isLoading } = useFeaturedDocuments();
  
  if (isLoading || !featuredDocs?.length) return null;
  
  // 단일 Featured일 때와 여러 개일 때 다르게 렌더링
  if (featuredDocs.length === 1) {
    const featured = featuredDocs[0];
    const { featuredInfo } = featured;
    
    return (
      <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }} mt={12}>
        <Text textStyle="2xl" fontWeight="bold" mb={6}>Featured This Month</Text>
        <Box
          position="relative"
          borderRadius="2xl"
          overflow="hidden"
          shadow="lg"
          h="80"
          bgImage={`url(${featuredInfo?.featuredImageUrl})`}
          bgSize="cover"
          bgGradient={
            featuredInfo?.featuredGradientFrom && featuredInfo?.featuredGradientTo
              ? `linear(to-r, ${featuredInfo.featuredGradientFrom}, ${featuredInfo.featuredGradientTo})`
              : "linear(to-r, indigo.400, purple.600)"
          }
        >
          <Box
            position="absolute"
            inset="0"
            bgGradient="linear(to-t, black/70, transparent)"
          />
          <Box position="absolute" bottom="0" left="0" right="0" p={8} color="white">
            {featuredInfo?.location && (
              <Stack direction="row" align="center" gap={2} mb={2}>
                <MapPin size={20} />
                <Text textStyle="sm">{featuredInfo.location}</Text>
              </Stack>
            )}
            <Text textStyle="3xl" fontWeight="bold" mb={2}>
              {featuredInfo?.featuredTitle || featured.title}
            </Text>
            <Text textStyle="lg" mb={4}>
              {featuredInfo?.featuredSubtitle}
            </Text>
            
            {featuredInfo?.highlights && (
              <Stack direction="row" gap={2} mb={4}>
                {featuredInfo.highlights.map((highlight, idx) => (
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
              size="lg"
              onClick={() => navigate(`/blog/${featured.id}`)}
            >
              {featuredInfo?.ctaButtonText || 'Explore More'}
              <ChevronRight size={20} />
            </CusButton>
          </Box>
        </Box>
      </Container>
    );
  }
  
  // 여러 개일 때는 캐러셀로 표시
  return <FeaturedCarousel featuredDocs={featuredDocs} />;
  
}

export default FeaturedSection;