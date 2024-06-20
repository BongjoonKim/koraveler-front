import {request} from "../appConfig/request-response";
import {AxiosResponse} from "axios";
import {udtRefreshToken} from "./login-endpoints";
import {getCookie, setCookie} from "../utils/cookieUtils";

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

export async function getAllMenus2(accessToken : any, setAccessToken : any) {
  console.log("accessToken", accessToken)
  try {
    return (await request.get("/menus/all", {
      headers: {
        Authorization : `Bearer ${accessToken}`
      }
    })) as AxiosResponse<MenusDTO[]>;
  } catch (e) {
    console.log("쿠키값 확인", getCookie("refreshToken"))
    const res = await udtRefreshToken(getCookie("refreshToken").replace(/^"(.*)"$/, '$1'));
    console.log("결과 값", res)
    setCookie("refreshToken", res.data.refreshToken!);
    setAccessToken(res.data.accessToken);
    return (await request.get("/menus/all", {
      headers: {
        Authorization : `Bearer ${res.data.accessToken}`
      }
    })) as AxiosResponse<MenusDTO[]>;
  }
}