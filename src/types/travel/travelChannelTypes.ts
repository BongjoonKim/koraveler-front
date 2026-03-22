export type ChannelContextType = "GENERAL" | "ITINERARY" | "PLACE" | "MEDIA" | "INFO";

export interface TravelChannelCreateRequest {
  name: string;
  description?: string;
  contextType?: ChannelContextType;
  contextId?: string;
  channelPurpose?: string;
  isPinned?: boolean;
  displayOrder?: number;
}

export interface TravelChannelUpdateRequest {
  contextType?: ChannelContextType;
  contextId?: string;
  channelPurpose?: string;
  isPinned?: boolean;
  displayOrder?: number;
}

export interface TravelChannelResponse {
  id: string;
  travelId: string;
  channelId: string;
  contextType: ChannelContextType;
  contextId?: string;
  channelPurpose?: string;
  isPinned?: boolean;
  displayOrder?: number;
  channelName: string;
  channelDescription?: string;
  memberCount?: number;
  lastMessageAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TravelChannelMemberResponse {
  userId: string;
  name?: string;
  email?: string;
  src?: string;
  travelRole: string; // ADMIN, USER, VIEWER
  nickname?: string;
}
