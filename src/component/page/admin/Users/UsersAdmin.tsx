// /admin/users — 가입 사용자 목록·검색·권한/상태 관리 (다크 세이지-그린 에디토리얼)
import React, { useCallback, useMemo, useState } from "react";
import {
  Badge,
  Box,
  HStack,
  Image,
  Input,
  Pagination,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { AlertCircle, Search } from "lucide-react";
import { debounce } from "lodash";
import moment from "moment";
import styled from "styled-components";
import { homeTokens, EmptyBox, TabButton } from "../adminUi";
import { useAdminUsers } from "../../../../hooks/useAdminUserQueries";
import { useCurrentUser } from "../../../../hooks/useCurrentUser";
import { AdminUserStatusFilter, AdminUserSummary } from "../../../../types/admin/adminUserTypes";
import UserDetailModal from "./components/UserDetailModal";

const t = homeTokens;
const PAGE_SIZE = 20;

// 페이지네이션 트리거 다크 톤 공통 스타일 (Feature 탭과 동일)
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

const STATUS_FILTERS: { value: AdminUserStatusFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "active", label: "활성" },
  { value: "disabled", label: "탈퇴" },
];

function UsersAdmin() {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<AdminUserStatusFilter>("all");
  const [page, setPage] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { data: currentUser } = useCurrentUser();
  const { data, isLoading, error } = useAdminUsers({
    page,
    size: PAGE_SIZE,
    keyword,
    status,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setKeyword(value);
      setPage(0);
    }, 500),
    []
  );

  const stats = useMemo(
    () => [
      { label: "전체 가입자", value: data?.totalAll },
      { label: "활성", value: data?.activeCount },
      { label: "탈퇴", value: data?.disabledCount },
    ],
    [data]
  );

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
        <Text>사용자 목록을 불러오는데 실패했습니다. 관리자 권한을 확인해주세요.</Text>
      </HStack>
    );
  }

  return (
    <>
      {/* 통계 요약 */}
      <HStack gap={3} mb={6} flexWrap="wrap">
        {stats.map((stat) => (
          <Box
            key={stat.label}
            bg={t.color.surface}
            borderWidth="1px"
            borderColor={t.color.border}
            borderRadius={t.radius.lg}
            px={5}
            py={3}
            minW="120px"
          >
            <Text fontSize="xs" color={t.color.textMuted} letterSpacing="0.06em">
              {stat.label}
            </Text>
            <Text fontSize="xl" fontWeight="bold" fontFamily={t.font.serif} color={t.color.text}>
              {stat.value ?? "-"}
            </Text>
          </Box>
        ))}
      </HStack>

      {/* 검색 + 상태 필터 */}
      <HStack gap={4} mb={5} flexWrap="wrap">
        <Box position="relative" flex={1} minW="240px" maxW="md">
          <Box
            position="absolute"
            left={3}
            top="50%"
            transform="translateY(-50%)"
            color={t.color.textFaint}
            zIndex={1}
          >
            <Search size={18} />
          </Box>
          <Input
            placeholder="아이디, 이름, 이메일로 검색..."
            pl={10}
            bg={t.color.surface2}
            borderColor={t.color.border}
            color={t.color.text}
            _placeholder={{ color: t.color.textFaint }}
            _focus={{ borderColor: t.color.accent }}
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </Box>
        <HStack gap={2}>
          {STATUS_FILTERS.map((filter) => (
            <TabButton
              key={filter.value}
              $active={status === filter.value}
              onClick={() => {
                setStatus(filter.value);
                setPage(0);
              }}
            >
              {filter.label}
            </TabButton>
          ))}
        </HStack>
      </HStack>

      {/* 로딩 */}
      {isLoading && (
        <HStack justify="center" align="center" h="48" w="full">
          <Spinner size="xl" color={t.color.accent} />
        </HStack>
      )}

      {/* 빈 상태 */}
      {!isLoading && (!data?.users || data.users.length === 0) && (
        <EmptyBox>
          <p className="empty-title">사용자가 없습니다</p>
          <p className="empty-sub">
            {keyword ? "다른 검색어로 시도해보세요." : "아직 조건에 맞는 가입자가 없습니다."}
          </p>
        </EmptyBox>
      )}

      {/* 사용자 테이블 */}
      {!isLoading && data?.users && data.users.length > 0 && (
        <>
          <TableWrap>
            <table>
              <thead>
                <tr>
                  <th>사용자</th>
                  <th>이메일</th>
                  <th>권한</th>
                  <th>가입일</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((user: AdminUserSummary) => (
                  <tr key={user.id} onClick={() => setSelectedUserId(user.userId)}>
                    <td>
                      <HStack gap={3}>
                        {user.src ? (
                          <Image src={user.src} alt="" boxSize="34px" borderRadius="full" objectFit="cover" />
                        ) : (
                          <Box
                            boxSize="34px"
                            borderRadius="full"
                            bg={t.color.surface3}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            color={t.color.textFaint}
                            fontSize="sm"
                            fontFamily={t.font.serif}
                            flexShrink={0}
                          >
                            {(user.name || user.userId || "?").charAt(0).toUpperCase()}
                          </Box>
                        )}
                        <VStack align="start" gap={0}>
                          <Text fontSize="sm" fontWeight="medium" color={t.color.text}>
                            {user.name || user.userId}
                          </Text>
                          <Text fontSize="xs" color={t.color.textFaint}>
                            @{user.userId}
                          </Text>
                        </VStack>
                      </HStack>
                    </td>
                    <td>
                      <Text fontSize="sm" color={t.color.textSoft}>
                        {user.email || "-"}
                      </Text>
                    </td>
                    <td>
                      <HStack gap={1.5}>
                        {user.roles?.includes("admin") && (
                          <Badge
                            bg="transparent"
                            borderWidth="1px"
                            borderColor={t.color.accent}
                            color={t.color.accent}
                            borderRadius={t.radius.pill}
                            px={2.5}
                            fontSize="xs"
                          >
                            관리자
                          </Badge>
                        )}
                        <Badge
                          bg="transparent"
                          borderWidth="1px"
                          borderColor={t.color.border2}
                          color={t.color.textSoft}
                          borderRadius={t.radius.pill}
                          px={2.5}
                          fontSize="xs"
                        >
                          일반
                        </Badge>
                      </HStack>
                    </td>
                    <td>
                      <Text fontSize="sm" color={t.color.textMuted}>
                        {user.created ? moment(user.created).format("YYYY.MM.DD") : "-"}
                      </Text>
                    </td>
                    <td>
                      <Badge
                        bg={user.enabled ? t.color.badgeBg : "rgba(180, 60, 60, 0.18)"}
                        color={user.enabled ? t.color.badgeText : "#eaa"}
                        borderRadius={t.radius.pill}
                        px={2.5}
                      >
                        {user.enabled ? "활성" : "탈퇴"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>

          {/* 페이지네이션 */}
          {data.totalPages > 1 && (
            <HStack justify="center" mt={6}>
              <Pagination.Root
                count={data.totalCount}
                pageSize={PAGE_SIZE}
                page={page + 1}
                onPageChange={(details: any) => setPage(details.page - 1)}
              >
                <HStack gap={2}>
                  <Pagination.PrevTrigger {...pageBtnStyle}>이전</Pagination.PrevTrigger>
                  <Pagination.Items
                    render={(pageItem) =>
                      pageItem.type === "page" ? (
                        <Pagination.Item
                          {...pageItem}
                          {...pageBtnStyle}
                          _selected={{
                            bg: t.color.accentStrong,
                            color: t.color.text,
                            borderColor: "transparent",
                          }}
                        >
                          {pageItem.value}
                        </Pagination.Item>
                      ) : (
                        <Pagination.Ellipsis {...pageItem}>
                          <Text px={2} color={t.color.textFaint}>
                            ...
                          </Text>
                        </Pagination.Ellipsis>
                      )
                    }
                  />
                  <Pagination.NextTrigger {...pageBtnStyle}>다음</Pagination.NextTrigger>
                </HStack>
              </Pagination.Root>
            </HStack>
          )}
        </>
      )}

      {/* 상세 모달 */}
      {selectedUserId && (
        <UserDetailModal
          userId={selectedUserId}
          currentUserId={currentUser?.id}
          isOpen={!!selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </>
  );
}

const TableWrap = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px solid ${t.color.border};
  border-radius: ${t.radius.lg};
  background: ${t.color.surface};

  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 640px;
  }

  thead th {
    text-align: left;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: ${t.color.textMuted};
    padding: 12px 16px;
    border-bottom: 1px solid ${t.color.border};
    white-space: nowrap;
  }

  tbody td {
    padding: 12px 16px;
    border-bottom: 1px solid ${t.color.border};
    vertical-align: middle;
  }

  tbody tr {
    cursor: pointer;
    transition: background 0.15s ease;
  }

  tbody tr:hover {
    background: ${t.color.surface3};
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;

export default UsersAdmin;
