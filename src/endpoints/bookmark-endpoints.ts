import {request} from "../appConfig/request-response";
import {AxiosResponse} from "axios";
import {FuncProps} from "../utils/useAuthEP";

export async function createBookmark(props : FuncProps) {
  return (await request.post("/bookmark", props.reqBody, {
    headers : {
      Authorization : `Bearer ${props.accessToken}`
    }
  })) as AxiosResponse<BookmarkDTO>;
};

export async function getIsBookmarked(props : FuncProps) {
  return (await request.get(`/bookmark/document?id=${props.params?.documentId}`, {
    headers: {
      Authorization : `Bearer ${props.accessToken}`
    }
  })) as AxiosResponse<boolean>
}

export async function deleteBookmark (props : FuncProps) {
  return (await request.delete(`/bookmark/document?id=${props.params?.documentId}`, {
    headers: {
      Authorization : `Bearer ${props.accessToken}`
    }
  })) as AxiosResponse<void>
}