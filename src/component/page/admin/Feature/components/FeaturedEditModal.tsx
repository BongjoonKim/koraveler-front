import React, { useState, useEffect } from 'react';
import {
  Dialog,
  Input,
  Button,
  VStack,
  HStack,
  Box,
  Text,
  Tabs,
  Field,
  FieldLabel, Tag,
} from '@chakra-ui/react';
import {
  Save,
  X,
  MapPin,
  Tag as TagIcon,
  Palette,
  Image as ImageIcon
} from 'lucide-react';
import { useUpdateFeaturedInfo } from '../../../../../hooks/useFeaturedQueries';

interface FeaturedEditModalProps {
  document: FeaturedDocument;
  isOpen: boolean;
  onClose: () => void;
}

const FeaturedEditModal: React.FC<FeaturedEditModalProps> = ({
                                                               document,
                                                               isOpen,
                                                               onClose
                                                             }) => {
  const { mutate: updateFeatured, isPending } = useUpdateFeaturedInfo();
  
  const [featuredInfo, setFeaturedInfo] = useState<FeaturedInfo>({
    featuredTitle: '',
    featuredSubtitle: '',
    featuredImageUrl: '',
    featuredGradientFrom: '#667eea',
    featuredGradientTo: '#764ba2',
    location: '',
    highlights: [],
    ctaButtonText: '자세히 보기',
    displayPriority: 1
  });
  
  const [newHighlight, setNewHighlight] = useState('');
  
  useEffect(() => {
    if (document.featuredInfo) {
      setFeaturedInfo(document.featuredInfo);
    }
  }, [document]);
  
  const handleSubmit = () => {
    updateFeatured(
      {
        id: document.id!,
        featuredInfo: featuredInfo
      },
      {
        onSuccess: () => {
          onClose();
        }
      }
    );
  };
  
  const updateField = (field: string, value: any) => {
    setFeaturedInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const addHighlight = () => {
    if (newHighlight.trim()) {
      updateField('highlights', [
        ...(featuredInfo.highlights || []),
        newHighlight.trim()
      ]);
      setNewHighlight('');
    }
  };
  
  const removeHighlight = (index: number) => {
    const highlights = featuredInfo.highlights || [];
    updateField(
      'highlights',
      highlights.filter((_, i) => i !== index)
    );
  };
  
  return (
    <Dialog.Root open={isOpen} onOpenChange={(e : any) => !e.open && onClose()}>
      <Dialog.Backdrop className="bg-black/50" />
      <Dialog.Positioner>
        <Dialog.Content className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <Dialog.Header>
            <Dialog.Title className="text-2xl font-bold">
              Featured 정보 수정
            </Dialog.Title>
            <Dialog.Description className="text-gray-600">
              Featured 콘텐츠의 표시 정보를 수정합니다
            </Dialog.Description>
          </Dialog.Header>
          
          <Dialog.Body className="mt-6">
            <Tabs.Root defaultValue="basic" className="w-full">
              <Tabs.List className="mb-6">
                <Tabs.Trigger value="basic">기본 정보</Tabs.Trigger>
                <Tabs.Trigger value="visual">비주얼 설정</Tabs.Trigger>
              </Tabs.List>
              
              {/* 기본 정보 탭 */}
              <Tabs.Content value="basic">
                <VStack className="gap-4">
                  <Field.Root className="w-full">
                    <FieldLabel>Featured 제목</FieldLabel>
                    <Input
                      placeholder="메인에 표시될 제목"
                      value={featuredInfo.featuredTitle}
                      onChange={(e) => updateField('featuredTitle', e.target.value)}
                    />
                    <Field.HelperText>
                      원본 제목: {document.title}
                    </Field.HelperText>
                  </Field.Root>
                  
                  <Field.Root className="w-full">
                    <FieldLabel>부제목</FieldLabel>
                    <Input
                      placeholder="간단한 설명 텍스트"
                      value={featuredInfo.featuredSubtitle}
                      onChange={(e) => updateField('featuredSubtitle', e.target.value)}
                    />
                  </Field.Root>
                  
                  <Field.Root className="w-full">
                    <FieldLabel>
                      <HStack>
                        <MapPin size={16} />
                        <Text>위치 정보</Text>
                      </HStack>
                    </FieldLabel>
                    <Input
                      placeholder="예: 서울, 제주도"
                      value={featuredInfo.location}
                      onChange={(e) => updateField('location', e.target.value)}
                    />
                  </Field.Root>
                  
                  <Field.Root className="w-full">
                    <FieldLabel>
                      <HStack>
                        <TagIcon size={16} />
                        <Text>하이라이트 태그</Text>
                      </HStack>
                    </FieldLabel>
                    <HStack className="w-full">
                      <Input
                        placeholder="추가할 태그 입력"
                        value={newHighlight}
                        onChange={(e) => setNewHighlight(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addHighlight()}
                      />
                      <Button onClick={addHighlight} size="sm">추가</Button>
                    </HStack>
                    <HStack className="flex-wrap gap-2 mt-2">
                      {featuredInfo.highlights?.map((highlight, idx) => (
                        <Tag.Root
                          key={idx}
                          colorScheme="purple"
                        >
                          <Tag.Label>
                            {highlight}
                          </Tag.Label>
                          <Tag.CloseTrigger onClick={() => removeHighlight(idx)} />
                        </Tag.Root>
                      ))}
                    </HStack>
                  </Field.Root>
                  
                  <Field.Root className="w-full">
                    <FieldLabel>CTA 버튼 텍스트</FieldLabel>
                    <Input
                      placeholder="자세히 보기"
                      value={featuredInfo.ctaButtonText}
                      onChange={(e) => updateField('ctaButtonText', e.target.value)}
                    />
                  </Field.Root>
                  
                  <Field.Root className="w-full">
                    <FieldLabel>우선순위</FieldLabel>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={featuredInfo.displayPriority}
                      onChange={(e) => updateField('displayPriority', parseInt(e.target.value))}
                    />
                    <Field.HelperText>
                      숫자가 작을수록 먼저 표시됩니다 (1-10)
                    </Field.HelperText>
                  </Field.Root>
                </VStack>
              </Tabs.Content>
              
              {/* 비주얼 설정 탭 */}
              <Tabs.Content value="visual">
                <VStack className="gap-4">
                  <Field.Root className="w-full">
                    <FieldLabel>
                      <HStack>
                        <ImageIcon size={16} />
                        <Text>히어로 이미지 URL</Text>
                      </HStack>
                    </FieldLabel>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={featuredInfo.featuredImageUrl}
                      onChange={(e) => updateField('featuredImageUrl', e.target.value)}
                    />
                  </Field.Root>
                  
                  {featuredInfo.featuredImageUrl && (
                    <Box className="w-full rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={featuredInfo.featuredImageUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                      />
                    </Box>
                  )}
                  
                  <Field.Root className="w-full">
                    <FieldLabel>
                      <HStack>
                        <Palette size={16} />
                        <Text>그라디언트 색상</Text>
                      </HStack>
                    </FieldLabel>
                    
                    <HStack className="w-full gap-4">
                      <Box className="flex-1">
                        <Text className="text-sm mb-2">시작 색상</Text>
                        <Input
                          type="color"
                          value={featuredInfo.featuredGradientFrom}
                          onChange={(e) => updateField('featuredGradientFrom', e.target.value)}
                          className="h-10 cursor-pointer"
                        />
                        <Input
                          value={featuredInfo.featuredGradientFrom}
                          onChange={(e) => updateField('featuredGradientFrom', e.target.value)}
                          className="mt-2"
                          placeholder="#667eea"
                        />
                      </Box>
                      
                      <Box className="flex-1">
                        <Text className="text-sm mb-2">끝 색상</Text>
                        <Input
                          type="color"
                          value={featuredInfo.featuredGradientTo}
                          onChange={(e) => updateField('featuredGradientTo', e.target.value)}
                          className="h-10 cursor-pointer"
                        />
                        <Input
                          value={featuredInfo.featuredGradientTo}
                          onChange={(e) => updateField('featuredGradientTo', e.target.value)}
                          className="mt-2"
                          placeholder="#764ba2"
                        />
                      </Box>
                    </HStack>
                  </Field.Root>
                  
                  {/* Gradient Preview */}
                  <Box
                    className="w-full h-24 rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${featuredInfo.featuredGradientFrom} 0%, ${featuredInfo.featuredGradientTo} 100%)`
                    }}
                  />
                </VStack>
              </Tabs.Content>
            </Tabs.Root>
            
            {/* Current Schedule Info */}
            {document.featuredSchedule && (
              <Box className="mt-6 p-4 bg-gray-50 rounded-lg">
                <Text className="font-semibold mb-2">현재 스케줄</Text>
                <VStack className="gap-1 text-sm items-start">
                  <Text>
                    시작: {new Date(document.featuredSchedule.startDate!).toLocaleString('ko-KR')}
                  </Text>
                  <Text>
                    종료: {new Date(document.featuredSchedule.endDate!).toLocaleString('ko-KR')}
                  </Text>
                  {document.featuredSchedule.approvedBy && (
                    <Text className="text-gray-600">
                      승인자: {document.featuredSchedule.approvedBy}
                    </Text>
                  )}
                </VStack>
              </Box>
            )}
          </Dialog.Body>
          
          <Dialog.Footer className="mt-6">
            <HStack className="justify-end gap-2">
              <Button variant="ghost" onClick={onClose}>
                <X size={16} className="mr-2" />
                취소
              </Button>
              <Button
                colorScheme="purple"
                onClick={handleSubmit}
                loading={isPending}
              >
                <Save size={16} className="mr-2" />
                저장
              </Button>
            </HStack>
          </Dialog.Footer>
          
          <Dialog.CloseTrigger />
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default FeaturedEditModal;