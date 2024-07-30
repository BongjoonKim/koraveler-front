
declare interface DocumentsInfo {
  totalDocsCnt ?: number;
  totalPagesCnt ?: number;
  documentsDTO ?: DocumentDTO[];
}

declare interface DocumentDTO extends CommonDTO{
  id ?: string;
  title ?: string;
  contents ?: string;
  contentsType ?: EditorType ;
  disclose ?: boolean;
  tags ?: [];
  createdUser ?: string;
  updatedUser ?: string;
  folderId ?: string;
  color ?: string;
  thumbnailImgUrl ?: string;
}

declare interface PaginationDTO {
  page ?: number;
  size ?: number;
  folderId ?: string;
}