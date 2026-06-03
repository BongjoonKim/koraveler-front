import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LEGACY_TYPE_TO_TAB } from "../../types/blog/myBlogTypes";

interface BlogManageRedirectProps {
  /**
   * 옛 URL 의 type 세그먼트. Routes 에서 명시적으로 주입하므로
   * useParams 보다 안정적. (splat 경로일 때 useParams.type 이 안 잡힘)
   */
  type: string;
}

/**
 * 옛 `/blog/{my-blog|bookmark|draft|hidden|trash}/(:locale?)` URL 을
 * 새 대시보드 `/blog/my?tab=...` 로 리다이렉트한다.
 *
 * 통일 이전 사용자의 북마크/즐겨찾기 링크가 깨지지 않도록 두는 호환 레이어.
 */
export default function BlogManageRedirect({ type }: BlogManageRedirectProps) {
  const navigate = useNavigate();
  // splat 라우트로 들어와도 params 로 안 잡히는 경우가 있으므로 prop 우선.
  const params = useParams();
  const resolvedType = type || params.type || "";
  const tab = LEGACY_TYPE_TO_TAB[resolvedType];

  useEffect(() => {
    const target = tab ? `/blog/my?tab=${tab}` : "/blog/my";
    navigate(target, { replace: true });
  }, [navigate, tab]);

  return null;
}
