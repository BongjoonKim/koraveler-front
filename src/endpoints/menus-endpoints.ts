import {request} from "../appConfig/request-response";
import {AxiosResponse} from "axios";
import {udtRefreshToken} from "./login-endpoints";
import {getCookie, setCookie} from "../utils/cookieUtils";
import {endpointUtils} from "../utils/endpointUtils";

export async function getAllMenus() {
  return (await request.get("/menus/all")) as AxiosResponse<MenusDTO[]>;
}

export async function getMenus(label : string) {
  return (await request.get(`/menus?label=${label}`)) as AxiosResponse<MenusDTO>;
}

export async function createMenus(menusDTO : any) {
  return (await request.post("/menus", menusDTO)) as AxiosResponse<MenusDTO>;
}

export async function updateMenus(menusDTO : MenusDTO) {
  return (await request.put("/menus", menusDTO)) as AxiosResponse<MenusDTO>;
}

export async function deleteMenus(label : string) {
  return (await request.delete(`/menus?label=${label}`)) as AxiosResponse<any>;
}

export async function getAllMenus2(func : any, accessToken : any, setAccessToken : any) {
  // try {
  //   await endpointUtils.tokenProcess(func, accessToken, setAccessToken);
  // } throw e;
  
  console.log("accessToken", accessToken)
  try {
    if (accessToken) {
      func(accessToken);
    } else {
      throw "accessToken is null";
    }
  } catch (e) {
    const refreshToken = getCookie("refreshToken");
    if (refreshToken && refreshToken !== "undefined") {
      const res = await udtRefreshToken(getCookie("refreshToken").replace(/^"(.*)"$/, '$1'));
      if (res.data) {
        setCookie("refreshToken", res.data.refreshToken!);
        setAccessToken(res.data.accessToken);
        return (await func(accessToken));
      } else {
        throw "refreshToken expired";
      }
    } else {
      throw "refreshToken expired";
    }
  }
}

export async function getAllMenus3(accessToken : any) {
  try {
    return (await request.get("/menus/all", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })) as AxiosResponse<MenusDTO[]>;
  } catch (e) {
    throw e;
  }
}