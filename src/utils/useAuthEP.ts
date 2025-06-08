import {getCookie, setCookie} from "./cookieUtils";
import {udtRefreshToken} from "../endpoints/login-endpoints";
import {useAuth} from "../appConfig/AuthProvider";



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

// Hook 기반 useAuthEP
export default function useAuthEP() {
  const { accessToken, setAccessToken } = useAuth();
  
  return async (props: AxiosProps) => {
    try {
      if (accessToken) {
        return await props.func({
          accessToken: accessToken,
          params: props?.params,
          reqBody: props?.reqBody
        });
      } else {
        throw new Error('ACCESSTOKEN_NULL');
      }
    } catch (e) {
      const refreshToken = getCookie("refreshToken");
      if (refreshToken && refreshToken !== "undefined") {
        const res = await udtRefreshToken(getCookie("refreshToken").replace(/^"(.*)"$/, '$1'));
        if (res.data) {
          setCookie("refreshToken", res.data.refreshToken!);
          setAccessToken(res.data.accessToken);
          return await props.func({
            accessToken: res.data.accessToken,
            params: props?.params,
            reqBody: props?.reqBody
          });
        } else {
          throw new Error('REFRESHTOKEN_EXPIRED');
        }
      } else {
        throw new Error('REFRESHTOKEN_EXPIRED');
      }
    }
  };
};