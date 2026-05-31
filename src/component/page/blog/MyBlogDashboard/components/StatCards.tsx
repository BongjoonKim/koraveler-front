import { Box, Grid, Text } from "@chakra-ui/react";
import type { DashboardStat } from "../useMyBlogDashboard";

interface StatCardsProps {
  stats: DashboardStat[];
}

function StatCards({ stats }: StatCardsProps) {
  return (
    <Grid
      templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
      gap={"1rem"}
      mb={"2rem"}
    >
      {stats.map((stat) => (
        <Box
          key={stat.key}
          bg={"rgba(255,255,255,0.04)"}
          border={"0.5px solid"}
          borderColor={"rgba(255,255,255,0.08)"}
          borderRadius={"lg"}
          padding={"1rem"}
        >
          <Text
            fontSize={"11px"}
            letterSpacing={"1.5px"}
            textTransform={"uppercase"}
            color={"rgba(255,255,255,0.5)"}
            mb={"0.5rem"}
          >
            {stat.label}
          </Text>
          <Text
            fontSize={"22px"}
            fontWeight={500}
            color={"rgba(255,255,255,0.95)"}
            lineHeight={1.2}
            mb={"0.25rem"}
          >
            {stat.value}
          </Text>
          <Text fontSize={"11px"} color={"rgba(255,255,255,0.35)"}>
            {stat.caption}
          </Text>
        </Box>
      ))}
    </Grid>
  );
}

export default StatCards;
