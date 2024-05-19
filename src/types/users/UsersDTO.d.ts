declare interface UsersDTO extends CommonDTO{
  id ?: string;
  userId ?: string;
  userPassword ?: string;
  email ?: string;
  roles ?: string[];
}