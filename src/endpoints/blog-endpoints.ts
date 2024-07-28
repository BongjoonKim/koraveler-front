import {request} from "../appConfig/request-response";
import {AxiosResponse} from "axios";

export async function createDocument(accessToken : any) {
  return (await request.get("blog/document", {
    headers : {
      Authorization : `Bearer ${accessToken}`
    }
  })) as AxiosResponse<MenusDTO[]>;
}