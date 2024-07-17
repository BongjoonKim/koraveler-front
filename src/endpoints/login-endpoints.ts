import {request, securityReq} from "../appConfig/request-response";
import {AxiosResponse} from "axios";

export async function login(props: UsersDTO) {
  try {
    return (await securityReq.post("ps/login",  {
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
  return (await request.post('ps/login/refresh', {
    refreshToken : refreshToken
  })) as AxiosResponse<TokenDTO>
}

export async function getLoginUser(accessToken : any) {
  try {
    return (await request.get(`ps/login/user`, {
      headers: {
        Authorization : `Bearer ${accessToken}`
      }
    })) as AxiosResponse<UsersDTO>;
  } catch (e) {
   throw e;
  }
}

export async function logout() {
  try {
    return (await request.get(`ps/login/logout`)) as AxiosResponse<any>;
  } catch (e) {
    throw e;
  }
}