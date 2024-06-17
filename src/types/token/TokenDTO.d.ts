declare interface TokenDTO extends CommonDTO {
  accessToken ?: string;
  refreshToken ?: string;
  grantType ?: string[];
}