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