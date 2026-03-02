import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { LocaleCode, SUPPORTED_LOCALES } from '../../types/i18n/i18nTypes';

// 브라우저 저장소에 유지되는 사용자 선호 언어 (로그인 유저가 설정한 기본 언어)
export const preferredLocaleAtom = atomWithStorage<LocaleCode | null>(
    'koraveler_preferred_locale',
    null
);

// 현재 활성 locale (resolve된 값)
export const currentLocaleAtom = atom<LocaleCode>('ko');

// 브라우저 언어 감지 (비로그인 사용자용)
export function detectBrowserLocale(): LocaleCode | null {
    const lang = navigator.language?.toLowerCase();
    if (lang.startsWith('ko')) return 'ko';
    if (lang.startsWith('zh')) return 'zh';
    if (lang.startsWith('ja')) return 'ja';
    if (lang.startsWith('en')) return 'en';
    return null;
}

/**
 * locale 결정 우선순위:
 * 1. URL 파라미터 (?locale=en) — 글별 수동 선택
 * 2. 로그인 사용자: 저장된 선호 언어 (유저 메뉴 > Language에서 설정)
 * 3. 비로그인 사용자: 브라우저 Accept-Language 기반 감지
 * 4. fallback: 'ko'
 */
export function resolveLocale(
    urlParam: string | null,
    storedPref: LocaleCode | null,
    isLoggedIn?: boolean
): LocaleCode {
    // 1. URL 파라미터 (글별 수동 선택, 최우선)
    if (urlParam && isValidLocale(urlParam)) return urlParam as LocaleCode;

    // 2. 로그인 사용자: 저장된 선호 언어
    if (storedPref) return storedPref;

    // 3. 비로그인 사용자: 브라우저 환경 감지
    if (!isLoggedIn) {
        const browserLocale = detectBrowserLocale();
        if (browserLocale) return browserLocale;
    }

    // 4. fallback
    return 'ko';
}

function isValidLocale(code: string): boolean {
    return SUPPORTED_LOCALES.includes(code as LocaleCode);
}
