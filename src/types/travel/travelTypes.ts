// Travel Enums
export type TravelVisibility = "PUBLIC" | "PRIVATE";
export type TravelStatus = "PLANNING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type TravelRole = "ADMIN" | "USER";

// Embedded Models
export interface SchedulePlace {
  name?: string;
  address?: string;
  lat?: number;
  lng?: number;
  memo?: string;
}

export interface TravelSchedule {
  id?: string;
  dayNumber?: number;
  date?: string;
  title: string;
  description?: string;
  places?: SchedulePlace[];
  sortOrder?: number;
}

// Member Response (nested in TravelResponse)
export interface TravelMemberResponse {
  userId: string;
  role: string;
  nickname?: string;
  joinedAt?: string;
}

// Main Travel Response
export interface TravelResponse {
  id: string;
  title: string;
  description?: string;
  coverImageUrl?: string;
  visibility: TravelVisibility;
  status: TravelStatus;
  startDate?: string;
  endDate?: string;
  destination?: string;
  tags?: string[];
  schedules?: TravelSchedule[];
  channelIds?: string[];
  members?: TravelMemberResponse[];
  memberCount?: number;
  createdUser?: string;
  created?: string;
  updated?: string;
}

// List Response with Pagination
export interface TravelListResponse {
  travels: TravelResponse[];
  pagination: {
    totalCount: number;
    pageSize: number;
    currentPage: number;
    hasMore: boolean;
  };
}

// Request DTOs
export interface TravelCreateRequest {
  title: string;
  description?: string;
  coverImageUrl?: string;
  visibility?: TravelVisibility;
  startDate?: string;
  endDate?: string;
  destination?: string;
  tags?: string[];
}

export interface TravelUpdateRequest {
  title?: string;
  description?: string;
  coverImageUrl?: string;
  visibility?: TravelVisibility;
  status?: TravelStatus;
  startDate?: string;
  endDate?: string;
  destination?: string;
  tags?: string[];
}

export interface TravelMemberRequest {
  userId: string;
  role?: TravelRole;
  nickname?: string;
}

export interface TravelScheduleRequest {
  title: string;
  dayNumber?: number;
  date?: string;
  description?: string;
  places?: SchedulePlace[];
  sortOrder?: number;
}

// Media
export interface TravelMedia {
  id: string;
  travelId: string;
  uploadUserId: string;
  fileName: string;
  originalFileName: string;
  fileUrl: string;
  thumbnailUrl?: string;
  mimeType: string;
  fileSize: number;
  width?: number;
  height?: number;
  duration?: number;
  description?: string;
  takenAt?: string;
  created?: string;
}
