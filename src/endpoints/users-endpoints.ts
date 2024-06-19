import UseAxiosInterceptors, {request} from "../appConfig/request-response";
import {AxiosResponse} from "axios";
import {useAtom} from "jotai";
import {AccessToken} from "../stores/jotai/jotai";

export async function getUserData() {
  return (await request.get("/user")) as AxiosResponse<UsersDTO>;
}