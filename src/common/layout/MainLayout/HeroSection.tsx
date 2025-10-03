// HeroSection.tsx - Chakra UI v3 그라데이션 수정
import React, { useState } from "react";
import { Box, Text, Input, IconButton, Container, Flex } from "@chakra-ui/react";
import { Search } from "lucide-react";

function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <Box
      position="relative"
      color="white"
      py={12}
      overflow="hidden"
      // Chakra v3에서는 style prop 직접 사용
      style={{
        background: 'linear-gradient(to right, #6366f1, #a855f7, #ec4899)'
      }}
    >
      {/* 한국 전통 문양 배경 패턴 */}
      <Box
        position="absolute"
        inset={0}
        opacity={0.15}
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(255,255,255,0.1) 10px,
              rgba(255,255,255,0.1) 20px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 10px,
              rgba(255,255,255,0.1) 10px,
              rgba(255,255,255,0.1) 20px
            )
          `,
        }}
      />
      
      {/* 태극 문양 스타일 장식 요소 */}
      <Box
        position="absolute"
        top="-100px"
        right="-100px"
        width="300px"
        height="300px"
        borderRadius="full"
        opacity={0.2}
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 70%)'
        }}
      />
      
      <Box
        position="absolute"
        bottom="-150px"
        left="-150px"
        width="400px"
        height="400px"
        borderRadius="full"
        opacity={0.15}
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 70%)'
        }}
      />
      
      <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }} position="relative" zIndex={1}>
        <Box textAlign="center">
          <Text
            fontSize={{ base: "3xl", md: "5xl" }}
            fontWeight="bold"
            mb={4}
            style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            Welcome to Korea
          </Text>
          
          <Text
            fontSize={{ base: "lg", md: "xl" }}
            mb={8}
            opacity={0.95}
            maxW="600px"
            mx="auto"
          >
            Your ultimate guide to exploring South Korea
          </Text>
          
          {/* Search Bar */}
          <Box maxW="2xl" mx="auto" position="relative">
            <Input
              placeholder="Search destinations, tips, or experiences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              bg="white"
              color="gray.800"
              borderRadius="full"
              size="lg"
              height="60px"
              px={6}
              pr={16}
              fontSize="md"
              style={{
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
              }}
              _placeholder={{ color: "gray.400" }}
              _focus={{
                outline: "none",
                boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
              }}
            />
            <IconButton
              aria-label="Search"
              borderRadius="full"
              position="absolute"
              right="2"
              top="50%"
              size="lg"
              height="48px"
              width="48px"
              style={{
                transform: 'translateY(-50%)',
                background: '#6366f1',
                color: 'white'
              }}
              _hover={{
                bg: "indigo.700",
                transform: "translateY(-50%) scale(1.05)"
              }}
              transition="all 0.2s"
            >
              <Search size={24} />
            </IconButton>
          </Box>
          
          {/* 한국 관련 태그들 */}
          <Flex
            gap={3}
            justify="center"
            mt={6}
            flexWrap="wrap"
            px={4}
          >
            {['Seoul', 'Busan', 'Jeju', 'K-Culture', 'K-Food'].map((tag) => (
              <Box
                key={tag}
                as="button"
                px={4}
                py={2}
                borderRadius="full"
                fontSize="sm"
                fontWeight="medium"
                transition="all 0.2s"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
                _hover={{
                  bg: "whiteAlpha.300",
                  transform: "translateY(-2px)",
                }}
              >
                {tag}
              </Box>
            ))}
          </Flex>
        </Box>
      </Container>
    </Box>
  );
}

export default HeroSection;

// 대안: 인라인 스타일만 사용하는 버전
export function HeroSectionSimple() {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div
      style={{
        position: 'relative',
        color: 'white',
        padding: '64px 0',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%)',
        minHeight: '400px'
      }}
    >
      {/* 배경 패턴 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: `
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 20px,
              rgba(255,255,255,0.1) 20px,
              rgba(255,255,255,0.1) 21px
            ),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 20px,
              rgba(255,255,255,0.1) 20px,
              rgba(255,255,255,0.1) 21px
            )
          `
        }}
      />
      
      <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }} position="relative" style={{ zIndex: 1 }}>
        <Box textAlign="center">
          <Text
            fontSize="5xl"
            mb={4}
            display="block"
          >
            🇰🇷
          </Text>
          
          <Text
            fontSize={{ base: "3xl", md: "5xl" }}
            fontWeight="bold"
            mb={4}
            style={{
              textShadow: '2px 2px 8px rgba(0,0,0,0.4)'
            }}
          >
            Welcome to Korea
          </Text>
          
          <Text
            fontSize={{ base: "lg", md: "xl" }}
            mb={8}
            style={{ opacity: 0.95 }}
            maxW="600px"
            mx="auto"
          >
            Your ultimate guide to exploring South Korea
          </Text>
          
          {/* 검색창 */}
          <Box
            maxW="2xl"
            mx="auto"
            position="relative"
          >
            <input
              type="text"
              placeholder="Search destinations, tips, or experiences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '20px 24px',
                paddingRight: '70px',
                borderRadius: '50px',
                border: 'none',
                fontSize: '16px',
                backgroundColor: 'white',
                color: '#1a202c',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                outline: 'none'
              }}
            />
            <button
              aria-label="Search"
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: '#6366f1',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#5558dd';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#6366f1';
                e.currentTarget.style.transform = 'translateY(-50%)';
              }}
            >
              <Search size={24} />
            </button>
          </Box>
        </Box>
      </Container>
    </div>
  );
}