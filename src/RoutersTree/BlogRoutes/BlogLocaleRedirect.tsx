import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { preferredLocaleAtom, resolveLocale } from '../../stores/jotai/localeAtom';
import { useCurrentUser } from '../../hooks/useCurrentUser';

interface BlogLocaleRedirectProps {
  type?: string;
}

/**
 * locale 없는 블로그 URL (/blog/home, /blog/my-blog) 접근 시
 * resolve된 locale을 포함한 URL로 redirect.
 */
export default function BlogLocaleRedirect({ type: fixedType }: BlogLocaleRedirectProps) {
  const { type: paramType } = useParams<{ type?: string }>();
  const navigate = useNavigate();
  const preferredLocale = useAtomValue(preferredLocaleAtom);
  const { data: currentUser } = useCurrentUser();
  const isLoggedIn = !!currentUser?.id;

  const pageType = fixedType || paramType || 'home';
  const resolvedLocale = resolveLocale(null, preferredLocale, isLoggedIn);

  useEffect(() => {
    navigate(`/blog/${pageType}/${resolvedLocale}`, { replace: true });
  }, [pageType, resolvedLocale, navigate]);

  return null;
}
