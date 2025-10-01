import React, { useState } from "react";
import { Box, Text, Input, IconButton, Container, Flex } from "@chakra-ui/react";
import { Search } from "lucide-react";

function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <Box
      bgGradient="to-r"
      gradientFrom="indigo.500"
      gradientVia="purple.500"
      gradientTo="pink.500"
      color="white"
      py={16}
    >
      <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
        <Box textAlign="center">
          <Text textStyle="4xl" fontWeight="bold" mb={4}>
            Welcome to Korea 🇰🇷
          </Text>
          <Text textStyle="xl" mb={8} opacity={0.9}>
            Your ultimate guide to exploring South Korea
          </Text>
          
          {/* Search Bar - Chakra v3 방식 */}
          <Box maxW="2xl" mx="auto" position="relative">
            <Input
              placeholder="Search destinations, tips, or experiences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              bg="white"
              color="gray.800"
              borderRadius="full"
              size="lg"
              px={6}
              pr={14}
              _placeholder={{ color: "gray.500" }}
            />
            <IconButton
              aria-label="Search"
              borderRadius="full"
              colorPalette="indigo"
              position="absolute"
              right="2"
              top="50%"
              transform="translateY(-50%)"
              size="sm"
            >
              <Search size={20} />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default HeroSection;