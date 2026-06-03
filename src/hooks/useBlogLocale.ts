import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { preferredLocaleAtom, resolveLocale } from '../stores/jotai/localeAtom';
import { LocaleCode, SUPPORTED_LOCALES } from '../types/i18n/i18nTypes';
import { useCurrentUser } from './useCurrentUser';

/**
 * 블로그 페이지에서 locale을 resolve하고, locale 포함 URL을 생성하는 공유 훅.
 * URL의 :locale param → preferredLocaleAtom → 브라우저 감지 → 'ko' fallback 순서로 결정.
 */
export function useBlogLocale() {
  const { locale: pathLocale } = useParams<{ locale?: string }>();
  const preferredLocale = useAtomValue(preferredLocaleAtom);
  const { data: currentUser } = useCurrentUser();
  const isLoggedIn = !!currentUser?.id;

  const urlLocale = pathLocale && SUPPORTED_LOCALES.includes(pathLocale as LocaleCode)
    ? pathLocale
    : null;

  const activeLocale = useMemo(() => {
    return resolveLocale(urlLocale, preferredLocale, isLoggedIn);
  }, [urlLocale, preferredLocale, isLoggedIn]);

  // locale 포함 블로그 글 보기 URL
  const blogViewUrl = (id: string) => `/blog/view/${activeLocale}/${id}`;

  return {
    activeLocale,
    blogViewUrl,
  };
}
