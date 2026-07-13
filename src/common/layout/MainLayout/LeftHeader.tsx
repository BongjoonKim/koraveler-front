import React from "react";
import { HStack, Text, Box, Stack } from "@chakra-ui/react";
import useLeftHeader from "./useLeftHeader";
import {Link, useLocation} from "react-router-dom";
import type { HeaderVariant } from "./HeaderLayout";
import {trackMenuClick} from "../../../utils/analytics";

// 시안: 소문자 serif 로고. 다크에선 단색 화이트, 라이트에선 기존 그라데이션 유지.
export function NadelivLogo1({ variant = "light" }: { variant?: HeaderVariant }) {
  const isDark = variant === "dark";
  const location = useLocation();
  const sharedStyle: React.CSSProperties = isDark
    ? { color: "rgba(255,255,255,0.95)" }
    : {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      };

  return (
    <Link
      to="/home"
      onClick={() =>
        trackMenuClick({menuLabel: "logo", menuUrl: "/home", currentPath: location.pathname})
      }
    >
      <Text
        as="span"
        fontSize="28px"
        fontWeight="500"
        fontStyle="italic"
        cursor="pointer"
        letterSpacing="-0.5px"
        fontFamily={`Georgia, "Times New Roman", serif`}
        style={sharedStyle}
        transition="transform 0.2s"
      >
        nadeliv
      </Text>
    </Link>
  );
}

interface LeftHeaderProps {
  variant?: HeaderVariant;
}

function LeftHeader({ variant = "light" }: LeftHeaderProps) {
  const { menus, handleMenuHover } = useLeftHeader();
  const location = useLocation();

  const menuColor = variant === "dark" ? "whiteAlpha.900" : "gray.700";
  const menuHoverColor = variant === "dark" ? "indigo.300" : "indigo.600";

  const handleMenuClick = (menu: MenusDTO) => {
    trackMenuClick({
      menuLabel: menu.label,
      menuUrl: menu.url,
      currentPath: location.pathname,
    });
  };

  return (
    <Stack direction="row" gap={10} align="center">
      {/* Logo */}
      <NadelivLogo1 variant={variant} />

      {/* Navigation Menu - Desktop. 시안: 대문자 + tracking. 데이터는 그대로 두고 표시만 변형. */}
      <Stack direction="row" gap={8} display={{ base: "flex", md: "flex" }}>
        {menus.map((menu: MenusDTO, index: number) => (
          <Link key={menu.id || index} to={menu.url || "#"} onClick={() => handleMenuClick(menu)}>
              <Text
                color={menuColor}
                fontWeight="500"
                fontSize="sm"
                textTransform="uppercase"
                letterSpacing="0.12em"
                _hover={{ color: menuHoverColor }}
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
