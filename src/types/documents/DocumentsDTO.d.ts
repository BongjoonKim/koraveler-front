declare interface DocumentDTO extends CommonDTO{
  id ?: string;
  title : string;
  contents : string;
  contentsType ?: EditorType ;
  disclose ?: boolean;
  tags ?: [];
  createdUser ?: string;
  updatedUser ?: string;
  folderId ?: string;
  color ?: string;
}