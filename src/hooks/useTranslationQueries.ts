import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import useAuthEP from '../utils/useAuthEP';
import {
  translateText,
  getTranslationHistory,
  getLikedTranslations,
  toggleLike,
  deleteTranslation,
  deleteTranslations,
  searchTranslations,
  getTranslationsByLanguage,
  getQuickPhrases,
  getLanguageStatistics,
  getTranslationStatistics,
  getDailyTranslationCount,
  exportTranslations,
  findSimilarTranslations,
  deleteAllTranslations,
} from '../endpoints/translation-endpoints';
import {
  TranslationRequest,
  TranslationResponse,
  TranslationHistory,
  QuickPhrase,
  LanguageStatistics,
  TranslationStatistics,
  PageResponse
} from '../types/translation/translationTypes';
import {AxiosResponse} from "axios";

// ===== 번역 기능 =====

// 텍스트 번역
export const useTranslateQueries = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  
  return useMutation<AxiosResponse<TranslationResponse>, Error, TranslationRequest>({
    mutationFn: (data: TranslationRequest) =>
      authEP({
        func: translateText,
        reqBody: data
      }),
    onSuccess: (response) => {
      // 번역 이력 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['translationHistory'] });
      
      // 자주 사용하는 구문 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['quickPhrases'] });
      
      console.log('Translation successful:', response.data);
    },
    onError: (error) => {
      console.error('Translation failed:', error);
    }
  });
};

// ===== 이력 조회 =====

// 번역 이력 조회
export const useTranslationHistory = (params?: { page?: number; size?: number }) => {
  const authEP = useAuthEP();
  
  return useQuery<PageResponse<TranslationHistory>>({
    queryKey: ['translationHistory', params],
    queryFn: async () => {
      const response = await authEP({
        func: getTranslationHistory,
        params
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5분
    refetchOnMount: 'always',
  });
};

// 좋아요한 번역 조회
export const useLikedTranslations = (params?: { page?: number; size?: number }) => {
  const authEP = useAuthEP();
  
  return useQuery<PageResponse<TranslationHistory>>({
    queryKey: ['likedTranslations', params],
    queryFn: async () => {
      const response = await authEP({
        func: getLikedTranslations,
        params
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

// 번역 검색 (무한 스크롤)
export const useSearchTranslations = (keyword: string, enabled: boolean = true) => {
  const authEP = useAuthEP();
  
  return useInfiniteQuery({
    queryKey: ['searchTranslations', keyword],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await authEP({
        func: searchTranslations,
        params: { keyword, page: pageParam as number, size: 20 }
      });
      return response.data;
    },
    enabled: enabled && keyword.length > 0,
    initialPageParam: 0,
    getNextPageParam: (lastPage: PageResponse<TranslationHistory>, pages) => {
      return !lastPage.last ? pages.length : undefined;
    },
  });
};

// 언어별 번역 조회
export const useTranslationsByLanguage = (
  sourceLanguage: string,
  targetLanguage: string,
  params?: { page?: number; size?: number }
) => {
  const authEP = useAuthEP();
  
  return useQuery<PageResponse<TranslationHistory>>({
    queryKey: ['translationsByLanguage', sourceLanguage, targetLanguage, params],
    queryFn: async () => {
      const response = await authEP({
        func: getTranslationsByLanguage,
        params: { sourceLanguage, targetLanguage, ...params }
      });
      return response.data;
    },
    enabled: !!sourceLanguage && !!targetLanguage,
  });
};

// 자주 사용하는 구문 조회
export const useQuickPhrases = (limit: number = 10) => {
  const authEP = useAuthEP();
  
  return useQuery<QuickPhrase[]>({
    queryKey: ['quickPhrases', limit],
    queryFn: async () => {
      const response = await authEP({
        func: getQuickPhrases,
        params: { limit }
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 10, // 10분
  });
};

// ===== 액션 뮤테이션 =====

// 좋아요 토글
export const useToggleLike = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  
  return useMutation<AxiosResponse<TranslationHistory>, Error, string>({
    mutationFn: (translationId: string) =>
      authEP({
        func: toggleLike,
        params: { translationId }
      }),
    onSuccess: (response, translationId) => {
      // 번역 이력 캐시 업데이트
      queryClient.setQueriesData(
        { queryKey: ['translationHistory'] },
        (old: PageResponse<TranslationHistory> | undefined) => {
          if (!old) return old;
          return {
            ...old,
            content: old.content.map(item =>
              item.id === translationId ? response.data : item
            )
          };
        }
      );
      
      // 좋아요 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['likedTranslations'] });
    },
  });
};

// 번역 삭제
export const useDeleteTranslation = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  
  return useMutation<AxiosResponse<{ id: string; message: string }>, Error, string>({
    mutationFn: (translationId: string) =>
      authEP({
        func: deleteTranslation,
        params: { translationId }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translationHistory'] });
      queryClient.invalidateQueries({ queryKey: ['likedTranslations'] });
      queryClient.invalidateQueries({ queryKey: ['quickPhrases'] });
    },
  });
};

// 번역 일괄 삭제
export const useDeleteTranslations = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  
  return useMutation<AxiosResponse<{ count: number; message: string }>, Error, string[]>({
    mutationFn: (translationIds: string[]) =>
      authEP({
        func: deleteTranslations,
        reqBody: translationIds
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translationHistory'] });
      queryClient.invalidateQueries({ queryKey: ['likedTranslations'] });
      queryClient.invalidateQueries({ queryKey: ['quickPhrases'] });
    },
  });
};

// 모든 번역 삭제
export const useDeleteAllTranslations = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  
  return useMutation<AxiosResponse<{ message: string }>, Error, void>({
    mutationFn: () =>
      authEP({ func: deleteAllTranslations }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translationHistory'] });
      queryClient.invalidateQueries({ queryKey: ['likedTranslations'] });
      queryClient.invalidateQueries({ queryKey: ['quickPhrases'] });
      queryClient.invalidateQueries({ queryKey: ['languageStatistics'] });
    },
  });
};

// ===== 통계 조회 =====

// 언어별 통계
export const useLanguageStatistics = () => {
  const authEP = useAuthEP();
  
  return useQuery<LanguageStatistics[]>({
    queryKey: ['languageStatistics'],
    queryFn: async () => {
      const response = await authEP({
        func: getLanguageStatistics
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 10, // 10분
  });
};

// 번역 통계
export const useTranslationStatistics = (startDate: string, endDate: string) => {
  const authEP = useAuthEP();
  
  return useQuery<TranslationStatistics>({
    queryKey: ['translationStatistics', startDate, endDate],
    queryFn: async () => {
      const response = await authEP({
        func: getTranslationStatistics,
        params: { startDate, endDate }
      });
      return response.data;
    },
    enabled: !!startDate && !!endDate,
  });
};

// 일별 번역 횟수
export const useDailyTranslationCount = (startDate: string, endDate: string) => {
  const authEP = useAuthEP();
  
  return useQuery<Record<string, number>>({
    queryKey: ['dailyTranslationCount', startDate, endDate],
    queryFn: async () => {
      const response = await authEP({
        func: getDailyTranslationCount,
        params: { startDate, endDate }
      });
      return response.data;
    },
    enabled: !!startDate && !!endDate,
  });
};

// ===== 추가 기능 =====

// 유사한 번역 찾기
export const useFindSimilarTranslations = (text: string, minSimilarity: number = 0.5) => {
  const authEP = useAuthEP();
  
  return useQuery<TranslationHistory[]>({
    queryKey: ['similarTranslations', text, minSimilarity],
    queryFn: async () => {
      const response = await authEP({
        func: findSimilarTranslations,
        params: { text, minSimilarity }
      });
      return response.data;
    },
    enabled: text.length > 2,
  });
};

// 번역 내보내기
export const useExportTranslations = () => {
  const authEP = useAuthEP();
  
  return useMutation<AxiosResponse<Blob>, Error, { format?: string; onlyLiked?: boolean }>({
    mutationFn: (params: { format?: string; onlyLiked?: boolean }) =>
      authEP({
        func: exportTranslations,
        params
      }),
    onSuccess: (response, variables) => {
      // Blob 데이터를 다운로드
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `translations_${Date.now()}.${variables.format?.toLowerCase() || 'csv'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error('Export failed:', error);
    }
  });
};

// ===== 실시간 번역 (Optimistic Update) =====

// 빠른 번역 (Optimistic Update 포함)
export const useQuickTranslate = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  
  return useMutation<
    AxiosResponse<TranslationResponse>,
    Error,
    TranslationRequest,
    { previousHistory: PageResponse<TranslationHistory> | undefined }
  >({
    mutationFn: (data: TranslationRequest) =>
      authEP({
        func: translateText,
        reqBody: data
      }),
    onMutate: async (newTranslation) => {
      // 이전 데이터 백업
      await queryClient.cancelQueries({ queryKey: ['translationHistory'] });
      const previousHistory = queryClient.getQueryData<PageResponse<TranslationHistory>>(['translationHistory']);
      
      // Optimistic Update
      queryClient.setQueryData(['translationHistory'], (old: PageResponse<TranslationHistory> | undefined) => {
        if (!old) return old;
        
        const tempTranslation: TranslationHistory = {
          id: 'temp-' + Date.now(),
          userId: 'current-user',
          sourceText: newTranslation.sourceText,
          targetText: 'Translating...',
          sourceLanguage: newTranslation.sourceLanguage,
          targetLanguage: newTranslation.targetLanguage,
          isLiked: false,
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
        };
        
        return {
          ...old,
          content: [tempTranslation, ...old.content]
        };
      });
      
      return { previousHistory };
    },
    onError: (err, newTranslation, context) => {
      // 에러 시 롤백
      if (context?.previousHistory) {
        queryClient.setQueryData(['translationHistory'], context.previousHistory);
      }
      console.error('Quick translate failed:', err);
    },
    onSettled: () => {
      // 완료 후 재조회
      queryClient.invalidateQueries({ queryKey: ['translationHistory'] });
    },
  });
};

// ===== 유틸리티 함수 =====

// 캐시된 번역 찾기
export const useCachedTranslation = (sourceText: string, sourceLanguage: string, targetLanguage: string) => {
  const queryClient = useQueryClient();
  
  const findCached = () => {
    const cached = queryClient.getQueryData<PageResponse<TranslationHistory>>(['translationHistory']);
    if (!cached) return null;
    
    return cached.content.find(
      item =>
        item.sourceText === sourceText &&
        item.sourceLanguage === sourceLanguage &&
        item.targetLanguage === targetLanguage
    );
  };
  
  return findCached();
};