
import {Badge, Box, HStack, IconButton, Spinner, Text, VStack} from "@chakra-ui/react";
import {Clock, Globe, Heart, Trash2} from "lucide-react";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {TranslationHistory} from "../../../../types/translation/translationTypes";
import {useLikedTranslations, useToggleLike, useDeleteTranslation} from "../../../../hooks/useTranslationQueries";

export interface QuickPhraseProps {
  selectedTabNumber: number;
  onPhraseClick?: (item: TranslationHistory) => void;
}

export default function QuickPhrase(props: QuickPhraseProps) {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [likedTranslations, setLikedTranslations] = useState<TranslationHistory[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const {data: likedData, isLoading, isFetching} = useLikedTranslations(
    {
      page: currentPage,
      size: 10,
    }
  );
  
  const toggleLikeMutation = useToggleLike();
  const deleteTranslationMutation = useDeleteTranslation();
  
  const handlePhraseClick = (item: TranslationHistory) => {
    if (props.onPhraseClick) {
      props.onPhraseClick(item);
    }
  };
  
  const handleLikeToggle = async (item: TranslationHistory, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleLikeMutation.mutateAsync(item.id);
      // 좋아요 해제시 목록에서 제거
      setLikedTranslations(prev => prev.filter(h => h.id !== item.id));
    } catch (error) {
      console.log("handleLikeToggle error", error);
    }
  };
  
  const handleDelete = async (item: TranslationHistory, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteTranslationMutation.mutateAsync(item.id);
      setLikedTranslations(prev => prev.filter(h => h.id !== item.id));
    } catch (error) {
      console.log("handleDelete error", error);
    }
  };
  
  // IntersectionObserver 설정
  const setupObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    // 조건 체크
    if (!hasMoreData || isLoading || isFetching || props.selectedTabNumber !== 1) {
      return;
    }
    
    // DOM이 준비되었는지 확인
    if (!containerRef.current || !loadMoreRef.current) {
      return;
    }
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        
        if (target.isIntersecting && hasMoreData && !isFetching && !isLoading) {
          setCurrentPage(prev => prev + 1);
        }
      },
      {
        threshold: 0.1,
        root: containerRef.current,
        rootMargin: '100px',
      }
    );
    
    observerRef.current.observe(loadMoreRef.current);
    
  }, [hasMoreData, isLoading, isFetching, props.selectedTabNumber]);
  
  // 데이터 업데이트
  useEffect(() => {
    if (likedData) {
      if (currentPage === 0) {
        setLikedTranslations([...likedData.content]);
      } else {
        setLikedTranslations(prev => [...prev, ...likedData.content]);
      }
      setHasMoreData(!likedData?.last);
    }
  }, [likedData, currentPage]);
  
  // Observer 설정
  useEffect(() => {
    const timer = setTimeout(() => {
      setupObserver();
    }, 100);
    
    return () => {
      clearTimeout(timer);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [setupObserver]);
  
  // 데이터 로드 후 Observer 재설정
  useEffect(() => {
    if (likedTranslations.length > 0 && props.selectedTabNumber === 1) {
      requestAnimationFrame(() => {
        setupObserver();
      });
    }
  }, [likedTranslations.length, props.selectedTabNumber, setupObserver]);
  
  // 탭 변경시 초기화
  useEffect(() => {
    if (props.selectedTabNumber === 1) {
      setCurrentPage(0);
      setHasMoreData(true);
    }
  }, [props.selectedTabNumber]);
  
  return (
    <VStack gap={3} mt={4} h="full" maxH="40rem" overflowY="auto" ref={containerRef}>
      {likedTranslations.length === 0 && !isLoading ? (
        <Box
          textAlign="center"
          py={8}
          css={{
            background: "#f9fafb",
            borderRadius: "12px",
            border: "1px dashed #d1d5db",
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Globe size={32} color="#9ca3af" style={{ margin: "0 auto 12px" }} />
          <Text fontSize="sm" color="gray.500" mb={2}>
            No favorite translations yet
          </Text>
          <Text fontSize="xs" color="gray.400">
            Click the heart icon on translations to save them here
          </Text>
        </Box>
      ) : (
        <>
          {likedTranslations.map((item, index) => (
            <Box
              key={`${item.id}-${index}`}
              w="full"
              p={4}
              css={{
                background: "#fef3f2",
                borderRadius: "12px",
                border: "1px solid #fecaca",
                cursor: "pointer",
                transition: "all 0.2s",
                position: "relative",
                // "&:hover": {
                //   transform: "translateY(-2px)",
                //   boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                // }
              }}
              onClick={() => handlePhraseClick(item)}
            >
              <HStack justify="space-between" mb={2}>
                <HStack gap={1} color="gray.400" fontSize="xs">
                  <Clock size={12} />
                  <Text>{new Date(item.created).toLocaleDateString()}</Text>
                </HStack>
                <Badge
                  colorScheme="pink"
                  fontSize="10px"
                  borderRadius="6px"
                >
                  Favorite
                </Badge>
              </HStack>
              
              <HStack justify="space-between" align="flex-start" gap={3}>
                <VStack align="flex-start" flex={1} gap={1}>
                  <HStack gap={1} align="center">
                    <Text fontSize="xs" color="gray.500">
                      {item.sourceLanguage.toUpperCase()}
                    </Text>
                    <Text fontSize="sm" fontWeight="600" color="gray.800">
                      {item.sourceText}
                    </Text>
                  </HStack>
                  <HStack gap={2} wrap="wrap">
                    <HStack gap={1} align="center">
                      <Text fontSize="xs" color="gray.500">
                        {item.targetLanguage.toUpperCase()}
                      </Text>
                      <Text fontSize="sm" color="gray.700">
                        {item.targetText}
                      </Text>
                    </HStack>
                    {item.pronunciation && (
                      <Text fontSize="xs" color="gray.500" fontStyle="italic">
                        [{item.pronunciation}]
                      </Text>
                    )}
                  </HStack>
                </VStack>
                
                <HStack gap={1} flexShrink={0}>
                  <IconButton
                    aria-label="Remove from favorites"
                    size="sm"
                    variant="solid"
                    colorScheme="pink"
                    onClick={(e) => handleLikeToggle(item, e)}
                  >
                    <Heart
                      size={18}
                      fill="#fff"
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  </IconButton>
                  <IconButton
                    aria-label="Delete translation"
                    size="sm"
                    variant="outline"
                    colorScheme="red"
                    onClick={(e) => handleDelete(item, e)}
                  >
                    <Trash2 size={18} strokeWidth={2} />
                  </IconButton>
                </HStack>
              </HStack>
            </Box>
          ))}
          
          {/* 무한 스크롤 트리거 */}
          {hasMoreData && (
            <Box
              ref={loadMoreRef}
              w="full"
              py={4}
              textAlign="center"
            >
              {isFetching ? (
                <HStack justify="center" gap={2}>
                  <Spinner size="sm" color="pink.500" />
                  <Text fontSize="sm" color="gray.500">
                    Loading more favorites...
                  </Text>
                </HStack>
              ) : (
                <Text fontSize="xs" color="gray.400">
                  Scroll for more
                </Text>
              )}
            </Box>
          )}
          
          {!hasMoreData && likedTranslations.length > 0 && (
            <Box
              w="full"
              py={3}
              textAlign="center"
              css={{
                background: "#f9fafb",
                borderRadius: "8px",
                border: "1px dashed #d1d5db"
              }}
            >
              <Text fontSize="xs" color="gray.400">
                All favorites loaded
              </Text>
            </Box>
          )}
        </>
      )}
    </VStack>
  );
}