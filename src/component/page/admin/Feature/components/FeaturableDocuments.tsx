import React, { useState, useCallback } from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  Button,
  Badge,
  Image,
  Input,
  Spinner,
  IconButton,
  Grid,
  Pagination
} from '@chakra-ui/react';
import {
  Search,
  Plus,
  Eye,
  Calendar,
  FileText,
  AlertCircle
} from 'lucide-react';
import {
  useFeaturableDocuments,
  useSetFeatured
} from '../../../../../hooks/useFeaturedQueries';
import { debounce } from 'lodash';
import SetFeaturedModal from './SetFeaturedModal';
import moment from "moment";
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

function FeaturableDocuments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedDoc, setSelectedDoc] = useState<DocumentDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error } = useFeaturableDocuments({
    page: currentPage,
    size: 12,
    search: searchTerm
  });

  const { mutate: setFeatured, isPending: isSetting } = useSetFeatured();

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
      setCurrentPage(0);
    }, 500),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handleSetFeatured = (doc: DocumentDTO) => {
    setSelectedDoc(doc);
    setIsModalOpen(true);
  };

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
        <Text>문서 목록을 불러오는데 실패했습니다.</Text>
      </HStack>
    );
  }

  return (
    <>
      {/* Search Bar */}
      <Box mb={6}>
        <HStack gap={4}>
          <Box position="relative" flex={1} maxW="md">
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
              placeholder="제목, 태그, 내용으로 검색..."
              pl={10}
              bg={t.color.surface2}
              borderColor={t.color.border}
              color={t.color.text}
              _placeholder={{ color: t.color.textFaint }}
              _focus={{ borderColor: t.color.accent }}
              onChange={handleSearch}
            />
          </Box>
          <Badge
            bg={t.color.badgeBg}
            color={t.color.badgeText}
            borderRadius={t.radius.pill}
            px={3}
            py={2}
          >
            총 {data?.totalDocsCnt || 0}개 문서
          </Badge>
        </HStack>
      </Box>

      {/* Loading State */}
      {isLoading && (
        <HStack justify="center" align="center" h="64" w="full">
          <Spinner size="xl" color={t.color.accent} />
        </HStack>
      )}

      {/* Empty State */}
      {!isLoading && (!data?.documents || data.documents.length === 0) && (
        <VStack
          py={12}
          gap={2}
          borderWidth="1px"
          borderStyle="dashed"
          borderColor={t.color.border2}
          borderRadius={t.radius.lg}
        >
          <Text fontFamily={t.font.serif} fontSize="lg" color={t.color.textSoft}>
            Featured 가능한 문서가 없습니다
          </Text>
          <Text fontSize="sm" color={t.color.textMuted}>
            {searchTerm ? "다른 검색어로 시도해보세요" : "새로운 블로그 글을 작성해주세요"}
          </Text>
        </VStack>
      )}

      {/* Document Grid */}
      {!isLoading && data?.documents && data.documents.length > 0 && (
        <>
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
            gap={4}
            mb={6}
          >
            {data.documents.map((doc) => (
              <Box
                key={doc.id}
                bg={t.color.surface}
                borderWidth="1px"
                borderColor={t.color.border}
                borderRadius={t.radius.lg}
                overflow="hidden"
                transition="border-color 0.2s ease"
                _hover={{ borderColor: t.color.border2 }}
                role="group"
              >
                {/* Thumbnail */}
                {doc.thumbnailImgUrl && (
                  <Box position="relative" h="48" overflow="hidden">
                    <Image
                      src={doc.thumbnailImgUrl}
                      alt={doc.title}
                      w="full"
                      h="full"
                      objectFit="cover"
                    />
                    <Badge
                      position="absolute"
                      top={2}
                      right={2}
                      bg={doc.draft ? "whiteAlpha.300" : t.color.badgeBg}
                      color={doc.draft ? t.color.text : t.color.badgeText}
                      borderRadius={t.radius.pill}
                      px={2.5}
                    >
                      {doc.draft ? '임시저장' : '게시됨'}
                    </Badge>
                  </Box>
                )}

                <Box p={4}>
                  <VStack gap={3} align="start">
                    {/* Title */}
                    <Text
                      fontWeight="bold"
                      fontSize="lg"
                      fontFamily={t.font.serif}
                      color={t.color.text}
                      lineClamp={2}
                    >
                      {doc.title}
                    </Text>

                    {/* Meta Info */}
                    <HStack fontSize="sm" color={t.color.textFaint} gap={3}>
                      <HStack gap={1}>
                        <Calendar size={14} />
                        <Text>{moment(doc?.created, 'YYYY-MM-DD').format('YYYY.MM.DD')}</Text>
                      </HStack>
                      {doc.tags && doc.tags.length > 0 && (
                        <HStack gap={1}>
                          <FileText size={14} />
                          <Text>{doc.tags.length} tags</Text>
                        </HStack>
                      )}
                    </HStack>

                    {/* Tags */}
                    {doc.tags && doc.tags.length > 0 && (
                      <HStack flexWrap="wrap" gap={1}>
                        {doc.tags.slice(0, 3).map((tag, idx) => (
                          <Badge
                            key={idx}
                            size="sm"
                            bg="transparent"
                            borderWidth="1px"
                            borderColor={t.color.border2}
                            color={t.color.textSoft}
                            borderRadius={t.radius.pill}
                            px={2}
                            fontSize="xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {doc.tags.length > 3 && (
                          <Badge
                            size="sm"
                            bg="transparent"
                            color={t.color.textFaint}
                            fontSize="xs"
                          >
                            +{doc.tags.length - 3}
                          </Badge>
                        )}
                      </HStack>
                    )}

                    {/* Actions */}
                    <HStack w="full" gap={2} pt={2}>
                      <Button
                        size="sm"
                        flex={1}
                        bg={t.color.accentStrong}
                        color={t.color.text}
                        borderRadius={t.radius.pill}
                        _hover={{ filter: "brightness(1.12)" }}
                        onClick={() => handleSetFeatured(doc)}
                        loading={isSetting}
                      >
                        <Plus size={16} />
                        Featured 설정
                      </Button>
                      <IconButton
                        aria-label="View"
                        size="sm"
                        variant="ghost"
                        color={t.color.textMuted}
                        _hover={{ color: t.color.text, bg: "whiteAlpha.100" }}
                        onClick={() => window.open(`/blog/view/${doc.id}`, '_blank')}
                      >
                        <Eye size={16} />
                      </IconButton>
                    </HStack>
                  </VStack>
                </Box>
              </Box>
            ))}
          </Grid>

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
        </>
      )}

      {/* Set Featured Modal */}
      {selectedDoc && (
        <SetFeaturedModal
          document={selectedDoc}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDoc(null);
          }}
        />
      )}
    </>
  );
};

export default FeaturableDocuments;
