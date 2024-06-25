import {getCookie, setCookie} from "./cookieUtils";
import {udtRefreshToken} from "../endpoints/login-endpoints";
import {ACCESSTOKEN_NULL, REFESHTOKEN_EXPIRED} from "../constants/ErrorCode";

export const endpointUtils = {
  async authAxios(func : any, accessToken ?: string | undefined | null, setAccessToken ?: any) {
    try {
      if (accessToken) {
        return (await func(accessToken))
      } else {
        throw ACCESSTOKEN_NULL;
      }
    } catch (e) {
      const refreshToken = getCookie("refreshToken");
      if (refreshToken && refreshToken !== "undefined") {
        const res = await udtRefreshToken(getCookie("refreshToken").replace(/^"(.*)"$/, '$1'));
        if (res.data) {
          setCookie("refreshToken", res.data.refreshToken!);
          setAccessToken(res.data.accessToken);
          return (await func(res.data.accessToken))
        } else {
          throw REFESHTOKEN_EXPIRED;
        }
      } else {
        throw REFESHTOKEN_EXPIRED;
      }
    }
  }
}