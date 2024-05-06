declare interface UsersDTO extends CommonDTO{
  userId ?: string;
  userpassword ?: string;
  email ?: string;
  roles ?: string[];
}