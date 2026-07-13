import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../utils/analytics";

// Router 내부에서 1회만 마운트할 것 (RoutersTree의 PageViewTracker).
// 최초 진입 + 라우트 전환마다 $pageview를 캡처한다.
export default function usePageViewTracking() {
  const location = useLocation();

  useEffect(() => {
    trackPageView();
  }, [location.pathname, location.search]);
}
