import {request} from "../appConfig/request-response";
import {AxiosResponse} from "axios/index";

export async function getWeather() {
  return (await request.get('/ps/commons/weather')) as AxiosResponse<any>
}