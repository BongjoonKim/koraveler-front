import {request} from "../appConfig/request-response";
import {AxiosResponse} from "axios";
import {FuncProps} from "../utils/useAuthEP";

export async function getAllLoginUserFolders(props : FuncProps) {
  return (await request.get(`/ps/folders/all`, {
    headers: {
      Authorization : `Bearer ${props.accessToken}`
    }
  })) as AxiosResponse<any>;
}

export async function getParentFolder(props : FuncProps) {
  return (await request.get(`/ps/folders?child-id=${props.params.childId}`, {
    headers: {
      Authorization : `Bearer ${props.accessToken}`
    }
  })) as AxiosResponse<any>;
}

export async function createFolder(props : FuncProps) {
  return (await request.post(`/ps/folders`, props.params, {
    headers: {
      Authorization : `Bearer ${props.accessToken}`
    }
  })) as AxiosResponse<any>;
}

export async function updateFolder(props : FuncProps) {
  return (await request.put(`/ps/folders`, props.params, {
    headers: {
      Authorization : `Bearer ${props.accessToken}`
    }
  })) as AxiosResponse<any>;
}