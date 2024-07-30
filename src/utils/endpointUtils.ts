import {getCookie, setCookie} from "./cookieUtils";
import {udtRefreshToken} from "../endpoints/login-endpoints";
import {ACCESSTOKEN_NULL, REFESHTOKEN_EXPIRED} from "../constants/ErrorCode";

interface AxiosProps  {
  func ?: any;
  accessToken ?: any;
  setAccessToken ?: any;
  params ?: any;
  reqBody ?: any;
}

export interface FuncProps {
  accessToken ?: any;
  params ?: any;
  reqBody ?: any;
}

export const endpointUtils = {
  async authAxios(props : AxiosProps) {
    try {
      if (props.accessToken) {
        return (await props.func({
          accessToken : props.accessToken,
          params : props?.params,
          reqBody : props?.reqBody
        }));
      } else {
        throw ACCESSTOKEN_NULL;
      }
    } catch (e) {
      const refreshToken = getCookie("refreshToken");
      if (refreshToken && refreshToken !== "undefined") {
        const res = await udtRefreshToken(getCookie("refreshToken").replace(/^"(.*)"$/, '$1'));
        console.log("리프레시 토큰", refreshToken, getCookie("refreshToken"), res)
        if (res.data) {
          setCookie("refreshToken", res.data.refreshToken!);
          props.setAccessToken(res.data.accessToken);
          return (await props.func({
            accessToken: res.data.accessToken,
            params : props?.params,
            reqBody : props?.reqBody
          }))
        } else {
          throw REFESHTOKEN_EXPIRED;
        }
      } else {
        throw REFESHTOKEN_EXPIRED;
      }
    }
  }
}