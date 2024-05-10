declare interface MenusDTO extends CommonDTO {
  label ?: string;
  value ?: string;
  sequence ?: number;
  url ?: string;
  types ?: ("main" | "setting" | "admin")[]
}