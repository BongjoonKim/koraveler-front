declare interface UsersDTO extends UserCommon{
  id ?: string;
  userId ?: string;
  userPassword ?: string;
  email ?: string;
  src ?: string;
  roles ?: string[];
  name ?: string;
  birthday ?: Date;
}

export interface User {
  id: string;
  userId: string;
  name?: string;
  email?: string;
  src?: string; // profile image
  profileImage?: string; // alternative field name
  status?: 'ACTIVE' | 'INACTIVE' | string;
  created?: string;
  createdAt?: string;
}

export interface UpdateUserAccountDTO {
  id?: string;
  name?: string;
  src?: string;
  birthday?: string;
}

export interface UserSearchResponse {
  users: User[];
  totalCount: number;
  hasNext: boolean;
  currentPage?: number;
  totalPages?: number;
}

// 프로필 관련 타입
export interface UserProfileResponse {
  id: string;
  userId: string;
  email: string;
  name: string;
  src: string;
  birthday: string;
  roles: string[];
  created: string;
  updated: string;
}

export interface UserUpdateRequest {
  name?: string;
  email?: string;
  src?: string;
  birthday?: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserDeleteRequest {
  password: string;
}