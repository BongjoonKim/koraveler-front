import {request} from "../appConfig/request-response";
import {AxiosResponse} from "axios";
import {FuncProps} from "../utils/endpointUtils";

export async function createDocument(props : FuncProps) {
  return (await request.post("blog/document", props.reqBody, {
    headers : {
      Authorization : `Bearer ${props.accessToken}`
    }
  })) as AxiosResponse<DocumentDTO>;
};

export async function createAfterSaveDocument(props : FuncProps) {
  return (await request.put('blog/document/content', props.reqBody, {
    headers: {
      Authorization : `Bearer ${props.accessToken}`
    }
  })) as AxiosResponse<DocumentDTO>
}

export async function saveDocument(props : FuncProps) {
  return (await request.put('blog/document', props.reqBody, {
    headers: {
      Authorization : `Bearer ${props.accessToken}`
    }
  })) as AxiosResponse<DocumentDTO>
}

export async function getAllDocuments(props : FuncProps) {
  return (await request.get(`blog/ps/documents?page=${props.params?.page}&size=${props.params?.size}&folderId=${props.params?.folderId}`
  )) as AxiosResponse<DocumentsInfo>
}

export async function getDocument(props : FuncProps) {
  return (await request.get(`blog/ps/document?id=${props.params?.id}`)) as AxiosResponse<DocumentDTO>
}