// 번역 요청 인터페이스
export interface TranslationRequest {
  sourceText: string;
  sourceLanguage: string;
  targetLanguage: string;
  context?: string;
  useCache?: boolean;
}

export interface TranslationResponse {
  id: string;
  sourceText: string;
  targetText: string;
  sourceLanguage: string;
  targetLanguage: string;
  translatedAt: string;
  fromCache: boolean;
  isLiked: boolean;
  pronunciation?: string;
  confidence?: number;
  alternatives?: string[];
}

export interface TranslationHistory {
  id: string;
  userId: string;
  sourceText: string;
  targetText: string;
  sourceLanguage: string;
  targetLanguage: string;
  isLiked: boolean;
  created: string;
  updated: string;
  expireAt?: string;
}

export interface QuickPhrase {
  text: string;
  translation: string;
  pronunciation: string;
  category: string;
}

export interface LanguageStatistics {
  sourceLanguage: string;
  targetLanguage: string;
  count: number;
}

export interface TranslationStatistics {
  totalTranslations: number;
  likedTranslations: number;
  mostUsedSourceLanguage: string;
  mostUsedTargetLanguage: string;
  startDate: string;
  endDate: string;
  averageTranslationsPerDay: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
