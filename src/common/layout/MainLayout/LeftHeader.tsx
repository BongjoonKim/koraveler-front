import React from "react";
import { HStack, Text, Box, Stack } from "@chakra-ui/react";
import useLeftHeader from "./useLeftHeader";
import posthog from 'posthog-js';
import {Link, useLocation} from "react-router-dom";

// Option 1: 그라데이션 텍스트 로고
export function KoravelerLogo1() {
  return (
      <Link to="/home">
        <Text
          fontSize="28px"
          fontWeight="800"
          cursor="pointer"
          letterSpacing="-0.5px"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
          transition="transform 0.2s"
        >
          Koraveler
        </Text>
      </Link>
  );
}

function LeftHeader() {
  const { menus, handleMenuHover } = useLeftHeader();
  const location = useLocation();
  
  const handleMenuClick = (menu: MenusDTO) => {
    posthog.capture('menu_clicked', {
      menu_label: menu.label,
      menu_url: menu.url,
      current_page: location.pathname,
      timestamp: new Date().toISOString()
    });
  };
  
  return (
    <Stack direction="row" gap={8} align="center">
      {/* Logo */}
      <KoravelerLogo1 />
      
      {/* Navigation Menu - Desktop */}
      <Stack direction="row" gap={6} display={{ base: "none", md: "flex" }}>
        {menus.map((menu: MenusDTO, index: number) => (
          <Link key={menu.id || index} to={`${process.env.REACT_APP_URI}${menu.url}`}>
              <Text
                color="gray.700"
                fontWeight="medium"
                _hover={{ color: "indigo.600" }}
                css={{ transition: "color 0.2s" }}
              >
                {menu.label}
              </Text>
          </Link>
        ))}
      </Stack>
    </Stack>
  );
}

export default LeftHeader;
