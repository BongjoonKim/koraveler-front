import React, { ReactNode } from "react";
import HeaderLayout from "./HeaderLayout";
import { Box, Text } from "@chakra-ui/react";
import HeroSection from "./HeroSection";

export interface MainLayoutProps {
  children: ReactNode;
  showHero?: boolean; // 홈페이지에서만 true
}

function MainLayout({ children, showHero = false }: MainLayoutProps) {
  return (
    <Box minH="100vh" bg="gray.50">
      <HeaderLayout />
      {showHero && <HeroSection />}
      <Box as="main" flex="1">
        {children}
      </Box>
    </Box>
  );
}

export default MainLayout;