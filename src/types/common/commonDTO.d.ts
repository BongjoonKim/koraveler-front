

declare interface CommonDTO {
  created ?: Date;
  updated ?: Date;
  isNonExpired ?: boolean;
  isNonLocked ?: boolean;
  isCredentialsNonExpired ?: boolean;
  isEnabled ?: boolean;
}

declare type ActType = "CREATE" | "UPDATE" | "DELETE" | "GET" | "MAKE"