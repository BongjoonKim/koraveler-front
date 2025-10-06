import {Badge, Box, HStack, IconButton, Spinner, Text, useToastStyles, VStack} from "@chakra-ui/react";
import {Clock, Heart, History, Trash2} from "lucide-react";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {TranslationHistory} from "../../../../types/translation/translationTypes";
import {useTranslationHistory, useToggleLike, useDeleteTranslation} from "../../../../hooks/useTranslationQueries";
import CusIconButton from "../../../elements/buttons/CusIconButton";

export interface LangHistoryProps {
  selectedTabNumber : number;
}

export default function LangHistory(props : LangHistoryProps) {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [serverHistory, setServerHistory] = useState<TranslationHistory[]>([])
  const [hasMoreHistory, setHasMoreHistory] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const {data : historyData, isLoading, isFetching} = useTranslationHistory(
    {
      page : currentPage,
      size: 10,
    },
    props.selectedTabNumber === 2,
  )
  const toggleLikeMutation = useToggleLike();
  const deleteTranslationMutation = useDeleteTranslation();
  
  const handleHistoryClick = (props : TranslationHistory) => {
  
  }
  
  const handleLikeToggle = async (item: TranslationHistory, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await toggleLikeMutation.mutateAsync(item.id);
      setServerHistory(prev =>
        prev.map(h => h.id === item.id ? response.data : h)
      );
    } catch (error) {
      console.log("handleLikeToggle error", error)
    }
  };
  
  const handleDelete = async (item: TranslationHistory, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteTranslationMutation.mutateAsync(item.id);
      setServerHistory(prev => prev.filter(h => h.id !== item.id));
    } catch (error) {
      console.log("handleDelete error", error)
    }
  };
  
  // IntersectionObserver 설정
  const setupObserver = useCallback(() => {
    // 이전 observer 정리
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    console.log("props.selectedTabNumber", props.selectedTabNumber)
    console.log("hasMoreHistory", hasMoreHistory)
    console.log("isFetching", isFetching)
    console.log("isLoading", isLoading)
    
    // 조건 체크
    if (!hasMoreHistory || isLoading || isFetching || props.selectedTabNumber !== 2) {
      return;
    }
    
    // DOM이 준비되었는지 확인 🔥
    if (!containerRef.current || !loadMoreRef.current) {
      return;
    }
    
    // 새 observer 생성
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        console.log('Intersection detected:', {
          isIntersecting: target.isIntersecting,
          hasMoreHistory,
          isFetching,
          isLoading,
          currentPage,
          containerHeight: containerRef.current?.scrollHeight,
          containerClientHeight: containerRef.current?.clientHeight,
        });
        
        if (target.isIntersecting && hasMoreHistory && !isFetching && !isLoading) {
          console.log('Loading next page:', currentPage + 1);
          setCurrentPage(prev => prev + 1);
        }
      },
      {
        threshold: 0.1,
        root: containerRef.current, // 이제 null이 아님을 보장
        rootMargin: '100px',
      }
    );
    
    // observer 연결
    observerRef.current.observe(loadMoreRef.current);
    console.log('Observer attached successfully');
    
  }, [hasMoreHistory, isLoading, isFetching, props.selectedTabNumber, currentPage]);
  
  useEffect(() => {
    if (historyData) {
      if (currentPage === 0) {
        setServerHistory([...historyData.content]);
      } else {
        setServerHistory(prev => [...prev, ...historyData.content])
      }
      setHasMoreHistory(!historyData?.last);
    }
  }, [historyData, currentPage]);
  
  // Observer 설정을 위한 별도의 useEffect 🔥
  useEffect(() => {
    // DOM이 렌더링된 후 약간의 지연을 주고 observer 설정
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
  
  // 데이터가 로드되고 DOM이 업데이트된 후 observer 재설정 🔥
  useEffect(() => {
    if (serverHistory.length > 0 && props.selectedTabNumber === 2) {
      // DOM 업데이트를 기다린 후 observer 재설정
      requestAnimationFrame(() => {
        setupObserver();
      });
    }
  }, [serverHistory.length, props.selectedTabNumber, setupObserver]);
  
  // 탭 변경 시 이력 초기화
  useEffect(() => {
    if (props.selectedTabNumber === 2) {
      setCurrentPage(0);
      setHasMoreHistory(true);
    }
  }, [props.selectedTabNumber]);
  
  return (
    <VStack gap={3} mt={4} h="20rem" overflowY="auto" ref={containerRef}>
      {serverHistory.length === 0 && !isLoading ? (
        <Box
          textAlign="center"
          py={8}
          css={{
            borderRadius: "12px",
            border: "1px dashed #d1d5db",
            height: "100%",
            width: "100%",
            alignItems: "center"
          }}
        >
          <History size={32} color="#9ca3af" style={{ margin: "0 auto 12px" }} />
          <Text fontSize="sm" color="gray.500">
            No translation history yet
          </Text>
        </Box>
      ) : (
        <>
          {serverHistory.map((item, index) => {
            return (
              <Box
                key={`${item.id}-${index}`}
                w="full"
                p={4}
                css={{
                  background: "#fafbfc",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  position: "relative",
                }}
                onClick={() => handleHistoryClick(item)}
              >
                <HStack justify="space-between" mb={2}>
                  <HStack gap={1} color="gray.400" fontSize="xs">
                    <Clock size={12} />
                    <Text>{new Date(item.created).toLocaleTimeString()}</Text>
                  </HStack>
                  {index === 0 && (
                    <Badge
                      colorScheme="purple"
                      fontSize="10px"
                      borderRadius="6px"
                    >
                      Latest
                    </Badge>
                  )}
                </HStack>
                
                <HStack justify="space-between" align="flex-start" gap={3}>
                  <VStack align="flex-start" flex={1} gap={1}>
                    <Text fontSize="sm" fontWeight="600" color="gray.800">
                      {item.sourceText}
                    </Text>
                    <HStack gap={2} wrap="wrap">
                      <Text fontSize="sm" color="gray.600">
                        → {item.targetText}
                      </Text>
                      {item.pronunciation && (
                        <Text fontSize="xs" color="gray.500" fontStyle="italic">
                          [{item.pronunciation}]
                        </Text>
                      )}
                    </HStack>
                  </VStack>
                  
                  <HStack gap={1} flexShrink={0}>
                    <IconButton
                      aria-label="Toggle like"
                      size="sm"
                      variant="outline"
                      colorScheme={item.liked ? "pink" : "gray"}
                      onClick={(e) => handleLikeToggle(item, e)}
                    >
                      <Heart
                        size={18}
                        fill={item.liked ? "#ec4899" : "none"}
                        stroke={item.liked ? "#ec4899" : "#4b5563"}
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
            )})}
          
          {/* 무한 스크롤 트리거 요소 */}
          {hasMoreHistory && (
            <Box
              ref={loadMoreRef}
              w="full"
              py={4}
              textAlign="center"
            >
              {isFetching ? (
                <HStack justify="center" gap={2}>
                  <Spinner size="sm" color="purple.500" />
                  <Text fontSize="sm" color="gray.500">
                    Loading more...
                  </Text>
                </HStack>
              ) : (
                <Text fontSize="xs" color="gray.400">
                  Scroll for more
                </Text>
              )}
            </Box>
          )}
          
          {!hasMoreHistory && serverHistory.length > 0 && (
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
                No more history
              </Text>
            </Box>
          )}
        </>
      )}
    </VStack>
  )
}