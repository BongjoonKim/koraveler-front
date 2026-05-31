export interface DocumentViewResponse {
  documentId ?: string;
  totalViews ?: number;
  todayViews ?: number;
}

export interface IncreaseViewRequest {
  documentId ?: string;
  increased ?: boolean;
  totalViews ?: number;
}

export interface DailyViewCount {
  date: string;
  count: number;
}

export interface ViewStatsDTO {
  documentId: string;
  totalViews: number;
  uniqueViews: number;
  todayViews: number;
  weekViews: number;
  dailyStats: DailyViewCount[];
}

// 사이드바 "Popular this month" 위젯용 경량 응답
export interface PopularPostDTO {
  rank: number;
  id: string;
  title?: string;
  thumbnailImgUrl?: string;
  viewCount: number;
}

// 사용자 뱃지 통합 응답 (헤더/사이드바)
export interface UserBadgesResponse {
  followingUnread: number;
  since?: string;
  generatedAt?: string;
}