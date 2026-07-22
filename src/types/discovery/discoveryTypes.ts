// Destination Discovery (유튜브 수집·요약 플러그인) 타입 정의

export type DiscoveryJobStatus = "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface DiscoveredVideo {
  videoId: string;
  title?: string;
  channelTitle?: string;
  publishedAt?: string;
  thumbnailUrl?: string;
  viewCount?: number;
  duration?: string; // ISO8601 (예: PT12M34S)
  aiSummary?: string;
  tags?: string[];
  score?: number; // 0~100 추천도
}

export interface DestinationDigest {
  id?: string;
  destinationKey?: string;
  displayName?: string;
  locale?: string;
  summary?: string;
  videos?: DiscoveredVideo[];
  collectedAt?: string;
}

export interface DiscoveryDigestResponse {
  digest?: DestinationDigest | null;
  jobStatus?: DiscoveryJobStatus | null;
  errorMessage?: string | null;
}

export interface DiscoveryCollectRequest {
  query: string;
  locale?: string;
}
