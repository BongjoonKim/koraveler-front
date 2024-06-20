import axios from "axios";
import {useAtom} from "jotai/index";
import {AccessToken} from "../stores/jotai/jotai";
import {useCallback, useEffect} from "react";
import {getCookie} from "../utils/cookieUtils";
import {useNavigate} from "react-router-dom";
import {udtRefreshToken} from "../endpoints/login-endpoints";
import {errorLogs} from "../error/errorLog";
import {useAuth} from "./AuthContext";

export const request = axios.create({
  baseURL: "",
  headers: {
    'Access-Control-Allow-Origin': 'http://localhost:3003',
    // 'Access-Control-Allow-Credentials' : false,
    "Content-Type": `application/json;charset=UTF-8`,
  }
});

// request.interceptors.request.use(
//   config => {
//     const accessToken = getCookie("accessToken");
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   error => Promise.reject(error)
// );

// Axios 인터셉터 설정을 위한 커스텀 훅
// export default function useAxiosInterceptors() {
//   const navigate = useNavigate();
//   const [accessToken, setAccessToken] = useAtom(AccessToken);
//   const settingToken = useCallback(() => {
//     // 요청 인터셉터 설정
//     const requestInterceptor = request.interceptors.request.use(
//       async config => {
//         if (accessToken) {
//           config.headers.Authorization = `Bearer ${accessToken}`;
//         } else {
//           const refreshToken = getCookie("refreshToken");
//
//           if (refreshToken) {
//             try {
//               const res = await udtRefreshToken({
//                 refreshToken : refreshToken
//               });
//               if (res.data && res.data?.accessToken) {
//                 // setAccessToken(res.data?.accessToken)
//               } else {
//                 throw res.data;
//               }
//             } catch (e) {
//              errorLogs(e);
//             }
//           } else {
//             navigate("/login");
//           }
//         }
//         return config;
//       },
//       error => {
//         return Promise.reject(error);
//       }
//     );
//     return requestInterceptor;
//   }, [accessToken]);
//
//   useEffect(() => {
//     if (!accessToken) {
//       const requestInterceptor = settingToken();
//       // 클린업 함수: 컴포넌트가 언마운트되면 인터셉터 제거
//       return () => {
//         request.interceptors.request.eject(requestInterceptor);
//       };
//     }
//     }, [accessToken]);
//
//   return {settingToken};
// };

// 로그인 전용 Content-Type
export const securityReq = axios.create({
  baseURL:"",
  headers: {
    'Access-Control-Allow-Origin': 'http://localhost:3003',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})