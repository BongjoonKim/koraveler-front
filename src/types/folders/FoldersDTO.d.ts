declare interface FoldersDTO extends CommonDTO {
  id?: string;
  name: string;
  path: string;
  parentId: string | null;
  parentFolder ?: FoldersDTO;
  userId: string;
  isPublic: boolean;
  description?: string;
}