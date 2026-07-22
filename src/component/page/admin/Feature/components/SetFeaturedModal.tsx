import React, { useState } from 'react';
import {
  Dialog,
  Input,
  Button,
  VStack,
  HStack,
  Box,
  Text,
  Badge,
  Tabs,
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
import { homeTokens, chakraDark } from '../../adminUi';

const t = homeTokens;

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
      // 기본 그라데이션은 브랜드 히어로 톤 (보라 legacy 대체)
      featuredGradientFrom: t.color.heroTop,
      featuredGradientTo: t.color.heroBottom,
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
      <Dialog.Backdrop bg="blackAlpha.700" />
      <Dialog.Positioner>
        <Dialog.Content maxW="3xl" maxH="90vh" overflowY="auto" {...chakraDark.dialogContent}>
          <Dialog.Header borderBottomWidth="1px" borderColor={t.color.border} pb={3}>
            <Dialog.Title fontSize="2xl" fontWeight="bold" fontFamily={t.font.serif} color={t.color.text}>
              Featured 콘텐츠 설정
            </Dialog.Title>
            <Dialog.Description color={t.color.textMuted}>
              홈페이지에 특별하게 노출될 콘텐츠의 정보를 설정합니다
            </Dialog.Description>
          </Dialog.Header>

          <Dialog.Body mt={6}>
            <Tabs.Root defaultValue="basic" w="full">
              <Tabs.List mb={6} borderBottomWidth="1px" borderColor={t.color.border}>
                <Tabs.Trigger value="basic" {...chakraDark.tabTrigger}>기본 정보</Tabs.Trigger>
                <Tabs.Trigger value="visual" {...chakraDark.tabTrigger}>비주얼 설정</Tabs.Trigger>
                <Tabs.Trigger value="schedule" {...chakraDark.tabTrigger}>스케줄</Tabs.Trigger>
              </Tabs.List>

              {/* 기본 정보 탭 */}
              <Tabs.Content value="basic">
                <VStack gap={4}>
                  <Field.Root w="full">
                    <FieldLabel {...chakraDark.label}>Featured 제목</FieldLabel>
                    <Input
                      placeholder="메인에 표시될 제목"
                      value={featuredData.featuredInfo?.featuredTitle}
                      onChange={(e) => updateFeaturedInfo('featuredTitle', e.target.value)}
                      {...chakraDark.input}
                    />
                    <Field.HelperText {...chakraDark.helperText}>
                      비워두면 원본 제목이 사용됩니다
                    </Field.HelperText>
                  </Field.Root>

                  <Field.Root w="full">
                    <FieldLabel {...chakraDark.label}>부제목</FieldLabel>
                    <Input
                      placeholder="간단한 설명 텍스트"
                      value={featuredData.featuredInfo?.featuredSubtitle}
                      onChange={(e) => updateFeaturedInfo('featuredSubtitle', e.target.value)}
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
                      value={featuredData.featuredInfo?.location}
                      onChange={(e) => updateFeaturedInfo('location', e.target.value)}
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
                      {featuredData.featuredInfo?.highlights?.map((highlight, idx) => (
                        <Tag.Root
                          key={idx}
                          size="md"
                          bg={t.color.badgeBg}
                          color={t.color.badgeText}
                          borderRadius={t.radius.pill}
                        >
                          <Tag.Label>{highlight}</Tag.Label>
                          <Tag.CloseTrigger onClick={() => removeHighlight(idx)} />
                        </Tag.Root>
                      ))}
                    </HStack>
                  </Field.Root>

                  <Field.Root w="full">
                    <FieldLabel {...chakraDark.label}>CTA 버튼 텍스트</FieldLabel>
                    <Input
                      placeholder="Details"
                      value={featuredData.featuredInfo?.ctaButtonText}
                      onChange={(e) => updateFeaturedInfo('ctaButtonText', e.target.value)}
                      {...chakraDark.input}
                    />
                  </Field.Root>

                  <Field.Root w="full">
                    <FieldLabel {...chakraDark.label}>우선순위</FieldLabel>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={featuredData.featuredInfo?.displayPriority}
                      onChange={(e) => updateFeaturedInfo('displayPriority', parseInt(e.target.value))}
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
                      value={featuredData.featuredInfo?.featuredImageUrl}
                      onChange={(e) => updateFeaturedInfo('featuredImageUrl', e.target.value)}
                      {...chakraDark.input}
                    />
                  </Field.Root>

                  {featuredData.featuredInfo?.featuredImageUrl && (
                    <Box
                      w="full"
                      borderRadius={t.radius.lg}
                      overflow="hidden"
                      borderWidth="1px"
                      borderColor={t.color.border}
                    >
                      <img
                        src={featuredData.featuredInfo.featuredImageUrl}
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
                          value={featuredData.featuredInfo?.featuredGradientFrom}
                          onChange={(e) => updateFeaturedInfo('featuredGradientFrom', e.target.value)}
                          h="10"
                          cursor="pointer"
                          {...chakraDark.input}
                        />
                        <Input
                          value={featuredData.featuredInfo?.featuredGradientFrom}
                          onChange={(e) => updateFeaturedInfo('featuredGradientFrom', e.target.value)}
                          mt={2}
                          placeholder={t.color.heroTop}
                          {...chakraDark.input}
                        />
                      </Box>

                      <Box flex={1}>
                        <Text fontSize="sm" mb={2} color={t.color.textSoft}>끝 색상</Text>
                        <Input
                          type="color"
                          value={featuredData.featuredInfo?.featuredGradientTo}
                          onChange={(e) => updateFeaturedInfo('featuredGradientTo', e.target.value)}
                          h="10"
                          cursor="pointer"
                          {...chakraDark.input}
                        />
                        <Input
                          value={featuredData.featuredInfo?.featuredGradientTo}
                          onChange={(e) => updateFeaturedInfo('featuredGradientTo', e.target.value)}
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
                      background: `linear-gradient(135deg, ${featuredData.featuredInfo?.featuredGradientFrom} 0%, ${featuredData.featuredInfo?.featuredGradientTo} 100%)`
                    }}
                  />
                </VStack>
              </Tabs.Content>

              {/* 스케줄 탭 */}
              <Tabs.Content value="schedule">
                <VStack gap={4}>
                  <Field.Root w="full">
                    <FieldLabel {...chakraDark.label}>
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
                      {...chakraDark.input}
                    />
                  </Field.Root>

                  <Field.Root w="full">
                    <FieldLabel {...chakraDark.label}>
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
                      {...chakraDark.input}
                    />
                  </Field.Root>

                  <Box w="full" p={4} bg={t.color.badgeBg} borderRadius={t.radius.lg}>
                    <Text fontSize="sm" color={t.color.badgeText}>
                      설정된 기간 동안 홈페이지에 Featured 콘텐츠로 노출됩니다.
                      종료 일시가 되면 자동으로 Featured에서 제외됩니다.
                    </Text>
                  </Box>
                </VStack>
              </Tabs.Content>
            </Tabs.Root>

            {/* Preview Section */}
            <Box mt={6} p={4} borderWidth="1px" borderColor={t.color.border} borderRadius={t.radius.lg}>
              <Text fontWeight="semibold" mb={2} color={t.color.textSoft}>미리보기</Text>
              <Box bg={t.color.surface2} p={3} borderRadius={t.radius.md}>
                <Text fontWeight="bold" fontSize="lg" fontFamily={t.font.serif} color={t.color.text}>
                  {featuredData.featuredInfo?.featuredTitle || document.title}
                </Text>
                {featuredData.featuredInfo?.featuredSubtitle && (
                  <Text color={t.color.textMuted} fontSize="sm" mt={1}>
                    {featuredData.featuredInfo.featuredSubtitle}
                  </Text>
                )}
                {featuredData.featuredInfo?.location && (
                  <Badge
                    mt={2}
                    bg={t.color.badgeBg}
                    color={t.color.badgeText}
                    borderRadius={t.radius.pill}
                    px={2.5}
                  >
                    📍 {featuredData.featuredInfo.location}
                  </Badge>
                )}
              </Box>
            </Box>
          </Dialog.Body>

          <Dialog.Footer mt={6} borderTopWidth="1px" borderColor={t.color.border} pt={3}>
            <HStack justify="flex-end" gap={2}>
              <Button variant="ghost" onClick={onClose} {...chakraDark.ghostBtn}>
                취소
              </Button>
              <Button
                onClick={handleSubmit}
                loading={isPending}
                {...chakraDark.primaryBtn}
              >
                <Save size={16} />
                Featured 설정
              </Button>
            </HStack>
          </Dialog.Footer>

          <Dialog.CloseTrigger color={t.color.textMuted} _hover={{ color: t.color.text, bg: "whiteAlpha.100" }} />
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default SetFeaturedModal;
