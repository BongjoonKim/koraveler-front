import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  HStack,
  VStack,
  Text,
  Button,
  Badge,
  Image,
  Input,
  Spinner,
  Alert,
  EmptyState,
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
  
  const formatDate = (date?: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  if (error) {
    return (
      <Alert.Root status="error" className="rounded-lg">
        <AlertCircle className="mr-2" />
        <Text>문서 목록을 불러오는데 실패했습니다.</Text>
      </Alert.Root>
    );
  }
  
  return (
    <>
      {/* Search Bar */}
      <Box className="mb-6">
        <HStack className="gap-4">
          <Box className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <Input
              placeholder="제목, 태그, 내용으로 검색..."
              className="pl-10"
              onChange={handleSearch}
            />
          </Box>
          <Badge
            colorScheme="gray"
            className="px-3 py-2"
          >
            총 {data?.totalDocsCnt || 0}개 문서
          </Badge>
        </HStack>
      </Box>
      
      {/* Loading State */}
      {isLoading && (
        <Box className="flex justify-center items-center h-64">
          <Spinner size="xl" color="purple.500" />
        </Box>
      )}
      
      {/* Empty State */}
      {!isLoading && (!data?.documents || data.documents.length === 0) && (
        <EmptyState.Root>
          <EmptyState.Title>
            Featured 가능한 문서가 없습니다
          </EmptyState.Title>
          <EmptyState.Description>
            {searchTerm ? "다른 검색어로 시도해보세요" : "새로운 블로그 글을 작성해주세요"}
          </EmptyState.Description>
        </EmptyState.Root>
      )}
      
      {/* Document Grid */}
      {!isLoading && data?.documents && data.documents.length > 0 && (
        <>
          <Grid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {data.documents.map((doc) => (
              <Card.Root
                key={doc.id}
                className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                {/* Thumbnail */}
                {doc.thumbnailImgUrl && (
                  <Box className="relative h-48 overflow-hidden">
                    <Image
                      src={doc.thumbnailImgUrl}
                      alt={doc.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Box className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <Badge
                      className="absolute top-2 right-2"
                      colorScheme={doc.draft ? 'yellow' : 'green'}
                    >
                      {doc.draft ? '임시저장' : '게시됨'}
                    </Badge>
                  </Box>
                )}
                
                <Card.Body className="p-4">
                  <VStack className="gap-3 items-start">
                    {/* Title */}
                    <Box className="w-full">
                      <Text className="font-bold text-lg text-gray-900 line-clamp-2">
                        {doc.title}
                      </Text>
                    </Box>
                    
                    {/* Meta Info */}
                    <HStack className="text-sm text-gray-500 gap-3">
                      <HStack className="gap-1">
                        <Calendar size={14} />
                        <Text>{moment(doc?.created, 'YYYY-MM-DD').toISOString()}</Text>
                      </HStack>
                      {doc.tags && doc.tags.length > 0 && (
                        <HStack className="gap-1">
                          <FileText size={14} />
                          <Text>{doc.tags.length} tags</Text>
                        </HStack>
                      )}
                    </HStack>
                    
                    {/* Tags */}
                    {doc.tags && doc.tags.length > 0 && (
                      <HStack className="flex-wrap gap-1">
                        {doc.tags.slice(0, 3).map((tag, idx) => (
                          <Badge
                            key={idx}
                            size="sm"
                            variant="subtle"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {doc.tags.length > 3 && (
                          <Badge size="sm" variant="subtle" className="text-xs">
                            +{doc.tags.length - 3}
                          </Badge>
                        )}
                      </HStack>
                    )}
                    
                    {/* Actions */}
                    <HStack className="w-full gap-2 pt-2">
                      <Button
                        size="sm"
                        colorScheme="purple"
                        className="flex-1"
                        onClick={() => handleSetFeatured(doc)}
                        loading={isSetting}
                      >
                        <Plus size={16} className="mr-1" />
                        Featured 설정
                      </Button>
                      <IconButton
                        aria-label="View"
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(`/blog/view/${doc.id}`, '_blank')}
                      >
                        <Eye size={16} />
                      </IconButton>
                    </HStack>
                  </VStack>
                </Card.Body>
              </Card.Root>
            ))}
          </Grid>
          
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