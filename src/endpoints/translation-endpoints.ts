import { FuncProps } from "../utils/useAuthEP";
import {request} from "../appConfig/request-response";
import {AxiosResponse} from "axios";
import {
  LanguageStatistics,
  PageResponse,
  QuickPhrase,
  TranslationHistory,
  TranslationResponse, TranslationStatistics
} from "../types/translation/translationTypes";

export async function translateText(props: FuncProps) {
  return (await request.post("translate", props.reqBody, {
    headers: {
      Authorization: `Bearer ${props.accessToken}`
    }
  })) as AxiosResponse<TranslationResponse>;
}

// 번역 이력 조회
export async function getTranslationHistory(props: FuncProps) {
  return (await request.get(
    `translate/history?page=${props.params?.page || 0}&size=${props.params?.size || 20}`,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`
      }
    }
  )) as AxiosResponse<PageResponse<TranslationHistory>>;
}

// 좋아요한 번역 조회
export async function getLikedTranslations(props: FuncProps) {
  return (await request.get(
    `translate/liked?page=${props.params?.page || 0}&size=${props.params?.size || 20}`,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`
      }
    }
  )) as AxiosResponse<PageResponse<TranslationHistory>>;
}

// 좋아요 토글
export async function toggleLike(props: FuncProps) {
  return (await request.put(
    `translate/like?id=${props.params?.translationId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`
      }
    }
  )) as AxiosResponse<TranslationHistory>;
}

// 번역 삭제
export async function deleteTranslation(props: FuncProps) {
  return (await request.delete(
    `translate?id=${props.params?.translationId}`,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`
      }
    }
  )) as AxiosResponse<{ id: string; message: string }>;
}

// 번역 일괄 삭제
export async function deleteTranslations(props: FuncProps) {
  return (await request.delete(
    `translate/bulk`,
    {
      data: props.reqBody,
      headers: {
        Authorization: `Bearer ${props.accessToken}`
      }
    }
  )) as AxiosResponse<{ count: number; message: string }>;
}

// 번역 검색
export async function searchTranslations(props: FuncProps) {
  return (await request.get(
    `translate/search?keyword=${props.params?.keyword}&page=${props.params?.page || 0}&size=${props.params?.size || 20}`,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`
      }
    }
  )) as AxiosResponse<PageResponse<TranslationHistory>>;
}

// 언어별 번역 조회
export async function getTranslationsByLanguage(props: FuncProps) {
  return (await request.get(
    `translate/by-language?source=${props.params?.sourceLanguage}&target=${props.params?.targetLanguage}&page=${props.params?.page || 0}&size=${props.params?.size || 20}`,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`
      }
    }
  )) as AxiosResponse<PageResponse<TranslationHistory>>;
}

// 자주 사용하는 구문 조회
export async function getQuickPhrases(props: FuncProps) {
  return (await request.get(
    `translate/quick-phrases?limit=${props.params?.limit || 10}`,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`
      }
    }
  )) as AxiosResponse<QuickPhrase[]>;
}

// === Statistics APIs ===

// 언어별 통계
export async function getLanguageStatistics(props: FuncProps) {
  return (await request.get(
    `translate/statistics/languages`,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`
      }
    }
  )) as AxiosResponse<LanguageStatistics[]>;
}

// 번역 통계
export async function getTranslationStatistics(props: FuncProps) {
  return (await request.get(
    `translate/statistics?startDate=${props.params?.startDate}&endDate=${props.params?.endDate}`,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`
      }
    }
  )) as AxiosResponse<TranslationStatistics>;
}

// 일별 번역 횟수
export async function getDailyTranslationCount(props: FuncProps) {
  return (await request.get(
    `translate/statistics/daily?startDate=${props.params?.startDate}&endDate=${props.params?.endDate}`,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`
      }
    }
  )) as AxiosResponse<Record<string, number>>;
}

// === Export/Import APIs ===

// 번역 내보내기
export async function exportTranslations(props: FuncProps) {
  return (await request.get(
    `translate/export?format=${props.params?.format || 'CSV'}&onlyLiked=${props.params?.onlyLiked || false}`,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`
      },
      responseType: 'blob'
    }
  )) as AxiosResponse<Blob>;
}

// === Additional APIs ===

// 유사한 번역 찾기
export async function findSimilarTranslations(props: FuncProps) {
  return (await request.get(
    `translate/similar?text=${props.params?.text}&minSimilarity=${props.params?.minSimilarity || 0.5}`,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`
      }
    }
  )) as AxiosResponse<TranslationHistory[]>;
}

// 모든 번역 삭제
export async function deleteAllTranslations(props: FuncProps) {
  return (await request.delete(
    `translate/all`,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`
      }
    }
  )) as AxiosResponse<{ message: string }>;
}