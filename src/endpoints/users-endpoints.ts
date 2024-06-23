import {request} from "../appConfig/request-response";
import {AxiosResponse} from "axios";

export async function getUserData(accessToken : any) {
  return (await request.get("ps/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
    
  })) as AxiosResponse<UsersDTO>;
}