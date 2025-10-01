import React from "react";
import { Box, Flex, Container } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import LeftHeader from "./LeftHeader";
import RightHeader from "./RightHeader";

function HeaderLayout() {
  const location = useLocation();
  
  return (
    <Box
      as="header"
      bg="white"
      borderBottomWidth="1px"
      borderColor="gray.200"
      position="sticky"
      top="0"
      zIndex="50"
      shadow="sm"
    >
      <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
        <Flex h="16" align="center" justify="space-between">
          <LeftHeader />
          <RightHeader />
        </Flex>
      </Container>
    </Box>
  );
}

export default HeaderLayout;