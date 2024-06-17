import request, {securityReq} from "../appConfig/request-response";
import {AxiosResponse} from "axios";

export async function login(props: UsersDTO) {
  return (await securityReq.post("/login",  {
    username : props.userId,
    password : props.userPassword
  })) as AxiosResponse<TokenDTO>
}