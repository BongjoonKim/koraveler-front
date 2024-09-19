declare interface BookmarkDTO extends CommonDTO {
  id ?: string;
  userId ?: string;
  documentId ?: string;
  isBookmarked ?: boolean;
}