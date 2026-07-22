// src/types/admin/adminUserTypes.ts
// 관리자 사용자 관리 API DTO (백엔드 /api/v1/admin/users)

export interface AdminUserSummary {
  id: string;
  userId: string;
  name?: string;
  email?: string;
  src?: string;
  roles: string[];
  enabled: boolean;
  created?: string;
  updated?: string;
}

export interface AdminUserListResponse {
  users: AdminUserSummary[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  totalAll: number;
  activeCount: number;
  disabledCount: number;
}

export interface AdminUserDocument {
  id: string;
  title?: string;
  draft: boolean;
  disclose: boolean;
  deleted: boolean;
  thumbnailImgUrl?: string;
  tags?: string[];
  created?: string;
  updated?: string;
}

export interface AdminUserTravel {
  id: string;
  title?: string;
  destination?: string;
  status?: string; // PLANNING | IN_PROGRESS | COMPLETED
  visibility?: string;
  startDate?: string;
  endDate?: string;
  role?: string; // 해당 여행에서의 역할 (ADMIN | USER)
  memberCount?: number;
  created?: string;
}

export interface AdminUserDetailResponse {
  user: AdminUserSummary;
  documentCount: number;
  documents: AdminUserDocument[];
  documentPage: number;
  documentTotalPages: number;
  travelCount: number;
  travels: AdminUserTravel[];
}

export type AdminUserStatusFilter = "all" | "active" | "disabled";
