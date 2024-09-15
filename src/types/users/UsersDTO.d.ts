declare interface UsersDTO extends UserCommon{
  id ?: string;
  userId ?: string;
  userPassword ?: string;
  email ?: string;
  src ?: string;
  roles ?: string[];
  name ?: string;
  birthday ?: Date;
}