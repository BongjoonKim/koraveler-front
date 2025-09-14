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

export interface UserSearchResponse {
  users: User[];
  totalCount: number;
  hasNext: boolean;
  currentPage?: number;
  totalPages?: number;
}