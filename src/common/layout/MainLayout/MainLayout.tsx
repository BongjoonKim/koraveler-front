import React, { ReactNode } from "react";
import HeaderLayout from "./HeaderLayout";
import { Box, Text } from "@chakra-ui/react";
import HeroSection from "./HeroSection";
import { Outlet, useLocation } from "react-router-dom";


export interface MainLayoutProps {
  children?: ReactNode;
  showHero?: boolean; // 홈페이지에서만 true
}

// 라우트별 페이지 톤. HeaderLayout 의 resolveHeaderVariant 와 일치시켜야 함.
const DARK_ROUTE_PREFIXES = ["/blog", "/travel"];

function resolvePageBg(pathname: string): string {
  // 홈("/")도 다크 세이지-그린 에디토리얼 테마
  if (pathname === "/" || pathname === "/home") return "#0a0b0a";
  return DARK_ROUTE_PREFIXES.some((p) => pathname.startsWith(p))
    ? "#0a0c0c"
    : "white";
}

function MainLayout({ children, showHero = false }: MainLayoutProps) {
  const { pathname } = useLocation();
  const pageBg = resolvePageBg(pathname);

  return (
    // h=100vh 로 고정하면 컨텐츠가 viewport 보다 길어졌을 때 bg 가 끊기고
    // 그 아래 html 흰 배경이 비친다. minH 로 바꿔서 컨텐츠 따라 자라게.
    <Box minH="100vh" display={"flex"} flexDirection={"column"} bg={pageBg}>
      <HeaderLayout />
      {showHero && <HeroSection />}
      <Box flex={1} display="flex" flexDirection="column">
        {children ?? <Outlet/>}
      </Box>
    </Box>
  );
}

export default MainLayout;