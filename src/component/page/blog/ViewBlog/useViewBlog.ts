import {ViewBlogProps} from "./ViewBlog";
import {useParams, useSearchParams} from "react-router-dom";
import {useCallback, useEffect, useMemo, useState} from "react";
import {getDocument} from "../../../../endpoints/blog-endpoints";
import {useRecoilState} from "recoil";
import recoil from "../../../../stores/recoil";
import {useAtom, useSetAtom} from "jotai";
import {isBookmark} from "../../../../stores/jotai/jotai";
import {getIsBookmarked} from "../../../../endpoints/bookmark-endpoints";
import useAuthEP from "../../../../utils/useAuthEP";
import {useTranslatedPost} from "../../../../hooks/useI18nQueries";
import {currentLocaleAtom, preferredLocaleAtom, resolveLocale} from "../../../../stores/jotai/localeAtom";
import {LocaleCode, AvailableLocale, TranslatedBy} from "../../../../types/i18n/i18nTypes";
import {useCurrentUser} from "../../../../hooks/useCurrentUser";

export interface ViewBlogI18nState {
  currentLocale: LocaleCode;
  originalLocale: LocaleCode;
  isTranslated: boolean;
  translatedBy: TranslatedBy | null;
  availableLocales: AvailableLocale[];
  onLocaleChange: (locale: LocaleCode) => void;
  onViewOriginal: () => void;
}

function useViewBlog(props : ViewBlogProps) {
  const {id} = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [document, setDocument] = useState<DocumentDTO>({});
  const [isBookmarked, setBookmarked] = useAtom<boolean>(isBookmark);
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  const authEP = useAuthEP();
  const {data: currentUser} = useCurrentUser();

  // i18n: locale 상태 관리
  const [preferredLocale, setPreferredLocale] = useAtom(preferredLocaleAtom);
  const setCurrentLocale = useSetAtom(currentLocaleAtom);

  // URL의 locale 파라미터
  const urlLocale = searchParams.get('locale');

  // 로그인 여부에 따라 locale 결정
  // - 로그인 유저: URL > 저장된 기본 언어 > ko
  // - 비로그인 유저: URL > 브라우저 환경(Accept-Language) > ko
  const isLoggedIn = !!currentUser?.id;
  const activeLocale = useMemo(() => {
    return resolveLocale(urlLocale, preferredLocale, isLoggedIn);
  }, [urlLocale, preferredLocale, isLoggedIn]);

  // currentLocaleAtom 동기화 (useTranslatedPost에서 사용)
  useEffect(() => {
    setCurrentLocale(activeLocale);
  }, [activeLocale, setCurrentLocale]);

  // 번역 데이터 조회
  const {data: translatedPost} = useTranslatedPost(id);

  // 블로그 글 조회
  const getDocumentData = useCallback(async () => {
    try {
      if (id) {
        const res = await getDocument({params: {id: id}});
        if (res.status !== 200) {
          throw res.statusText;
        }
        setDocument(res.data);
        const resBookmark = await authEP({
          func : getIsBookmarked,
          params : {documentId : id},
        })
        if (resBookmark.status !== 200) {
          throw resBookmark.statusText;
        }
        setBookmarked(resBookmark.data)
      } else {
        setErrorMsg({
          status : "warning",
          msg: "there is no blog id"
        })
      }
    } catch (e) {
      setErrorMsg({
        status : "error",
        msg: e?.toString()
      })
    }
  }, [document, id]);

  useEffect(() => {
    getDocumentData();
  }, [id]);

  // 번역 적용된 title/content 결정
  const displayTitle = useMemo(() => {
    if (translatedPost?.isTranslated) {
      return translatedPost.title;
    }
    return document.title;
  }, [translatedPost, document.title]);

  const displayContent = useMemo(() => {
    if (translatedPost?.isTranslated) {
      return translatedPost.content;
    }
    return document.contents;
  }, [translatedPost, document.contents]);

  // 글별 언어 전환 핸들러 (기본 언어 설정은 변경하지 않고 URL 파라미터만 업데이트)
  const handleLocaleChange = useCallback((locale: LocaleCode) => {
    // URL에 locale 파라미터로 반영 (글별 선택)
    const newParams = new URLSearchParams(searchParams);
    if (locale === (document.originalLocale || 'ko')) {
      newParams.delete('locale');
    } else {
      newParams.set('locale', locale);
    }
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams, document.originalLocale]);

  // 원본 보기 핸들러
  const handleViewOriginal = useCallback(() => {
    const original = (document.originalLocale || 'ko') as LocaleCode;
    handleLocaleChange(original);
  }, [handleLocaleChange, document.originalLocale]);

  // i18n 상태
  const i18nState: ViewBlogI18nState = useMemo(() => ({
    currentLocale: activeLocale,
    originalLocale: (translatedPost?.originalLocale || document.originalLocale || 'ko') as LocaleCode,
    isTranslated: translatedPost?.isTranslated ?? false,
    translatedBy: translatedPost?.translatedBy ?? null,
    availableLocales: translatedPost?.availableLocales ?? [],
    onLocaleChange: handleLocaleChange,
    onViewOriginal: handleViewOriginal,
  }), [activeLocale, translatedPost, document.originalLocale, handleLocaleChange, handleViewOriginal]);

  return {
    document,
    isBookmarked,
    displayTitle,
    displayContent,
    i18nState,
  }
}

export default useViewBlog;
