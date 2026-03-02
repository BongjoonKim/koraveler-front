export type LocaleCode = 'ko' | 'en' | 'zh' | 'ja';

export type TranslationStatus =
    | 'pending'
    | 'translating'
    | 'completed'
    | 'failed'
    | 'manually_edited'
    | 'none';

export type TranslatedBy = 'ai' | 'human' | 'ai+human';

export interface AvailableLocale {
    code: LocaleCode;
    name: string;
    nativeName: string;
    isOriginal: boolean;
    status: TranslationStatus | 'original';
}

// 독자용: locale에 맞는 번역 글 응답
export interface TranslatedPostDTO {
    id: string;
    originalLocale: LocaleCode;
    currentLocale: LocaleCode;
    isTranslated: boolean;
    translatedBy: TranslatedBy | null;
    title: string;
    content: string;
    summary: string | null;
    availableLocales: AvailableLocale[];
}

// 작성자용: 특정 번역본 상세 (편집용)
export interface TranslationDetailDTO {
    postId: string;
    locale: LocaleCode;
    title: string;
    content: string;
    summary: string | null;
    status: TranslationStatus;
    translatedBy: TranslatedBy | null;
    aiModel: string | null;
    updatedAt: string | null;
}

// 작성자용: 전체 번역 상태 (대시보드)
export interface TranslationStatusOverviewDTO {
    postId: string;
    originalLocale: LocaleCode;
    translations: TranslationStatusItemDTO[];
}

export interface TranslationStatusItemDTO {
    locale: LocaleCode;
    status: TranslationStatus;
    translatedBy: TranslatedBy | null;
    aiModel: string | null;
    manuallyEditedAt: string | null;
    updatedAt: string | null;
}

// 번역 수동 수정 요청
export interface TranslationEditRequest {
    title: string;
    content: string;
    summary?: string;
}

// 재번역 응답
export interface RetranslateResponse {
    warning?: string;
    requiresConfirmation: boolean;
}

// Locale 메타데이터
export const LOCALE_META: Record<LocaleCode, { name: string; nativeName: string; flag: string }> = {
    ko: { name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
    en: { name: 'English', nativeName: 'English', flag: '🇺🇸' },
    zh: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    ja: { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
};

export const SUPPORTED_LOCALES: LocaleCode[] = ['ko', 'en', 'zh', 'ja'];
