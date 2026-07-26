import React, { useState, useMemo } from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  Badge,
  Spinner,
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
import { homeTokens } from '../../adminUi';

const t = homeTokens;

// 페이지네이션 트리거 다크 톤 공통 스타일
const pageBtnStyle = {
  px: 3,
  py: 2,
  borderWidth: "1px",
  borderColor: t.color.border,
  borderRadius: t.radius.md,
  color: t.color.textSoft,
  bg: "transparent",
  _hover: { bg: t.color.surface3 },
} as const;

const headerCellStyle = {
  px: 4,
  py: 3,
  fontWeight: "semibold",
  color: t.color.textSoft,
  borderColor: t.color.border,
  bg: t.color.surface2,
} as const;

const bodyCellStyle = {
  px: 4,
  py: 3,
  borderColor: t.color.border,
  color: t.color.text,
} as const;

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
      return (
        <Badge bg="whiteAlpha.100" color={t.color.textMuted} borderRadius={t.radius.pill} px={2.5}>
          미설정
        </Badge>
      );
    }

    const now = new Date();
    const start = new Date(doc.featuredSchedule.startDate);
    const end = new Date(doc.featuredSchedule.endDate);

    if (now < start) {
      return (
        <Badge
          bg="transparent"
          borderWidth="1px"
          borderColor={t.color.accent}
          color={t.color.accent}
          borderRadius={t.radius.pill}
          px={2.5}
        >
          예약됨
        </Badge>
      );
    } else if (now >= start && now <= end) {
      return (
        <Badge bg={t.color.badgeBg} color={t.color.badgeText} borderRadius={t.radius.pill} px={2.5}>
          활성
        </Badge>
      );
    } else {
      return (
        <Badge bg="whiteAlpha.100" color={t.color.textMuted} borderRadius={t.radius.pill} px={2.5}>
          종료
        </Badge>
      );
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
      <HStack justify="center" align="center" h="64" w="full">
        <Spinner size="xl" color={t.color.accent} />
      </HStack>
    );
  }

  if (error) {
    return (
      <HStack
        bg="rgba(180, 60, 60, 0.12)"
        borderWidth="1px"
        borderColor="rgba(221, 153, 153, 0.35)"
        borderRadius={t.radius.md}
        color="#eaa"
        p={4}
        gap={2}
      >
        <AlertCircle size={18} />
        <Text>히스토리를 불러오는데 실패했습니다.</Text>
      </HStack>
    );
  }

  if (!data?.documents || data.documents.length === 0) {
    return (
      <VStack
        py={12}
        gap={2}
        borderWidth="1px"
        borderStyle="dashed"
        borderColor={t.color.border2}
        borderRadius={t.radius.lg}
      >
        <Text fontFamily={t.font.serif} fontSize="lg" color={t.color.textSoft}>
          Featured 히스토리가 없습니다
        </Text>
        <Text fontSize="sm" color={t.color.textMuted}>
          아직 Featured로 설정된 콘텐츠가 없습니다
        </Text>
      </VStack>
    );
  }

  return (
    <VStack gap={4} w="full">
      {/* Summary Card */}
      <Box
        w="full"
        bg={t.color.surface}
        borderWidth="1px"
        borderColor={t.color.border}
        borderRadius={t.radius.lg}
        p={5}
      >
        <HStack justify="space-between" flexWrap="wrap" gap={3}>
          <Text fontWeight="semibold" color={t.color.textSoft}>
            총 {data.totalDocsCnt}개의 Featured 히스토리
          </Text>
          <HStack gap={4}>
            <HStack gap={1.5}>
              <Box color={t.color.accent}><CheckCircle size={16} /></Box>
              <Text fontSize="sm" color={t.color.textMuted}>활성: {statusCounts.active}</Text>
            </HStack>
            <HStack gap={1.5}>
              <Box color={t.color.textSoft}><Clock size={16} /></Box>
              <Text fontSize="sm" color={t.color.textMuted}>예약: {statusCounts.scheduled}</Text>
            </HStack>
            <HStack gap={1.5}>
              <Box color={t.color.textFaint}><XCircle size={16} /></Box>
              <Text fontSize="sm" color={t.color.textMuted}>종료: {statusCounts.ended}</Text>
            </HStack>
          </HStack>
        </HStack>
      </Box>

      {/* History Table */}
      <Box
        w="full"
        overflowX="auto"
        bg={t.color.surface}
        borderWidth="1px"
        borderColor={t.color.border}
        borderRadius={t.radius.lg}
      >
        <Table.Root size="sm" bg="transparent">
          <Table.Header>
            <Table.Row bg="transparent">
              <Table.ColumnHeader {...headerCellStyle}>상태</Table.ColumnHeader>
              <Table.ColumnHeader {...headerCellStyle}>제목</Table.ColumnHeader>
              <Table.ColumnHeader {...headerCellStyle}>Featured 제목</Table.ColumnHeader>
              <Table.ColumnHeader {...headerCellStyle}>시작일</Table.ColumnHeader>
              <Table.ColumnHeader {...headerCellStyle}>종료일</Table.ColumnHeader>
              <Table.ColumnHeader {...headerCellStyle}>기간</Table.ColumnHeader>
              <Table.ColumnHeader {...headerCellStyle}>승인자</Table.ColumnHeader>
              <Table.ColumnHeader {...headerCellStyle}>액션</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {data.documents.map((doc) => {
              const typedDoc = doc as FeaturedDocument;
              return (
                <Table.Row
                  key={typedDoc.id}
                  bg="transparent"
                  _hover={{ bg: "rgba(143, 191, 148, 0.06)" }}
                  transition="background 0.15s ease"
                >
                  <Table.Cell {...bodyCellStyle}>
                    {getStatusBadge(typedDoc)}
                  </Table.Cell>

                  <Table.Cell {...bodyCellStyle}>
                    <Text fontWeight="medium" lineClamp={1}>
                      {typedDoc.title}
                    </Text>
                  </Table.Cell>

                  <Table.Cell {...bodyCellStyle}>
                    <VStack align="start" gap={0}>
                      <Text lineClamp={1}>
                        {typedDoc.featuredInfo?.featuredTitle || '-'}
                      </Text>
                      {typedDoc.featuredInfo?.location && (
                        <Text fontSize="xs" color={t.color.textFaint}>
                          📍 {typedDoc.featuredInfo.location}
                        </Text>
                      )}
                    </VStack>
                  </Table.Cell>

                  <Table.Cell {...bodyCellStyle}>
                    <HStack gap={1}>
                      <Box color={t.color.textFaint}><Calendar size={14} /></Box>
                      <Text fontSize="sm">
                        {formatDate(typedDoc.featuredSchedule?.startDate)}
                      </Text>
                    </HStack>
                  </Table.Cell>

                  <Table.Cell {...bodyCellStyle}>
                    <HStack gap={1}>
                      <Box color={t.color.textFaint}><Calendar size={14} /></Box>
                      <Text fontSize="sm">
                        {formatDate(typedDoc.featuredSchedule?.endDate)}
                      </Text>
                    </HStack>
                  </Table.Cell>

                  <Table.Cell {...bodyCellStyle}>
                    <Badge
                      bg="transparent"
                      borderWidth="1px"
                      borderColor={t.color.border2}
                      color={t.color.textSoft}
                      borderRadius={t.radius.pill}
                      px={2.5}
                      size="sm"
                    >
                      {getDuration(
                        typedDoc.featuredSchedule?.startDate,
                        typedDoc.featuredSchedule?.endDate
                      )}
                    </Badge>
                  </Table.Cell>

                  <Table.Cell {...bodyCellStyle}>
                    <HStack gap={1}>
                      <Box color={t.color.textFaint}><User size={14} /></Box>
                      <Text fontSize="sm">
                        {typedDoc.featuredSchedule?.approvedBy || '-'}
                      </Text>
                    </HStack>
                  </Table.Cell>

                  <Table.Cell {...bodyCellStyle}>
                    <IconButton
                      aria-label="View"
                      size="xs"
                      variant="ghost"
                      color={t.color.textMuted}
                      _hover={{ color: t.color.text, bg: "whiteAlpha.100" }}
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
      </Box>

      {/* Pagination */}
      {data.totalPagesCnt && data.totalPagesCnt > 1 && (
        <HStack justify="center" mt={4}>
          <Pagination.Root
            count={data.totalDocsCnt || 0}
            pageSize={20}
            page={currentPage}
            onPageChange={(details : any) => setCurrentPage(details.page)}
          >
            <HStack gap={2}>
              <Pagination.PrevTrigger {...pageBtnStyle}>
                이전
              </Pagination.PrevTrigger>

              <Pagination.Items
                render={(page) => (
                  page.type === 'page' ? (
                    <Pagination.Item
                      {...page}
                      {...pageBtnStyle}
                      _selected={{
                        bg: t.color.accentStrong,
                        color: t.color.text,
                        borderColor: "transparent",
                      }}
                    >
                      {page.value}
                    </Pagination.Item>
                  ) : (
                    <Pagination.Ellipsis {...page}>
                      <Text px={2} color={t.color.textFaint}>...</Text>
                    </Pagination.Ellipsis>
                  )
                )}
              />

              <Pagination.NextTrigger {...pageBtnStyle}>
                다음
              </Pagination.NextTrigger>
            </HStack>
          </Pagination.Root>
        </HStack>
      )}
    </VStack>
  );
};

export default FeaturedHistory;
