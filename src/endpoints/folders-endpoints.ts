import {request} from "../appConfig/request-response";
import {AxiosResponse} from "axios";
import {useAuth} from "../appConfig/AuthContext";
import {FuncProps} from "../utils/endpointUtils";

export async function getAllLoginUserFolders(props : FuncProps) {
  return (await request.get(`/ps/folders/all`, {
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