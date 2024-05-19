declare interface MenusDTO extends CommonDTO {
  id ?: string;
  label ?: string;
  value ?: string;
  sequence ?: number;
  url ?: string;
  types ?: ("main" | "setting" | "admin")[]
}