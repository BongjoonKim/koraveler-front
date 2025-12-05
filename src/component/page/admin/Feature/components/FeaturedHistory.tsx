import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  HStack,
  VStack,
  Text,
  Badge,
  Spinner,
  Alert,
  EmptyState,
  Pagination,
  Table,
  IconButton
} from '@chakra-ui/react';
import {
  Calendar,
  User,
  Eye,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useFeaturedHistory } from '../../../../../hooks/useFeaturedQueries';

// 타입 정의 추가
interface FeaturedInfo {
  featuredTitle?: string;
  location?: string;
}

interface FeaturedSchedule {
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  approvedBy?: string;
}

interface FeaturedDocument {
  id: string;
  title: string;
  featuredInfo?: FeaturedInfo;
  featuredSchedule?: FeaturedSchedule;
}

const FeaturedHistory: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1); // 1-based로 변경
  
  const { data, isLoading, error } = useFeaturedHistory({
    page: currentPage - 1, // API는 0-based
    size: 20
  });
  
  // 상태별 카운트 계산 (메모이제이션)
  const statusCounts = useMemo(() => {
    if (!data?.documents) return { active: 0, scheduled: 0, ended: 0 };
    
    const now = new Date();
    let active = 0;
    let scheduled = 0;
    let ended = 0;
    
    data.documents.forEach((doc) => {
      const typedDoc = doc as FeaturedDocument;
      if (!typedDoc.featuredSchedule?.startDate || !typedDoc.featuredSchedule?.endDate) {
        return;
      }
      
      const start = new Date(typedDoc.featuredSchedule.startDate);
      const end = new Date(typedDoc.featuredSchedule.endDate);
      
      if (now < start) {
        scheduled++;
      } else if (now >= start && now <= end) {
        active++;
      } else {
        ended++;
      }
    });
    
    return { active, scheduled, ended };
  }, [data?.documents]);
  
  const formatDate = (date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusBadge = (doc: FeaturedDocument) => {
    if (!doc.featuredSchedule?.startDate || !doc.featuredSchedule?.endDate) {
      return <Badge colorScheme="gray">미설정</Badge>;
    }
    
    const now = new Date();
    const start = new Date(doc.featuredSchedule.startDate);
    const end = new Date(doc.featuredSchedule.endDate);
    
    if (now < start) {
      return <Badge colorScheme="blue">예약됨</Badge>;
    } else if (now >= start && now <= end) {
      return <Badge colorScheme="green">활성</Badge>;
    } else {
      return <Badge colorScheme="gray">종료</Badge>;
    }
  };
  
  const getDuration = (start?: string, end?: string) => {
    if (!start || !end) return '-';
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = endDate.getTime() - startDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return '당일';
    return `${days}일`;
  };
  
  if (isLoading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <Spinner size="xl" color="purple.500" />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert.Root status="error" className="rounded-lg">
        <AlertCircle className="mr-2" />
        <Text>히스토리를 불러오는데 실패했습니다.</Text>
      </Alert.Root>
    );
  }
  
  if (!data?.documents || data.documents.length === 0) {
    return (
      <EmptyState.Root className="py-12">
        <EmptyState.Title>
          Featured 히스토리가 없습니다
        </EmptyState.Title>
        <EmptyState.Description>
          아직 Featured로 설정된 콘텐츠가 없습니다
        </EmptyState.Description>
      </EmptyState.Root>
    );
  }
  
  return (
    <VStack className="gap-4 w-full">
      {/* Summary Card */}
      <Card.Root className="w-full mb-4">
        <Card.Body>
          <HStack className="justify-between">
            <Text className="font-semibold text-gray-700">
              총 {data.totalDocsCnt}개의 Featured 히스토리
            </Text>
            <HStack className="gap-4">
              <HStack>
                <CheckCircle size={16} className="text-green-500" />
                <Text className="text-sm">활성: {statusCounts.active}</Text>
              </HStack>
              <HStack>
                <Clock size={16} className="text-blue-500" />
                <Text className="text-sm">예약: {statusCounts.scheduled}</Text>
              </HStack>
              <HStack>
                <XCircle size={16} className="text-gray-500" />
                <Text className="text-sm">종료: {statusCounts.ended}</Text>
              </HStack>
            </HStack>
          </HStack>
        </Card.Body>
      </Card.Root>
      
      {/* History Table */}
      <Card.Root className="w-full overflow-hidden">
        <Table.Root size="sm">
          <Table.Header>
            <Table.Row className="bg-gray-50">
              <Table.ColumnHeader className="px-4 py-3 font-semibold">
                상태
              </Table.ColumnHeader>
              <Table.ColumnHeader className="px-4 py-3 font-semibold">
                제목
              </Table.ColumnHeader>
              <Table.ColumnHeader className="px-4 py-3 font-semibold">
                Featured 제목
              </Table.ColumnHeader>
              <Table.ColumnHeader className="px-4 py-3 font-semibold">
                시작일
              </Table.ColumnHeader>
              <Table.ColumnHeader className="px-4 py-3 font-semibold">
                종료일
              </Table.ColumnHeader>
              <Table.ColumnHeader className="px-4 py-3 font-semibold">
                기간
              </Table.ColumnHeader>
              <Table.ColumnHeader className="px-4 py-3 font-semibold">
                승인자
              </Table.ColumnHeader>
              <Table.ColumnHeader className="px-4 py-3 font-semibold">
                액션
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          
          <Table.Body>
            {data.documents.map((doc) => {
              const typedDoc = doc as FeaturedDocument;
              return (
                <Table.Row
                  key={typedDoc.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <Table.Cell className="px-4 py-3">
                    {getStatusBadge(typedDoc)}
                  </Table.Cell>
                  
                  <Table.Cell className="px-4 py-3">
                    <Text className="font-medium line-clamp-1">
                      {typedDoc.title}
                    </Text>
                  </Table.Cell>
                  
                  <Table.Cell className="px-4 py-3">
                    <VStack className="items-start gap-0">
                      <Text className="line-clamp-1">
                        {typedDoc.featuredInfo?.featuredTitle || '-'}
                      </Text>
                      {typedDoc.featuredInfo?.location && (
                        <Text className="text-xs text-gray-500">
                          📍 {typedDoc.featuredInfo.location}
                        </Text>
                      )}
                    </VStack>
                  </Table.Cell>
                  
                  <Table.Cell className="px-4 py-3">
                    <HStack className="gap-1">
                      <Calendar size={14} className="text-gray-400" />
                      <Text className="text-sm">
                        {formatDate(typedDoc.featuredSchedule?.startDate)}
                      </Text>
                    </HStack>
                  </Table.Cell>
                  
                  <Table.Cell className="px-4 py-3">
                    <HStack className="gap-1">
                      <Calendar size={14} className="text-gray-400" />
                      <Text className="text-sm">
                        {formatDate(typedDoc.featuredSchedule?.endDate)}
                      </Text>
                    </HStack>
                  </Table.Cell>
                  
                  <Table.Cell className="px-4 py-3">
                    <Badge variant="subtle" size="sm">
                      {getDuration(
                        typedDoc.featuredSchedule?.startDate,
                        typedDoc.featuredSchedule?.endDate
                      )}
                    </Badge>
                  </Table.Cell>
                  
                  <Table.Cell className="px-4 py-3">
                    <HStack className="gap-1">
                      <User size={14} className="text-gray-400" />
                      <Text className="text-sm">
                        {typedDoc.featuredSchedule?.approvedBy || '-'}
                      </Text>
                    </HStack>
                  </Table.Cell>
                  
                  <Table.Cell className="px-4 py-3">
                    <IconButton
                      aria-label="View"
                      size="xs"
                      variant="ghost"
                      onClick={() => window.open(`/blog/view/${typedDoc.id}`, '_blank')}
                    >
                      <Eye size={14} />
                    </IconButton>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </Card.Root>
      
      {/* Pagination */}
      {data.totalPagesCnt && data.totalPagesCnt > 1 && (
        <Box className="flex justify-center mt-4">
          <Pagination.Root
            count={data.totalDocsCnt || 0}
            pageSize={20}
            page={currentPage}
            onPageChange={(details : any) => setCurrentPage(details.page)}
          >
            <HStack className="gap-2">
              <Pagination.PrevTrigger className="px-3 py-2 border rounded hover:bg-gray-50">
                이전
              </Pagination.PrevTrigger>
              
              <Pagination.Items
                className="flex gap-1"
                render={(page) => (
                  page.type === 'page' ? (
                    <Pagination.Item
                      {...page}
                      className="px-3 py-2 border rounded hover:bg-purple-50
                         data-[selected]:bg-purple-500 data-[selected]:text-white"
                    >
                      {page.value}
                    </Pagination.Item>
                  ) : (
                    <Pagination.Ellipsis {...page}>
                      <Text className="px-2">...</Text>
                    </Pagination.Ellipsis>
                  )
                )}
              />
              
              <Pagination.NextTrigger className="px-3 py-2 border rounded hover:bg-gray-50">
                다음
              </Pagination.NextTrigger>
            </HStack>
          </Pagination.Root>
        </Box>
      )}
    </VStack>
  );
};

export default FeaturedHistory;