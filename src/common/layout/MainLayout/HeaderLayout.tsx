import React from "react";
import { Box, Flex, Container } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import LeftHeader from "./LeftHeader";
import RightHeader from "./RightHeader";

function HeaderLayout() {
  
  return (
    <Box
      w={"100%"}
      top="0"
      display="flex"
      justifyContent="center"
    >
      <Box
        as="header"
        bg="white"
        // borderColor="gray.200"
        position="sticky"
        zIndex={"999"}
        maxW="7xl"
        w="100%"  // 추가: 전체 너비 사용
      >
        <Container maxW="7xl" px={{ base: 4, md : 4, lg : 4}}>
          <Flex h="16" align="center" justify="space-between" padding={"0.5rem 0"}>
            <LeftHeader />
            <RightHeader />
          </Flex>
        </Container>
      </Box>
    </Box>
  
  );
}

export default HeaderLayout;