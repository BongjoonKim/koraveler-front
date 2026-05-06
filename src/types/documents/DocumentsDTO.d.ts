// src/types/blog/DocumentsDTO_d.ts

// 기존 타입들은 그대로 유지
declare interface DocumentsInfo {
  totalDocsCnt?: number;
  totalPagesCnt?: number;
  documents?: DocumentDTO[];
}

// Featured 관련 타입 정의
declare interface FeaturedInfo {
  featuredTitle: string;
  featuredSubtitle: string;
  featuredImageUrl: string;
  featuredGradientFrom?: string;
  featuredGradientTo?: string;
  location?: string;
  highlights?: string[];
  ctaButtonText?: string;
  displayPriority?: number;
}

declare interface FeaturedSchedule {
  startDate: string;
  endDate: string;
  isActive: boolean;
  approvedBy?: string;
  approvedAt?: string;
}

// DocumentDTO를 확장하여 Featured 필드 추가
declare interface DocumentDTO extends CommonDTO {
  id?: string;
  title?: string;
  contents?: string;
  contentsType?: EditorType;
  disclose?: boolean;
  tags?: string[];
  createdUser?: string;
  updatedUser?: string;
  folderId?: string;
  color?: string;
  thumbnailImgUrl?: string;
  draft?: boolean;

  // i18n: 원본 언어 코드
  originalLocale?: string;

  // Soft delete (휴지통). isDeleted=true면 휴지통에 있고 deletedAt+90일에 영구 삭제됨
  isDeleted?: boolean;
  deletedAt?: string;

  // Featured 관련 필드 추가
  featuredReady?: boolean;
  featuredInfo?: FeaturedInfo;
  featuredSchedule?: FeaturedSchedule;
}

declare interface FeaturedDocument extends DocumentDTO {
  featuredReady?: boolean;
  featuredInfo?: FeaturedInfo;
  featuredSchedule?: FeaturedSchedule;
}

// Featured 요청을 위한 타입
declare interface FeaturedRequest {
  featuredInfo: FeaturedInfo;
  startDate: string;
  endDate: string;
}

declare type HookCallback = (url: string, text?: string) => void;