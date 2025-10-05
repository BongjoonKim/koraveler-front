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

// 번역 지원 언어
export type SupportedTranslateLanguage = 'ko' | 'en' | 'ja' | 'zh' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru' | 'ar' | 'hi';

// 언어 옵션
export const LANGUAGE_OPTIONS: { value: SupportedTranslateLanguage; label: string; flag: string }[] = [
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'ko', label: '한국어', flag: '🇰🇷' },
  { value: 'ja', label: '日本語', flag: '🇯🇵' },
  { value: 'zh', label: '中文', flag: '🇨🇳' },
  { value: 'es', label: 'Español', flag: '🇪🇸' },
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { value: 'it', label: 'Italiano', flag: '🇮🇹' },
  { value: 'pt', label: 'Português', flag: '🇵🇹' },
  { value: 'ru', label: 'Русский', flag: '🇷🇺' },
  { value: 'ar', label: 'العربية', flag: '🇸🇦' },
  { value: 'hi', label: 'हिन्दी', flag: '🇮🇳' }
];