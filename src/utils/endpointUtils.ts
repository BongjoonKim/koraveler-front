import {getCookie, setCookie} from "./cookieUtils";
import {udtRefreshToken} from "../endpoints/login-endpoints";
import {request} from "../appConfig/request-response";
import {AxiosResponse} from "axios/index";

export const endpointUtils = {
  async authAxios(func : any, accessToken ?: string | undefined | null, setAccessToken ?: any) {
    try {
      if (accessToken) {
        return (await func(accessToken))
      } else {
        throw "accessToken is null"
      }
    } catch (e) {
      const refreshToken = getCookie("refreshToken");
      if (refreshToken && refreshToken !== "undefined") {
        const res = await udtRefreshToken(getCookie("refreshToken").replace(/^"(.*)"$/, '$1'));
        console.log("결과 값", res);
        if (res.data) {
          setCookie("refreshToken", res.data.refreshToken!);
          setAccessToken(res.data.accessToken);
          return (await func(res.data.accessToken))
        } else {
          throw "refreshToken expired";
        }
      } else {
        throw "refreshToken expired";
      }
    }
  }
}