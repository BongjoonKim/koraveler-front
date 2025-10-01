import React from "react";
import { HStack, Text, Box, Stack } from "@chakra-ui/react";
import { MessageCircle } from "lucide-react";
import useLeftHeader from "./useLeftHeader";
import posthog from 'posthog-js';
import {Link, useLocation} from "react-router-dom";

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
      <Link to="/home">
          <Text
            textStyle="2xl"
            fontWeight="bold"
            color="indigo.600"
            cursor="pointer"
            _hover={{ color: "indigo.700" }}
            css={{ transition: "color 0.2s" }}
          >
            Koraveler
          </Text>
      </Link>
      
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
