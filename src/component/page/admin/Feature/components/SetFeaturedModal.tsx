import React, { useState } from 'react';
import {
  Dialog,
  Input,
  Textarea,
  Button,
  VStack,
  HStack,
  Box,
  Text,
  Badge,
  Tabs,
  ColorPicker,
  FieldLabel,
  Field,
  Tag
} from '@chakra-ui/react';
import {
  Calendar,
  Image as ImageIcon,
  MapPin,
  Palette,
  Tag as TagIcon,
  Save
} from 'lucide-react';
import { useSetFeatured } from '../../../../../hooks/useFeaturedQueries';

interface SetFeaturedModalProps {
  document: DocumentDTO;
  isOpen: boolean;
  onClose: () => void;
}

const SetFeaturedModal: React.FC<SetFeaturedModalProps> = ({
                                                             document,
                                                             isOpen,
                                                             onClose
                                                           }) => {
  const { mutate: setFeatured, isPending } = useSetFeatured();
  
  const [featuredData, setFeaturedData] = useState<FeaturedRequest>({
    featuredInfo: {
      featuredTitle: document.title || '',
      featuredSubtitle: '',
      featuredImageUrl: document.thumbnailImgUrl || '',
      featuredGradientFrom: '#667eea',
      featuredGradientTo: '#764ba2',
      location: '',
      highlights: [],
      ctaButtonText: 'Details',
      displayPriority: 1
    },
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
  });
  
  const [newHighlight, setNewHighlight] = useState('');
  
  const handleSubmit = () => {
    setFeatured(
      {
        id: document.id!,
        data: featuredData
      },
      {
        onSuccess: () => {
          onClose();
        }
      }
    );
  };
  
  const updateFeaturedInfo = (field: string, value: any) => {
    setFeaturedData(prev => ({
      ...prev,
      featuredInfo: {
        ...prev.featuredInfo,
        [field]: value
      }
    }));
  };
  
  const addHighlight = () => {
    if (newHighlight.trim()) {
      updateFeaturedInfo('highlights', [
        ...(featuredData.featuredInfo?.highlights || []),
        newHighlight.trim()
      ]);
      setNewHighlight('');
    }
  };
  
  const removeHighlight = (index: number) => {
    const highlights = featuredData.featuredInfo?.highlights || [];
    updateFeaturedInfo(
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
              Featured 콘텐츠 설정
            </Dialog.Title>
            <Dialog.Description className="text-gray-600">
              홈페이지에 특별하게 노출될 콘텐츠의 정보를 설정합니다
            </Dialog.Description>
          </Dialog.Header>
          
          <Dialog.Body className="mt-6">
            <Tabs.Root defaultValue="basic" className="w-full">
              <Tabs.List className="mb-6">
                <Tabs.Trigger value="basic">기본 정보</Tabs.Trigger>
                <Tabs.Trigger value="visual">비주얼 설정</Tabs.Trigger>
                <Tabs.Trigger value="schedule">스케줄</Tabs.Trigger>
              </Tabs.List>
              
              {/* 기본 정보 탭 */}
              <Tabs.Content value="basic">
                <VStack className="gap-4">
                  <Field.Root className="w-full">
                    <FieldLabel>Featured 제목</FieldLabel>
                    <Input
                      placeholder="메인에 표시될 제목"
                      value={featuredData.featuredInfo?.featuredTitle}
                      onChange={(e) => updateFeaturedInfo('featuredTitle', e.target.value)}
                    />
                    <Field.HelperText>
                      비워두면 원본 제목이 사용됩니다
                    </Field.HelperText>
                  </Field.Root>
                  
                  <Field.Root className="w-full">
                    <FieldLabel>부제목</FieldLabel>
                    <Input
                      placeholder="간단한 설명 텍스트"
                      value={featuredData.featuredInfo?.featuredSubtitle}
                      onChange={(e) => updateFeaturedInfo('featuredSubtitle', e.target.value)}
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
                      value={featuredData.featuredInfo?.location}
                      onChange={(e) => updateFeaturedInfo('location', e.target.value)}
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
                      {featuredData.featuredInfo?.highlights?.map((highlight, idx) => (
                        <Tag.Root
                          key={idx}
                          colorPalette="purple"
                          size="md"
                        >
                          <Tag.Label>{highlight}</Tag.Label>
                          <Tag.CloseTrigger onClick={() => removeHighlight(idx)} />
                        </Tag.Root>
                      ))}
                    </HStack>
                  </Field.Root>
                  
                  <Field.Root className="w-full">
                    <FieldLabel>CTA 버튼 텍스트</FieldLabel>
                    <Input
                      placeholder="Details"
                      value={featuredData.featuredInfo?.ctaButtonText}
                      onChange={(e) => updateFeaturedInfo('ctaButtonText', e.target.value)}
                    />
                  </Field.Root>
                  
                  <Field.Root className="w-full">
                    <FieldLabel>우선순위</FieldLabel>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={featuredData.featuredInfo?.displayPriority}
                      onChange={(e) => updateFeaturedInfo('displayPriority', parseInt(e.target.value))}
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
                      value={featuredData.featuredInfo?.featuredImageUrl}
                      onChange={(e) => updateFeaturedInfo('featuredImageUrl', e.target.value)}
                    />
                  </Field.Root>
                  
                  {featuredData.featuredInfo?.featuredImageUrl && (
                    <Box className="w-full rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={featuredData.featuredInfo.featuredImageUrl}
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
                          value={featuredData.featuredInfo?.featuredGradientFrom}
                          onChange={(e) => updateFeaturedInfo('featuredGradientFrom', e.target.value)}
                          className="h-10 cursor-pointer"
                        />
                        <Input
                          value={featuredData.featuredInfo?.featuredGradientFrom}
                          onChange={(e) => updateFeaturedInfo('featuredGradientFrom', e.target.value)}
                          className="mt-2"
                          placeholder="#667eea"
                        />
                      </Box>
                      
                      <Box className="flex-1">
                        <Text className="text-sm mb-2">끝 색상</Text>
                        <Input
                          type="color"
                          value={featuredData.featuredInfo?.featuredGradientTo}
                          onChange={(e) => updateFeaturedInfo('featuredGradientTo', e.target.value)}
                          className="h-10 cursor-pointer"
                        />
                        <Input
                          value={featuredData.featuredInfo?.featuredGradientTo}
                          onChange={(e) => updateFeaturedInfo('featuredGradientTo', e.target.value)}
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
                      background: `linear-gradient(135deg, ${featuredData.featuredInfo?.featuredGradientFrom} 0%, ${featuredData.featuredInfo?.featuredGradientTo} 100%)`
                    }}
                  />
                </VStack>
              </Tabs.Content>
              
              {/* 스케줄 탭 */}
              <Tabs.Content value="schedule">
                <VStack className="gap-4">
                  <Field.Root className="w-full">
                    <FieldLabel>
                      <HStack>
                        <Calendar size={16} />
                        <Text>시작 일시</Text>
                      </HStack>
                    </FieldLabel>
                    <Input
                      type="datetime-local"
                      value={featuredData.startDate}
                      onChange={(e) => setFeaturedData(prev => ({
                        ...prev,
                        startDate: e.target.value
                      }))}
                    />
                  </Field.Root>
                  
                  <Field.Root className="w-full">
                    <FieldLabel>
                      <HStack>
                        <Calendar size={16} />
                        <Text>종료 일시</Text>
                      </HStack>
                    </FieldLabel>
                    <Input
                      type="datetime-local"
                      value={featuredData.endDate}
                      onChange={(e) => setFeaturedData(prev => ({
                        ...prev,
                        endDate: e.target.value
                      }))}
                    />
                  </Field.Root>
                  
                  <Box className="w-full p-4 bg-blue-50 rounded-lg">
                    <Text className="text-sm text-blue-800">
                      설정된 기간 동안 홈페이지에 Featured 콘텐츠로 노출됩니다.
                      종료 일시가 되면 자동으로 Featured에서 제외됩니다.
                    </Text>
                  </Box>
                </VStack>
              </Tabs.Content>
            </Tabs.Root>
            
            {/* Preview Section */}
            <Box className="mt-6 p-4 border border-gray-200 rounded-lg">
              <Text className="font-semibold mb-2">미리보기</Text>
              <Box className="bg-gray-50 p-3 rounded">
                <Text className="font-bold text-lg">
                  {featuredData.featuredInfo?.featuredTitle || document.title}
                </Text>
                {featuredData.featuredInfo?.featuredSubtitle && (
                  <Text className="text-gray-600 text-sm mt-1">
                    {featuredData.featuredInfo.featuredSubtitle}
                  </Text>
                )}
                {featuredData.featuredInfo?.location && (
                  <Badge className="mt-2" variant="subtle">
                    📍 {featuredData.featuredInfo.location}
                  </Badge>
                )}
              </Box>
            </Box>
          </Dialog.Body>
          
          <Dialog.Footer className="mt-6">
            <HStack className="justify-end gap-2">
              <Button variant="ghost" onClick={onClose}>
                취소
              </Button>
              <Button
                colorScheme="purple"
                onClick={handleSubmit}
                loading={isPending}
              >
                <Save size={16} className="mr-2" />
                Featured 설정
              </Button>
            </HStack>
          </Dialog.Footer>
          
          <Dialog.CloseTrigger />
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default SetFeaturedModal;