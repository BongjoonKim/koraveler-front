import request from "../appConfig/request-response";
import {AxiosResponse} from "axios";

export async function getAllMenus() {
  return (await request.get("/menus/all")) as AxiosResponse<MenusDTO[]>;
}

export async function getMenus(label : string) {
  return (await request.get(`/menus?label=${label}`)) as AxiosResponse<MenusDTO>;
}

export async function createMenus(menusDTO : MenusDTO) {
  return (await request.post("/menus"), menusDTO) as AxiosResponse<MenusDTO>;
}

export async function updateMenus(menusDTO : MenusDTO) {
  return (await request.put("/menus"), menusDTO) as AxiosResponse<MenusDTO>;
}

export async function deleteMenus(label : string) {
  return (await request.get("/menus")) as AxiosResponse<any>;
}