import React from "react";
import { Box, Container, Grid, Text, Button, Card, Stack, IconButton } from "@chakra-ui/react";
import {
  Cloud, DollarSign, Phone, MapPin, Bus, Hotel,
  Utensils, Camera, Lightbulb, MessageCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    { icon: Bus, label: 'Transportation', color: 'blue.500', path: '/transportation' },
    { icon: Hotel, label: 'Accommodation', color: 'green.500', path: '/accommodation' },
    { icon: Utensils, label: 'Food & Dining', color: 'orange.500', path: '/food' },
    { icon: Camera, label: 'Tourist Spots', color: 'purple.500', path: '/tourist-spots' },
    { icon: Lightbulb, label: 'Travel Tips', color: 'yellow.500', path: '/tips' },
    { icon: MessageCircle, label: 'Community Chat', color: 'pink.500', path: '/chat' },
  ];
  
  const infoCards: InfoCard[] = [
    {
      icon: Cloud,
      bgColor: 'blue.100',
      iconColor: 'blue.600',
      label: "Today's Weather",
      value: '22°C',
      subtext: 'Partly Cloudy'
    },
    {
      icon: DollarSign,
      bgColor: 'green.100',
      iconColor: 'green.600',
      label: 'Exchange Rate',
      value: '1,320₩',
      subtext: 'per 1 USD'
    },
    {
      icon: Phone,
      bgColor: 'red.100',
      iconColor: 'red.600',
      label: 'Emergency',
      value: '112',
      subtext: 'Police / Ambulance'
    }
  ];
  
  return (
    <>
      {/* Today's Info Cards */}
      <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }} mt="-8">
        <Grid columns={{ base: 1, md: 3 }} gap={4}>
          {infoCards.map((card, index) => (
            <Card.Root key={index} bg="white" shadow="md">
              <Card.Body>
                <Stack direction="row" align="center" gap={4}>
                  <Box bg={card.bgColor} p={3} borderRadius="full">
                    <card.icon size={28} color={card.iconColor} />
                  </Box>
                  <Box>
                    <Text textStyle="sm" color="gray.500">{card.label}</Text>
                    <Text textStyle="2xl" fontWeight="bold">{card.value}</Text>
                    <Text textStyle="sm" color="gray.600">{card.subtext}</Text>
                  </Box>
                </Stack>
              </Card.Body>
            </Card.Root>
          ))}
        </Grid>
      </Container>
      
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