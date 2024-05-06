

declare interface CommonDTO {
  id ?: string;
  created ?: Date;
  updated ?: Date;
  isNonExpired ?: boolean;
  isNonLocked ?: boolean;
  isCredentialsNonExpired ?: boolean;
  isEnabled ?: boolean;
}