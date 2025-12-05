import React, { useState } from 'react';
import {
  Box,
  Card,
  HStack,
  VStack,
  Text,
  Button,
  Badge,
  Image,
  IconButton,
  Spinner,
  Alert,
  EmptyState
} from '@chakra-ui/react';
import {
  Calendar,
  MapPin,
  Edit,
  Trash2,
  Eye,
  GripVertical,
  AlertCircle
} from 'lucide-react';
import {
  useFeaturedDocuments,
  useRemoveFromFeatured
} from '../../../../../hooks/useFeaturedQueries';
import FeaturedEditModal from './FeaturedEditModal';

const ActiveFeaturedList: React.FC = () => {
  const { data: featuredDocs, isLoading, error } = useFeaturedDocuments(10);
  const { mutate: removeFeatured, isPending: isRemoving } = useRemoveFromFeatured();
  const [selectedDoc, setSelectedDoc] = useState<FeaturedDocument | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
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
        <Text>Featured 콘텐츠를 불러오는데 실패했습니다.</Text>
      </Alert.Root>
    );
  }
  
  if (!featuredDocs || featuredDocs.length === 0) {
    return (
      <EmptyState.Root className="py-12">
        <EmptyState.Title>
          활성 Featured 콘텐츠가 없습니다
        </EmptyState.Title>
        <EmptyState.Description>
          문서 목록에서 Featured로 설정할 콘텐츠를 선택해주세요
        </EmptyState.Description>
      </EmptyState.Root>
    );
  }
  
  const handleRemove = (id: string) => {
    if (window.confirm('정말로 Featured에서 제거하시겠습니까?')) {
      removeFeatured(id);
    }
  };
  
  const handleEdit = (doc: FeaturedDocument) => {
    setSelectedDoc(doc);
    setIsEditModalOpen(true);
  };
  
  const formatDate = (date?: string) => {
    if (!date) return '미설정';
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <>
      <VStack className="gap-4 w-full">
        {featuredDocs.map((doc, index) => (
          <Card.Root
            key={doc.id}
            className="w-full hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          >
            <Card.Body className="p-0">
              <HStack className="gap-0 h-full">
                {/* Drag Handle */}
                <Box className="px-2 py-4 bg-gray-50 cursor-move hover:bg-gray-100 transition-colors">
                  <GripVertical size={20} className="text-gray-400" />
                </Box>
                
                {/* Priority Badge */}
                <Box className="px-4 py-4 bg-gradient-to-br from-purple-50 to-purple-100">
                  <Badge
                    colorScheme="purple"
                    className="text-lg font-bold px-3 py-1"
                  >
                    #{index + 1}
                  </Badge>
                </Box>
                
                {/* Thumbnail */}
                {doc.featuredInfo?.featuredImageUrl && (
                  <Box className="relative w-32 h-32 flex-shrink-0">
                    <Image
                      src={doc.featuredInfo.featuredImageUrl}
                      alt={doc.title}
                      className="w-full h-full object-cover"
                    />
                    <Box
                      className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                    />
                  </Box>
                )}
                
                {/* Content */}
                <VStack className="flex-1 p-4 gap-2 items-start">
                  <HStack className="w-full justify-between">
                    <Box className="flex-1">
                      <Text className="text-lg font-bold text-gray-900 mb-1">
                        {doc.featuredInfo?.featuredTitle || doc.title}
                      </Text>
                      {doc.featuredInfo?.featuredSubtitle && (
                        <Text className="text-sm text-gray-600">
                          {doc.featuredInfo.featuredSubtitle}
                        </Text>
                      )}
                    </Box>
                    
                    <HStack className="gap-1">
                      {doc.featuredSchedule?.isActive && (
                        <Badge colorScheme="green">활성</Badge>
                      )}
                      {doc.draft && (
                        <Badge colorScheme="yellow">임시저장</Badge>
                      )}
                    </HStack>
                  </HStack>
                  
                  {/* Metadata */}
                  <HStack className="flex-wrap gap-4 text-sm text-gray-500">
                    {doc.featuredInfo?.location && (
                      <HStack className="gap-1">
                        <MapPin size={14} />
                        <Text>{doc.featuredInfo.location}</Text>
                      </HStack>
                    )}
                    
                    <HStack className="gap-1">
                      <Calendar size={14} />
                      <Text>
                        {formatDate(doc.featuredSchedule?.startDate)} ~ {formatDate(doc.featuredSchedule?.endDate)}
                      </Text>
                    </HStack>
                  </HStack>
                  
                  {/* Highlights */}
                  {doc.featuredInfo?.highlights && doc.featuredInfo.highlights.length > 0 && (
                    <HStack className="gap-2 flex-wrap">
                      {doc.featuredInfo.highlights.map((highlight, idx) => (
                        <Badge
                          key={idx}
                          variant="subtle"
                          colorScheme="blue"
                          className="text-xs"
                        >
                          {highlight}
                        </Badge>
                      ))}
                    </HStack>
                  )}
                </VStack>
                
                {/* Actions */}
                <VStack className="p-4 gap-2 border-l border-gray-100">
                  <IconButton
                    aria-label="View"
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(`/blog/view/${doc.id}`, '_blank')}
                  >
                    <Eye size={16} />
                  </IconButton>
                  
                  <IconButton
                    aria-label="Edit"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(doc)}
                  >
                    <Edit size={16} />
                  </IconButton>
                  
                  <IconButton
                    aria-label="Remove"
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => handleRemove(doc.id!)}
                    loading={isRemoving}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </VStack>
              </HStack>
            </Card.Body>
          </Card.Root>
        ))}
      </VStack>
      
      {/* Edit Modal */}
      {selectedDoc && (
        <FeaturedEditModal
          document={selectedDoc}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedDoc(null);
          }}
        />
      )}
    </>
  );
};

export default ActiveFeaturedList;