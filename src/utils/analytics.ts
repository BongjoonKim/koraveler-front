// src/utils/analytics.ts
// PostHog 기반 제품 분석 공통 모듈.
// 컴포넌트에서 posthog를 직접 import하지 않고 이 모듈의 track* 함수를 사용한다.
//
// 퍼널: $pageview → menu_clicked → blog_post_clicked → blog_post_viewed
import posthog from "posthog-js";

let initialized = false;

// 앱 시작 시 1회 호출 (App.tsx). 키가 없으면 조용히 비활성화된다.
export function initAnalytics() {
  if (initialized || typeof window === "undefined") return;

  const key = process.env.REACT_APP_PUBLIC_POSTHOG_KEY;
  if (!key) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[analytics] REACT_APP_PUBLIC_POSTHOG_KEY 미설정 — 분석 비활성화");
    }
    return;
  }

  posthog.init(key, {
    api_host: process.env.REACT_APP_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: false, // SPA 라우트 전환은 usePageViewTracking에서 수동 캡처
    loaded: (ph) => {
      if (process.env.NODE_ENV === "development") ph.debug();
    },
  });
  initialized = true;
}

function capture(event: string, properties?: Record<string, unknown>) {
  if (!initialized) return;
  posthog.capture(event, properties);
}

// 라우트 전환 pageview. $current_url/$referrer 는 posthog가 자동 첨부.
export function trackPageView() {
  capture("$pageview");
}

// 헤더 메뉴(Blog/Travel/Home 등) 및 로고 클릭
export function trackMenuClick(p: {
  menuLabel?: string;
  menuUrl?: string;
  currentPath: string;
}) {
  capture("menu_clicked", {
    menu_label: p.menuLabel,
    menu_url: p.menuUrl,
    current_path: p.currentPath,
  });
}

// 블로그 글 클릭 출처 구분값
export type BlogPostClickSource =
  | "blog_list"
  | "home_featured"
  | "home_featured_carousel";

export function trackBlogPostClick(p: {
  postId?: string;
  postTitle?: string;
  source: BlogPostClickSource;
  locale?: string;
  category?: string;
}) {
  capture("blog_post_clicked", {
    post_id: p.postId,
    post_title: p.postTitle,
    source: p.source,
    locale: p.locale,
    category: p.category,
  });
}

// 블로그 글 로드 완료 (퍼널 종착점)
export function trackBlogPostView(p: {
  postId?: string;
  postTitle?: string;
  locale?: string;
  isTranslated?: boolean;
}) {
  capture("blog_post_viewed", {
    post_id: p.postId,
    post_title: p.postTitle,
    locale: p.locale,
    is_translated: p.isTranslated,
  });
}
