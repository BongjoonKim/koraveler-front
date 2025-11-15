import React, { useState } from 'react';
import {
  Container,
  Tabs,
  Box,
  Heading,
  Text,
  Spinner,
  Badge,
  HStack,
  VStack
} from '@chakra-ui/react';
import {
  Sparkles,
  Clock,
  FileText,
  History as HistoryIcon
} from 'lucide-react';
import ActiveFeaturedList from './components/ActiveFeaturedList';
import FeaturedHistory from './components/FeaturedHistory';
import { useFeaturedDocuments } from '../../../../hooks/useFeaturedQueries';
import FeaturableDocuments from "./components/FeaturableDocuments";

interface FeatureAdminDashboardProps {}

const FeatureAdminDashboard: React.FC<FeatureAdminDashboardProps> = () => {
  const [selectedTab, setSelectedTab] = useState('active');
  const { data: activeFeatured, isLoading: isLoadingActive } = useFeaturedDocuments(10);
  
  // 예약된 컨텐츠 수 계산
  const scheduledCount = activeFeatured?.filter(d =>
    d.featuredSchedule?.startDate &&
    new Date(d.featuredSchedule.startDate) > new Date()
  ).length || 0;
  
  return (
    <Container maxW="7xl" py={6}>
      {/* Header Section */}
      <VStack align="stretch" gap={6} mb={8}>
        <HStack justify="space-between" align="start">
          <Box>
            <Heading size="xl" color="gray.900" mb={2}>
              Featured Content Manager
            </Heading>
            <Text color="gray.600" fontSize="md">
              관리자 페이지에서 홈페이지에 표시할 Featured 콘텐츠를 관리합니다
            </Text>
          </Box>
          <Badge
            variant="subtle"
            colorPalette="purple"
            px={3}
            py={1}
            fontSize="sm"
            borderRadius="md"
          >
            {isLoadingActive ? (
              <HStack gap={2}>
                <Spinner size="xs" />
                <Text>Loading...</Text>
              </HStack>
            ) : (
              `${activeFeatured?.length || 0} Active`
            )}
          </Badge>
        </HStack>
        
        {/* Stats Cards */}
        <HStack gap={4} w="full">
          <Box
            flex={1}
            bg="gradient.to-br"
            bgGradient="to-br"
            gradientFrom="purple.50"
            gradientTo="purple.100"
            borderRadius="lg"
            p={4}
          >
            <HStack justify="space-between" align="center">
              <VStack align="start" gap={1}>
                <Text
                  color="purple.600"
                  fontWeight="semibold"
                  fontSize="sm"
                >
                  현재 활성
                </Text>
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  color="purple.900"
                >
                  {activeFeatured?.length || 0}
                </Text>
              </VStack>
              <Box color="purple.500">
                <Sparkles size={24} />
              </Box>
            </HStack>
          </Box>
          
          <Box
            flex={1}
            bg="gradient.to-br"
            bgGradient="to-br"
            gradientFrom="blue.50"
            gradientTo="blue.100"
            borderRadius="lg"
            p={4}
          >
            <HStack justify="space-between" align="center">
              <VStack align="start" gap={1}>
                <Text
                  color="blue.600"
                  fontWeight="semibold"
                  fontSize="sm"
                >
                  예약됨
                </Text>
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  color="blue.900"
                >
                  {scheduledCount}
                </Text>
              </VStack>
              <Box color="blue.500">
                <Clock size={24} />
              </Box>
            </HStack>
          </Box>
        </HStack>
      </VStack>
      
      {/* Tabs Section */}
      <Tabs.Root
        value={selectedTab}
        onValueChange={(details : any) => setSelectedTab(details.value)}
        w="full"
      >
        <Tabs.List
          borderBottomWidth="1px"
          borderColor="gray.200"
        >
          <Tabs.Trigger
            value="active"
            px={6}
            py={3}
            fontWeight="medium"
            color="gray.600"
            _hover={{ color: "purple.600" }}
            _selected={{
              color: "purple.600",
              borderBottomWidth: "2px",
              borderBottomColor: "purple.600"
            }}
            display="flex"
            alignItems="center"
            gap={2}
          >
            <Sparkles size={16} />
            활성 Featured
          </Tabs.Trigger>
          
          <Tabs.Trigger
            value="documents"
            px={6}
            py={3}
            fontWeight="medium"
            color="gray.600"
            _hover={{ color: "purple.600" }}
            _selected={{
              color: "purple.600",
              borderBottomWidth: "2px",
              borderBottomColor: "purple.600"
            }}
            display="flex"
            alignItems="center"
            gap={2}
          >
            <FileText size={16} />
            문서 목록
          </Tabs.Trigger>
          
          <Tabs.Trigger
            value="history"
            px={6}
            py={3}
            fontWeight="medium"
            color="gray.600"
            _hover={{ color: "purple.600" }}
            _selected={{
              color: "purple.600",
              borderBottomWidth: "2px",
              borderBottomColor: "purple.600"
            }}
            display="flex"
            alignItems="center"
            gap={2}
          >
            <HistoryIcon size={16} />
            히스토리
          </Tabs.Trigger>
        </Tabs.List>
        
        <Box mt={6}>
          <Tabs.Content value="active">
            <ActiveFeaturedList />
          </Tabs.Content>
          
          <Tabs.Content value="documents">
            <FeaturableDocuments />
          </Tabs.Content>
          
          <Tabs.Content value="history">
            <FeaturedHistory />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Container>
  );
};

export default FeatureAdminDashboard;