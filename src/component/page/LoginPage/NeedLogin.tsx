import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
} from "@chakra-ui/react";
import {
  Lock,
  User,
  LogIn,
  UserPlus,
  Globe,
  MapPin,
  Navigation,
  Star
} from "lucide-react";

interface NeedLoginProps {
  feature?: string;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

const NeedLogin: React.FC<NeedLoginProps> = ({
   feature = "Route Finder",
   onLoginClick,
   onSignupClick
 }) => {
  return (
    <Box
      w="full"
      p={6}
      bg="white"
      borderRadius="lg"
      borderWidth={1}
      borderColor="gray.200"
    >
      <VStack gap={4} align="center" w="full">
        {/* Icon with Lock */}
        <Box
          p={3}
          bg="purple.50"
          borderRadius="full"
          position="relative"
        >
          <Lock size={32} color="#6B46C1" />
        </Box>
        
        {/* Main Message */}
        <VStack gap={1} textAlign="center">
          <Text
            fontSize="lg"
            fontWeight="bold"
            color="gray.800"
          >
            Sign in to use {feature}
          </Text>
          <Text
            fontSize="sm"
            color="gray.600"
          >
            Create your personalized travel experience
          </Text>
        </VStack>
        
        {/* Action Buttons */}
        <VStack gap={2} w="full" maxW="250px">
          <Button
            w="full"
            size="md"
            colorPalette="purple"
            onClick={onLoginClick}
          >
            Sign In
          </Button>
          
          <Button
            w="full"
            size="md"
            variant="outline"
            colorPalette="purple"
            onClick={onSignupClick}
          >
            Sign Up Free
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
};

export default NeedLogin;