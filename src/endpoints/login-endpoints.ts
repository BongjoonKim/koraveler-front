import {request, securityReq} from "../appConfig/request-response";
import {AxiosResponse} from "axios";

export async function login(props: UsersDTO) {
  return (await securityReq.post("/login",  {
    username : props.userId,
    password : props.userPassword
  })) as AxiosResponse<TokenDTO>
}

// accessToken이 만료되었을 때 작업
export async function udtRefreshToken(props: TokenDTO) {
  console.log("props", props)
  return (await request.post('/login/refresh', {
    ...props
  })) as AxiosResponse<TokenDTO>
}