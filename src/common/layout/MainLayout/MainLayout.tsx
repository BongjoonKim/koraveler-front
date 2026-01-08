import React, { ReactNode } from "react";
import HeaderLayout from "./HeaderLayout";
import { Box, Text } from "@chakra-ui/react";
import HeroSection from "./HeroSection";
import { Outlet } from "react-router-dom";


export interface MainLayoutProps {
  children?: ReactNode;
  showHero?: boolean; // 홈페이지에서만 true
}

function MainLayout({ children, showHero = false }: MainLayoutProps) {
  return (
    <Box h="100vh" display={"flex"} flexDirection={"column"} >
      <HeaderLayout />
      {showHero && <HeroSection />}
      <Box flex={1} display="flex" flexDirection="column" minH={0}>
        {children ?? <Outlet/>}
      </Box>
    </Box>
  );
}

export default MainLayout;