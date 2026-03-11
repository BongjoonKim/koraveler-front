import {ViewBlogProps} from "./ViewBlog";
import {useParams, useSearchParams, useNavigate} from "react-router-dom";
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
import {LocaleCode, AvailableLocale, TranslatedBy, SUPPORTED_LOCALES} from "../../../../types/i18n/i18nTypes";
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
  const {id, locale: pathLocale} = useParams<{id: string; locale?: string}>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState<DocumentDTO>({});
  const [isBookmarked, setBookmarked] = useAtom<boolean>(isBookmark);
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  const authEP = useAuthEP();
  const {data: currentUser} = useCurrentUser();

  // i18n: locale 상태 관리
  const [preferredLocale, setPreferredLocale] = useAtom(preferredLocaleAtom);
  const setCurrentLocale = useSetAtom(currentLocaleAtom);

  // 하위 호환: ?locale=en → /blog/view/en/{id} 로 redirect
  const queryLocale = searchParams.get('locale');
  useEffect(() => {
    if (queryLocale && id && SUPPORTED_LOCALES.includes(queryLocale as LocaleCode)) {
      navigate(`/blog/view/${queryLocale}/${id}`, { replace: true });
    }
  }, [queryLocale, id, navigate]);

  // URL에 locale이 없으면 preferredLocale 기반으로 redirect
  const isLoggedIn = !!currentUser?.id;
  useEffect(() => {
    if (id && !pathLocale && !queryLocale) {
      const fallbackLocale = resolveLocale(null, preferredLocale, isLoggedIn);
      navigate(`/blog/view/${fallbackLocale}/${id}`, { replace: true });
    }
  }, [id, pathLocale, queryLocale, navigate, preferredLocale, isLoggedIn]);

  // URL path의 locale 파라미터 (pathLocale이 유효한 locale이 아니면 무시)
  const urlLocale = pathLocale && SUPPORTED_LOCALES.includes(pathLocale as LocaleCode) ? pathLocale : null;

  // 로그인 여부에 따라 locale 결정
  // - 로그인 유저: URL > 저장된 기본 언어 > ko
  // - 비로그인 유저: URL > 브라우저 환경(Accept-Language) > ko
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

  // 글별 언어 전환 핸들러 (URL 경로로 반영)
  const handleLocaleChange = useCallback((locale: LocaleCode) => {
    navigate(`/blog/view/${locale}/${id}`);
  }, [navigate, id]);

  // 원본 보기 핸들러
  const handleViewOriginal = useCallback(() => {
    const originalLocale = (document.originalLocale || 'ko') as LocaleCode;
    navigate(`/blog/view/${originalLocale}/${id}`);
  }, [navigate, id, document.originalLocale]);

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
