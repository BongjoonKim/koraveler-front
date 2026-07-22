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
import { homeTokens, chakraDark } from '../../adminUi';

const t = homeTokens;

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
    // 기본 그라데이션은 브랜드 히어로 톤 (보라 legacy 대체)
    featuredGradientFrom: t.color.heroTop,
    featuredGradientTo: t.color.heroBottom,
    location: '',
    highlights: [],
    ctaButtonText: 'Details',
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
      <Dialog.Backdrop bg="blackAlpha.700" />
      <Dialog.Positioner>
        <Dialog.Content maxW="3xl" maxH="90vh" overflowY="auto" {...chakraDark.dialogContent}>
          <Dialog.Header borderBottomWidth="1px" borderColor={t.color.border} pb={3}>
            <Dialog.Title fontSize="2xl" fontWeight="bold" fontFamily={t.font.serif} color={t.color.text}>
              Featured 정보 수정
            </Dialog.Title>
            <Dialog.Description color={t.color.textMuted}>
              Featured 콘텐츠의 표시 정보를 수정합니다
            </Dialog.Description>
          </Dialog.Header>

          <Dialog.Body mt={6}>
            <Tabs.Root defaultValue="basic" w="full">
              <Tabs.List mb={6} borderBottomWidth="1px" borderColor={t.color.border}>
                <Tabs.Trigger value="basic" {...chakraDark.tabTrigger}>기본 정보</Tabs.Trigger>
                <Tabs.Trigger value="visual" {...chakraDark.tabTrigger}>비주얼 설정</Tabs.Trigger>
              </Tabs.List>

              {/* 기본 정보 탭 */}
              <Tabs.Content value="basic">
                <VStack gap={4}>
                  <Field.Root w="full">
                    <FieldLabel {...chakraDark.label}>Featured 제목</FieldLabel>
                    <Input
                      placeholder="메인에 표시될 제목"
                      value={featuredInfo.featuredTitle}
                      onChange={(e) => updateField('featuredTitle', e.target.value)}
                      {...chakraDark.input}
                    />
                    <Field.HelperText {...chakraDark.helperText}>
                      원본 제목: {document.title}
                    </Field.HelperText>
                  </Field.Root>

                  <Field.Root w="full">
                    <FieldLabel {...chakraDark.label}>부제목</FieldLabel>
                    <Input
                      placeholder="간단한 설명 텍스트"
                      value={featuredInfo.featuredSubtitle}
                      onChange={(e) => updateField('featuredSubtitle', e.target.value)}
                      {...chakraDark.input}
                    />
                  </Field.Root>

                  <Field.Root w="full">
                    <FieldLabel {...chakraDark.label}>
                      <HStack>
                        <MapPin size={16} />
                        <Text>위치 정보</Text>
                      </HStack>
                    </FieldLabel>
                    <Input
                      placeholder="예: 서울, 제주도"
                      value={featuredInfo.location}
                      onChange={(e) => updateField('location', e.target.value)}
                      {...chakraDark.input}
                    />
                  </Field.Root>

                  <Field.Root w="full">
                    <FieldLabel {...chakraDark.label}>
                      <HStack>
                        <TagIcon size={16} />
                        <Text>하이라이트 태그</Text>
                      </HStack>
                    </FieldLabel>
                    <HStack w="full">
                      <Input
                        placeholder="추가할 태그 입력"
                        value={newHighlight}
                        onChange={(e) => setNewHighlight(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addHighlight()}
                        {...chakraDark.input}
                      />
                      <Button onClick={addHighlight} size="sm" {...chakraDark.primaryBtn}>추가</Button>
                    </HStack>
                    <HStack flexWrap="wrap" gap={2} mt={2}>
                      {featuredInfo.highlights?.map((highlight, idx) => (
                        <Tag.Root
                          key={idx}
                          bg={t.color.badgeBg}
                          color={t.color.badgeText}
                          borderRadius={t.radius.pill}
                        >
                          <Tag.Label>
                            {highlight}
                          </Tag.Label>
                          <Tag.CloseTrigger onClick={() => removeHighlight(idx)} />
                        </Tag.Root>
                      ))}
                    </HStack>
                  </Field.Root>

                  <Field.Root w="full">
                    <FieldLabel {...chakraDark.label}>CTA 버튼 텍스트</FieldLabel>
                    <Input
                      placeholder="Details"
                      value={featuredInfo.ctaButtonText}
                      onChange={(e) => updateField('ctaButtonText', e.target.value)}
                      {...chakraDark.input}
                    />
                  </Field.Root>

                  <Field.Root w="full">
                    <FieldLabel {...chakraDark.label}>우선순위</FieldLabel>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={featuredInfo.displayPriority}
                      onChange={(e) => updateField('displayPriority', parseInt(e.target.value))}
                      {...chakraDark.input}
                    />
                    <Field.HelperText {...chakraDark.helperText}>
                      숫자가 작을수록 먼저 표시됩니다 (1-10)
                    </Field.HelperText>
                  </Field.Root>
                </VStack>
              </Tabs.Content>

              {/* 비주얼 설정 탭 */}
              <Tabs.Content value="visual">
                <VStack gap={4}>
                  <Field.Root w="full">
                    <FieldLabel {...chakraDark.label}>
                      <HStack>
                        <ImageIcon size={16} />
                        <Text>히어로 이미지 URL</Text>
                      </HStack>
                    </FieldLabel>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={featuredInfo.featuredImageUrl}
                      onChange={(e) => updateField('featuredImageUrl', e.target.value)}
                      {...chakraDark.input}
                    />
                  </Field.Root>

                  {featuredInfo.featuredImageUrl && (
                    <Box
                      w="full"
                      borderRadius={t.radius.lg}
                      overflow="hidden"
                      borderWidth="1px"
                      borderColor={t.color.border}
                    >
                      <img
                        src={featuredInfo.featuredImageUrl}
                        alt="Preview"
                        style={{ width: "100%", height: "12rem", objectFit: "cover" }}
                      />
                    </Box>
                  )}

                  <Field.Root w="full">
                    <FieldLabel {...chakraDark.label}>
                      <HStack>
                        <Palette size={16} />
                        <Text>그라디언트 색상</Text>
                      </HStack>
                    </FieldLabel>

                    <HStack w="full" gap={4}>
                      <Box flex={1}>
                        <Text fontSize="sm" mb={2} color={t.color.textSoft}>시작 색상</Text>
                        <Input
                          type="color"
                          value={featuredInfo.featuredGradientFrom}
                          onChange={(e) => updateField('featuredGradientFrom', e.target.value)}
                          h="10"
                          cursor="pointer"
                          {...chakraDark.input}
                        />
                        <Input
                          value={featuredInfo.featuredGradientFrom}
                          onChange={(e) => updateField('featuredGradientFrom', e.target.value)}
                          mt={2}
                          placeholder={t.color.heroTop}
                          {...chakraDark.input}
                        />
                      </Box>

                      <Box flex={1}>
                        <Text fontSize="sm" mb={2} color={t.color.textSoft}>끝 색상</Text>
                        <Input
                          type="color"
                          value={featuredInfo.featuredGradientTo}
                          onChange={(e) => updateField('featuredGradientTo', e.target.value)}
                          h="10"
                          cursor="pointer"
                          {...chakraDark.input}
                        />
                        <Input
                          value={featuredInfo.featuredGradientTo}
                          onChange={(e) => updateField('featuredGradientTo', e.target.value)}
                          mt={2}
                          placeholder={t.color.heroBottom}
                          {...chakraDark.input}
                        />
                      </Box>
                    </HStack>
                  </Field.Root>

                  {/* Gradient Preview */}
                  <Box
                    w="full"
                    h="24"
                    borderRadius={t.radius.lg}
                    style={{
                      background: `linear-gradient(135deg, ${featuredInfo.featuredGradientFrom} 0%, ${featuredInfo.featuredGradientTo} 100%)`
                    }}
                  />
                </VStack>
              </Tabs.Content>
            </Tabs.Root>

            {/* Current Schedule Info */}
            {document.featuredSchedule && (
              <Box mt={6} p={4} bg={t.color.surface2} borderRadius={t.radius.lg} borderWidth="1px" borderColor={t.color.border}>
                <Text fontWeight="semibold" mb={2} color={t.color.textSoft}>현재 스케줄</Text>
                <VStack gap={1} fontSize="sm" align="start" color={t.color.text}>
                  <Text>
                    시작: {new Date(document.featuredSchedule.startDate!).toLocaleString('ko-KR')}
                  </Text>
                  <Text>
                    종료: {new Date(document.featuredSchedule.endDate!).toLocaleString('ko-KR')}
                  </Text>
                  {document.featuredSchedule.approvedBy && (
                    <Text color={t.color.textMuted}>
                      승인자: {document.featuredSchedule.approvedBy}
                    </Text>
                  )}
                </VStack>
              </Box>
            )}
          </Dialog.Body>

          <Dialog.Footer mt={6} borderTopWidth="1px" borderColor={t.color.border} pt={3}>
            <HStack justify="flex-end" gap={2}>
              <Button variant="ghost" onClick={onClose} {...chakraDark.ghostBtn}>
                <X size={16} />
                취소
              </Button>
              <Button
                onClick={handleSubmit}
                loading={isPending}
                {...chakraDark.primaryBtn}
              >
                <Save size={16} />
                저장
              </Button>
            </HStack>
          </Dialog.Footer>

          <Dialog.CloseTrigger color={t.color.textMuted} _hover={{ color: t.color.text, bg: "whiteAlpha.100" }} />
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default FeaturedEditModal;
