import React, { useState } from 'react';
import {
  Tabs,
  Box,
  Text,
  Spinner,
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
import { homeTokens } from '../adminUi';

const t = homeTokens;

interface FeatureAdminDashboardProps {}

// 탭 트리거 공통 스타일 (다크 세이지-그린)
const tabTriggerStyle = {
  px: 5,
  py: 3,
  fontWeight: "medium",
  color: t.color.textMuted,
  _hover: { color: t.color.textSoft },
  _selected: {
    color: t.color.accent,
    borderBottomWidth: "2px",
    borderBottomColor: t.color.accent,
  },
  display: "flex",
  alignItems: "center",
  gap: 2,
} as const;

const FeatureAdminDashboard: React.FC<FeatureAdminDashboardProps> = () => {
  const [selectedTab, setSelectedTab] = useState('active');
  const { data: activeFeatured, isLoading: isLoadingActive } = useFeaturedDocuments(10);

  // 예약된 컨텐츠 수 계산
  const scheduledCount = activeFeatured?.filter(d =>
    d.featuredSchedule?.startDate &&
    new Date(d.featuredSchedule.startDate) > new Date()
  ).length || 0;

  return (
    <Box w="full">
      {/* Stats Cards */}
      <HStack gap={4} w="full" mb={8} flexWrap="wrap">
        <Box
          flex={1}
          minW="220px"
          bg={t.color.surface}
          borderWidth="1px"
          borderColor={t.color.border}
          borderRadius={t.radius.lg}
          p={5}
        >
          <HStack justify="space-between" align="center">
            <VStack align="start" gap={1}>
              <Text
                color={t.color.textMuted}
                fontWeight="semibold"
                fontSize="sm"
                letterSpacing="0.05em"
              >
                현재 활성
              </Text>
              <Text
                fontSize="2xl"
                fontWeight="bold"
                fontFamily={t.font.serif}
                color={t.color.text}
              >
                {isLoadingActive ? <Spinner size="sm" color={t.color.accent} /> : (activeFeatured?.length || 0)}
              </Text>
            </VStack>
            <Box color={t.color.accent}>
              <Sparkles size={24} />
            </Box>
          </HStack>
        </Box>

        <Box
          flex={1}
          minW="220px"
          bg={t.color.surface}
          borderWidth="1px"
          borderColor={t.color.border}
          borderRadius={t.radius.lg}
          p={5}
        >
          <HStack justify="space-between" align="center">
            <VStack align="start" gap={1}>
              <Text
                color={t.color.textMuted}
                fontWeight="semibold"
                fontSize="sm"
                letterSpacing="0.05em"
              >
                예약됨
              </Text>
              <Text
                fontSize="2xl"
                fontWeight="bold"
                fontFamily={t.font.serif}
                color={t.color.text}
              >
                {scheduledCount}
              </Text>
            </VStack>
            <Box color={t.color.accent}>
              <Clock size={24} />
            </Box>
          </HStack>
        </Box>
      </HStack>

      {/* Tabs Section */}
      <Tabs.Root
        value={selectedTab}
        onValueChange={(details : any) => setSelectedTab(details.value)}
        w="full"
      >
        <Tabs.List
          borderBottomWidth="1px"
          borderColor={t.color.border}
        >
          <Tabs.Trigger value="active" {...tabTriggerStyle}>
            <Sparkles size={16} />
            활성 Featured
          </Tabs.Trigger>

          <Tabs.Trigger value="documents" {...tabTriggerStyle}>
            <FileText size={16} />
            문서 목록
          </Tabs.Trigger>

          <Tabs.Trigger value="history" {...tabTriggerStyle}>
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
    </Box>
  );
};

export default FeatureAdminDashboard;
