import {Badge, Box, HStack, Spinner, Text, VStack} from "@chakra-ui/react";
import {Clock, History} from "lucide-react";
import React, {useEffect, useRef, useState} from "react";
import {TranslationHistory} from "../../../../types/translation/translationTypes";
import {useTranslationHistory} from "../../../../hooks/useTranslationQueries";

export interface LangHistoryProps {
  selectedTabNumber : number;
}

export default function LangHistory(props : LangHistoryProps) {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [serverHistory, setServerHistory] = useState<TranslationHistory[]>([])
  const [hasMoreHistory, setHasMoreHistory] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null); // 스크롤 컨테이너 ref 추가
  
  const {data : historyData, isLoading, isFetching} = useTranslationHistory(
    {
      page : currentPage,
      size: 10,
    },
    props.selectedTabNumber === 2,
  )
  
  const handleHistoryClick = (props : TranslationHistory) => {
  
  }
  
  useEffect(() => {
    if (historyData) {
      if (currentPage === 0) {
        setServerHistory([...historyData.content]);
      } else {
        setServerHistory(prev => [...prev, ...historyData.content])
      }
    }
    setHasMoreHistory(!historyData?.last)
  }, [historyData, currentPage]);
  
  useEffect(() => {
    if (!hasMoreHistory || isLoading || isFetching || props.selectedTabNumber !== 2) {
      return;
    }
    
    if (observerRef.current) {
      observerRef.current?.disconnect();
    }
    
    observerRef.current = new IntersectionObserver((entries : any) => {
      const target = entries[0]
      console.log('Intersection detected:', {
        isIntersecting: target.isIntersecting,
        hasMoreHistory,
        isFetching,
        currentPage
      });
      if (entries[0].isIntersecting && hasMoreHistory && !isFetching) {
        setCurrentPage(prev => prev + 1);
      }
    }, {
      threshold: 0.5,
      root: containerRef.current, // viewport를 root로 사용
      rootMargin: '100px', // 100px 전에 미리 로드
    })
    
    if (loadMoreRef.current) {
      observerRef.current?.observe(loadMoreRef.current)
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current?.disconnect();
      }
    }
  }, [hasMoreHistory, isLoading, isFetching, props.selectedTabNumber])
  
  // 탭 변경 시 이력 초기화
  useEffect(() => {
    if (props.selectedTabNumber === 2) {
      setCurrentPage(0);
      setHasMoreHistory(true);
    }
  }, [props.selectedTabNumber]);
  
  // const handleHistoryClick = (item: any) => {
  //   if (props.onHistoryItemClick) {
  //     props.onHistoryItemClick(item.sourceText, item.targetText);
  //   }
  // };
  
  return (
    <VStack gap={3} mt={4} h="20rem" overflowY="auto" ref={containerRef}>
      {serverHistory.length === 0 && !isLoading ? (
        <Box
          textAlign="center"
          py={8}
          css={{
            // background: "#f9fafb",
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
          {serverHistory.map((item, index) => (
            <Box
              key={`${item.id}-${index}`}
              w="full"
              p={3}
              css={{
                background: index === 0 ? "linear-gradient(135deg, #f3f4f6 0%, #f9fafb 100%)" : "#f9fafb",
                borderRadius: "12px",
                border: index === 0 ? "2px solid #6366f1" : "1px solid #e5e7eb",
                cursor: "pointer",
                transition: "all 0.2s",
                position: "relative",
                height: "100%",
                // overflow: "hidden",
                "&:hover": {
                  background: "white",
                  borderColor: "#6366f1",
                  transform: "translateX(4px)",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                }
              }}
              onClick={() => handleHistoryClick(item)}
            >
              {index === 0 && (
                <Badge
                  css={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    fontSize: "10px",
                    padding: "2px 8px",
                    borderRadius: "6px"
                  }}
                >
                  Latest
                </Badge>
              )}
              <HStack justify="space-between" mb={1}>
                <Text fontSize="sm" fontWeight="600" color="gray.800">
                  {item.sourceText}
                </Text>
                <HStack gap={1} color="gray.400">
                  <Clock size={12} />
                  <Text fontSize="xs">
                    {new Date(item.created).toLocaleTimeString()}
                  </Text>
                </HStack>
              </HStack>
              <Text fontSize="sm" color="gray.600">
                → {item.targetText}
              </Text>
            </Box>
          ))}
          
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