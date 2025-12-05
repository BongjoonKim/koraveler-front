import React from "react";
import { Box, Container, Grid, Text, Button, Card, Stack, IconButton } from "@chakra-ui/react";
import {
  Cloud, DollarSign, Phone, MapPin, Bus, Hotel,
  Utensils, Camera, Lightbulb, MessageCircle, Notebook
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useCusWeather from "../../../common/widget/CusWeather/useCusWeather";
import CusWeather from "../../../common/widget/CusWeather";
import LanguageHelp from "../../../common/widget/LanguageHelp/LanguageHelp";
import FindRoute from "../../../common/widget/FindRoute/FindRoute";
import FeaturedSection from "./home/FeaturedSection/FeaturedSection";

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
  
  const quickAccessItems: QuickAccessItem[] = [
    { icon : Notebook, label : "blog", color: "green.500", path: '/blog/home'},
    { icon: MessageCircle, label: 'Chat', color: 'purple.500', path: '/chat' },
    // { icon: Bus, label: 'Transportation', color: 'blue.500', path: '/transportation' },
    // { icon: Hotel, label: 'Accommodation', color: 'green.500', path: '/accommodation' },
    // { icon: Utensils, label: 'Food & Dining', color: 'orange.500', path: '/food' },
    // { icon: Camera, label: 'Chat', color: 'purple.500', path: '/tourist-spots' },
    // { icon: Lightbulb, label: 'Travel Tips', color: 'yellow.500', path: '/tips' },
    // { icon: MessageCircle, label: 'Community Chat', color: 'pink.500', path: '/chat' },
  ];
  return (
    <>
      {/* Today's Info Cards */}
      <Box maxW="7xl" mx="auto" px={{ base: 4, sm: 6, lg: 8 }} py={6} w={"100%"}>
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(1, 3fr)" }}
          gap={4}
        >
          <CusWeather />
          <LanguageHelp />
          <FindRoute />
        </Grid>
      </Box>
      
      {/* Featured Destination */}
      <FeaturedSection/>
      
      {/* Quick Access Grid */}
      <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }} mt={12} py={3}>
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