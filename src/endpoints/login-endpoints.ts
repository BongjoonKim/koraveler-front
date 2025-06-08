import {request, securityReq} from "../appConfig/request-response";
import {AxiosResponse} from "axios";
import {FuncProps} from "../utils/useAuthEP";

export async function login(props: UsersDTO) {
  try {
    return (await securityReq.post("/ps/login",  {
      username : props.userId,
      password : props.userPassword
    })) as AxiosResponse<TokenDTO>
  } catch (e) {
    throw e;
  }
}

// accessToken이 만료되었을 때 작업
export async function udtRefreshToken(refreshToken : string) {
  console.log("udtRefreshToken", refreshToken)
  return (await request.post('/login/ps/refresh', {
    refreshToken : refreshToken
  })) as AxiosResponse<TokenDTO>
}

export async function getLoginUser(props : FuncProps) {
  try {
    return (await request.get(`/login/user`, {
      headers: {
        Authorization : `Bearer ${props.accessToken}`
      }
    })) as AxiosResponse<UsersDTO>;
  } catch (e) {
   throw e;
  }
}

export async function logout() {
  return (await request.get(`/login/ps/logout`)) as AxiosResponse<any>;
}

export async function signUp(props : UsersDTO) {
  return (await request.post("/login/ps/sign-up", props)) as AxiosResponse<UsersDTO>
}