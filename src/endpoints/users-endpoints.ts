import request from "../appConfig/request-response";
import {AxiosResponse} from "axios";

export async function getUserData() {
  return (await request.get("/user")) as AxiosResponse<UsersDTO>;
}