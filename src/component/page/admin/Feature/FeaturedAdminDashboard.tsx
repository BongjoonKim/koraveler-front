import React, { useState } from 'react';
import {
  Container,
  Tabs,
  Box,
  Heading,
  Text,
  Spinner,
  Alert,
  Badge,
  HStack
} from '@chakra-ui/react';
import {
  Sparkles,
  Clock,
  FileText,
  History
} from 'lucide-react';
import ActiveFeaturedList from './components/ActiveFeaturedList';
import FeaturedHistory from './components/FeaturedHistory';
import { useFeaturedDocuments } from '../../../../hooks/useFeaturedQueries';
import FeaturableDocuments from "./components/FeaturableDocuments";

interface FeatureAdminDashboardProps {}

const FeatureAdminDashboard: React.FC<FeatureAdminDashboardProps> = () => {
  const [selectedTab, setSelectedTab] = useState('active');
  const { data: activeFeatured, isLoading: isLoadingActive } = useFeaturedDocuments(10);
  
  return (
    <Container className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <Box className="mb-8">
        <HStack className="justify-between items-start mb-4">
          <Box>
            <Heading size="2xl" className="mb-2 text-gray-900">
              Featured Content Manager
            </Heading>
            <Text className="text-gray-600">
              관리자 페이지에서 홈페이지에 표시할 Featured 콘텐츠를 관리합니다
            </Text>
          </Box>
          <Badge
            colorScheme="purple"
            className="px-3 py-1 text-sm"
          >
            {isLoadingActive ? (
              <Spinner size="xs" />
            ) : (
              `${activeFeatured?.length || 0} Active`
            )}
          </Badge>
        </HStack>
        
        {/* Quick Stats */}
        <HStack className="mt-6 gap-4">
          <Box className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 flex-1">
            <HStack className="justify-between">
              <Box>
                <Text className="text-purple-600 font-semibold">현재 활성</Text>
                <Text className="text-2xl font-bold text-purple-900">
                  {activeFeatured?.length || 0}
                </Text>
              </Box>
              <Sparkles className="text-purple-500" size={24} />
            </HStack>
          </Box>
          
          <Box className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 flex-1">
            <HStack className="justify-between">
              <Box>
                <Text className="text-blue-600 font-semibold">예약됨</Text>
                <Text className="text-2xl font-bold text-blue-900">
                  {activeFeatured?.filter(d =>
                    d.featuredSchedule?.startDate &&
                    new Date(d.featuredSchedule.startDate) > new Date()
                  ).length || 0}
                </Text>
              </Box>
              <Clock className="text-blue-500" size={24} />
            </HStack>
          </Box>
        </HStack>
      </Box>
      
      {/* Tabs */}
      <Tabs.Root
        value={selectedTab}
        onValueChange={(e : any) => setSelectedTab(e.value)}
        className="w-full"
      >
        <Tabs.List className="mb-6 border-b border-gray-200">
          <Tabs.Trigger
            value="active"
            className="px-6 py-3 font-medium text-gray-600 hover:text-purple-600
                     data-[selected]:text-purple-600 data-[selected]:border-b-2
                     data-[selected]:border-purple-600 transition-all duration-200
                     flex items-center gap-2"
          >
            <Sparkles size={16} />
            활성 Featured
          </Tabs.Trigger>
          
          <Tabs.Trigger
            value="documents"
            className="px-6 py-3 font-medium text-gray-600 hover:text-purple-600
                     data-[selected]:text-purple-600 data-[selected]:border-b-2
                     data-[selected]:border-purple-600 transition-all duration-200
                     flex items-center gap-2"
          >
            <FileText size={16} />
            문서 목록
          </Tabs.Trigger>
          
          <Tabs.Trigger
            value="history"
            className="px-6 py-3 font-medium text-gray-600 hover:text-purple-600
                     data-[selected]:text-purple-600 data-[selected]:border-b-2
                     data-[selected]:border-purple-600 transition-all duration-200
                     flex items-center gap-2"
          >
            <History size={16} />
            히스토리
          </Tabs.Trigger>
        </Tabs.List>
        
        <Tabs.Content value="active" className="mt-6">
          <ActiveFeaturedList />
        </Tabs.Content>
        
        <Tabs.Content value="documents" className="mt-6">
          <FeaturableDocuments />
        </Tabs.Content>
        
        <Tabs.Content value="history" className="mt-6">
          <FeaturedHistory />
        </Tabs.Content>
      </Tabs.Root>
    </Container>
  );
};

export default FeatureAdminDashboard;