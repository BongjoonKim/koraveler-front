/**
 * 내 블로그 대시보드(`/blog/my`) 전용 타입.
 * 백엔드 `GET /blog/documents?type=...` 응답(DocumentsInfo)을 그대로 받아 매핑한다.
 */

/**
 * 백엔드 BlogController 가 받는 `type` 쿼리 파라미터 값.
 * 백엔드 ServiceImpl 의 분기와 1:1 매칭된다.
 *
 * - `my-blog`  : 본인이 작성한 발행 글 (draft=false, isDeleted=false)
 * - `draft`    : 본인이 작성한 초안 (draft=true,  isDeleted=false)
 * - `hidden`   : 본인이 숨김 처리한 글 (disclose=false, draft=false, isDeleted=false)
 * - `bookmark` : 본인이 북마크한 글 (BookmarksRepo lookup)
 * - `trash`    : 본인이 휴지통에 보낸 글 (isDeleted=true)
 */
export type BlogPostStatus = "my-blog" | "draft" | "hidden" | "bookmark" | "trash";

/** 대시보드 탭 — 화면 식별자. BlogPostStatus 와 1:1 매핑되지만 UI 의미를 갖는다. */
export type DashboardTab = "my-posts" | "drafts" | "bookmarks" | "hidden" | "trash";

/** 탭 → 백엔드 type 파라미터 매핑 */
export const TAB_TO_STATUS: Record<DashboardTab, BlogPostStatus> = {
  "my-posts": "my-blog",
  drafts: "draft",
  bookmarks: "bookmark",
  hidden: "hidden",
  trash: "trash",
};

/**
 * 옛 `/blog/{type}` URL 의 type 세그먼트 → 대시보드 탭 키 매핑.
 * BlogManageRedirect 가 옛 URL 을 `/blog/my?tab=...` 로 보낼 때, 그리고 대시보드가
 * `?tab=` 을 읽어 초기 탭을 결정할 때 양쪽에서 쓴다.
 */
export const LEGACY_TYPE_TO_TAB: Record<string, DashboardTab> = {
  "my-blog": "my-posts",
  bookmark: "bookmarks",
  draft: "drafts",
  hidden: "hidden",
  trash: "trash",
};

/** 유효한 탭 키인지 검사. URL 파람 sanitize 용. */
export function isDashboardTab(value: string | null | undefined): value is DashboardTab {
  return value === "my-posts" || value === "drafts" || value === "bookmarks" || value === "hidden" || value === "trash";
}

/** 정렬 옵션 */
export type DashboardSort = "latest" | "oldest" | "views" | "likes";

/** dateSort 백엔드 파라미터 매핑 */
export const SORT_TO_DATE_SORT: Record<DashboardSort, "DESC" | "ASC"> = {
  latest: "DESC",
  oldest: "ASC",
  views: "DESC",
  likes: "DESC",
};

/** 리스트 조회 요청 파라미터 */
export interface MyBlogListParams {
  tab: DashboardTab;
  sort: DashboardSort;
  page?: number;
  size?: number;
  /** 폴더(카테고리) 필터. 미지정이면 전체. */
  folderId?: string;
  /** i18n locale 필터 */
  locale?: string;
}

/**
 * 대시보드 리스트 1건. DocumentDTO 의 일부 필드를 화면에 맞게 추린 view 모델.
 * Phase 3 에서 응답을 이 형태로 매핑한다.
 */
export interface MyBlogPostSummary {
  id: string;
  thumbnail?: string;
  title: string;
  category?: string;
  /** 발행일 또는 마지막 수정일 (ISO 8601) */
  date: string;
  status: BlogPostStatus;
  views?: number;
  likes?: number;
}

/** 리스트 응답 — DocumentsInfo 와 모양은 같지만 view 모델 배열을 갖는다 */
export interface MyBlogListResponse {
  totalDocsCnt?: number;
  totalPagesCnt?: number;
  documents?: MyBlogPostSummary[];
}

/**
 * 대시보드 상단 4개 스탯.
 * viewsThisWeek / viewsLastWeek 는 현재 백엔드에 집계 엔드포인트가 없어
 * Phase 3 에서 컴포지트(여러 쿼리)로 채우거나, 별도 백엔드 작업으로 채운다.
 */
export interface MyBlogStats {
  viewsThisWeek: number;
  viewsLastWeek: number;
  publishedCount: number;
  categoryCount: number;
  draftCount: number;
  lastDraftEditedAt?: string;
  bookmarkCount: number;
}
