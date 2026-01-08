import React, { ReactNode } from "react";
import { Box, Text } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

export interface EmptyLayoutProps {
  children?: ReactNode;
}

function EmptyLayout({ children }: EmptyLayoutProps) {
  return (
    <Box h="100vh" display={"flex"} flexDirection={"column"} >
      <Box flex={1} display="flex" flexDirection="column" minH={0}>
        {children ?? <Outlet />}
      </Box>
    </Box>
  );
}

export default EmptyLayout;