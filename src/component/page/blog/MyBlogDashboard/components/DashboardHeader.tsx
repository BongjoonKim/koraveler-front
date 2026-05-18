import { Box, Text } from "@chakra-ui/react";

interface DashboardHeaderProps {
  userName: string;
  summary: string;
}

function DashboardHeader({ userName, summary }: DashboardHeaderProps) {
  return (
    <Box mb={"2rem"}>
      <Text
        fontSize={"11px"}
        letterSpacing={"2px"}
        textTransform={"uppercase"}
        color={"rgba(255,255,255,0.45)"}
        mb={"0.75rem"}
      >
        Your Workspace
      </Text>
      <Text
        as={"h1"}
        fontSize={"26px"}
        fontWeight={500}
        fontFamily={'"Source Serif Pro", "Noto Serif KR", Georgia, serif'}
        lineHeight={1.2}
        color={"rgba(255,255,255,0.95)"}
        mb={"0.5rem"}
      >
        Welcome back, {userName}
      </Text>
      <Text fontSize={"13px"} color={"rgba(255,255,255,0.45)"}>
        {summary}
      </Text>
    </Box>
  );
}

export default DashboardHeader;
