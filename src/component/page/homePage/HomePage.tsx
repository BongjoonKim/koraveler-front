import React from "react";
import { Box, Container, Grid, Text, Button, Card, Stack, IconButton } from "@chakra-ui/react";
import {
  Cloud, DollarSign, Phone, MapPin, Bus, Hotel,
  Utensils, Camera, Lightbulb, MessageCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useCusWeather from "../../../common/widget/CusWeather/useCusWeather";
import CusWeather from "../../../common/widget/CusWeather";
import LanguageHelp from "../../../common/widget/LanguageHelp/LanguageHelp";
import FindRoute from "../../../common/widget/FindRoute/FindRoute";

interface QuickAccessItem {
  icon: any;
  label: string;
  color: string;
  path: string;
}

interface InfoCard {
  icon: any;
  bgColor: string;
  iconColor: string;
  label: string;
  value: string;
  subtext: string;
}

function HomePage() {
  const navigate = useNavigate();
  const {weatherData} = useCusWeather();
  console.log("weatherData", weatherData)
  
  const quickAccessItems: QuickAccessItem[] = [
    { icon: Bus, label: 'Transportation', color: 'blue.500', path: '/transportation' },
    { icon: Hotel, label: 'Accommodation', color: 'green.500', path: '/accommodation' },
    { icon: Utensils, label: 'Food & Dining', color: 'orange.500', path: '/food' },
    { icon: Camera, label: 'Tourist Spots', color: 'purple.500', path: '/tourist-spots' },
    { icon: Lightbulb, label: 'Travel Tips', color: 'yellow.500', path: '/tips' },
    { icon: MessageCircle, label: 'Community Chat', color: 'pink.500', path: '/chat' },
  ];
  return (
    <>
      {/* Today's Info Cards */}
      <Box maxW="7xl" mx="auto" px={{ base: 4, sm: 6, lg: 8 }} py={6}>
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          gap={4}
        >
          <CusWeather />
          <LanguageHelp />
          <FindRoute />
        </Grid>
      </Box>
      
      {/* Featured Destination */}
      <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }} mt={12}>
        <Text textStyle="2xl" fontWeight="bold" mb={6}>Featured This Month</Text>
        <Box
          position="relative"
          borderRadius="2xl"
          overflow="hidden"
          shadow="lg"
          h="80"
          bgGradient="to-r"
          gradientFrom="indigo.400"
          gradientTo="purple.600"
        >
          <Box
            position="absolute"
            inset="0"
            bgGradient="to-t"
            gradientFrom="black/70"
            gradientTo="transparent"
          />
          <Box position="absolute" bottom="0" left="0" right="0" p={8} color="white">
            <Stack direction="row" align="center" gap={2} mb={2}>
              <MapPin size={20} />
              <Text textStyle="sm">Seoul</Text>
            </Stack>
            <Text textStyle="3xl" fontWeight="bold" mb={2}>Gyeongbokgung Palace</Text>
            <Text textStyle="lg" mb={4}>Experience the grandeur of Korean royal history</Text>
            <Button colorPalette="white" variant="solid" borderRadius="full" size="lg">
              Explore More
            </Button>
          </Box>
        </Box>
      </Container>
      
      {/* Quick Access Grid */}
      <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }} mt={12}>
        <Text textStyle="2xl" fontWeight="bold" mb={6}>Quick Access</Text>
        <Grid columns={{ base: 2, md: 3, lg: 6 }} gap={4}>
          {quickAccessItems.map((item, index) => (
            <Card.Root
              key={index}
              bg="white"
              shadow="md"
              _hover={{ shadow: "xl", transform: "translateY(-4px)" }}
              cursor="pointer"
              css={{ transition: "all 0.3s" }}
              onClick={() => navigate(item.path)}
            >
              <Card.Body>
                <Stack align="center" gap={3}>
                  <Box bg={item.color} p={4} borderRadius="full">
                    <item.icon size={28} color="white" />
                  </Box>
                  <Text textStyle="sm" fontWeight="semibold" color="gray.700" textAlign="center">
                    {item.label}
                  </Text>
                </Stack>
              </Card.Body>
            </Card.Root>
          ))}
        </Grid>
      </Container>
      
      {/* Floating Chat Button */}
      <IconButton
        aria-label="Open chat"
        position="fixed"
        bottom={8}
        right={8}
        bgGradient="to-r"
        gradientFrom="pink.500"
        gradientTo="purple.500"
        color="white"
        size="lg"
        borderRadius="full"
        shadow="2xl"
        _hover={{ shadow: "3xl", transform: "scale(1.1)" }}
        zIndex={50}
        onClick={() => navigate('/chat')}
      >
        <MessageCircle size={28} />
      </IconButton>
    </>
  );
}

export default HomePage;