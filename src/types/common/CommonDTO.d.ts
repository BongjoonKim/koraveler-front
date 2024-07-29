

declare interface UserCommon {
  created ?: Date;
  updated ?: Date;
  isNonExpired ?: boolean;
  isNonLocked ?: boolean;
  isCredentialsNonExpired ?: boolean;
  isEnabled ?: boolean;
}

declare interface CommonDTO {
  created ?: Date;
  updated ?: Date;
  createUser ?: string;
  updatedUser ?: string;
  uniqKey ?: string;
}

declare type ActType = "CREATE" | "UPDATE" | "DELETE" | "GET" | "MAKE"