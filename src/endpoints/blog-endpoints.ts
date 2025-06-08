import {request} from "../appConfig/request-response";
import {AxiosResponse} from "axios";
import {FuncProps} from "../utils/useAuthEP";

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
  return (await request.get(`blog/ps/documents?page=${props.params?.page}&size=${props.params?.size}&folderId=${props.params?.folderId}&dateSort=${props.params?.dateSort}`
  )) as AxiosResponse<DocumentsInfo>
}

export async function searchDocuments(props : FuncProps) {
  return (await request.get(`blog/ps/search/documents?value=${props.params?.value}&page=${props.params?.page}&size=${props.params?.size}`
  )) as AxiosResponse<DocumentsInfo>
}

export async function getDocumentsByAuth(props : FuncProps) {
  return (await request.get(`blog/documents?page=${props.params?.page}&size=${props.params?.size}&folderId=${props.params?.folderId}&type=${props.params?.type}&dateSort=${props.params?.dateSort}`, {
    headers: {
      Authorization : `Bearer ${props.accessToken}`
    }
  })) as AxiosResponse<DocumentsInfo>
}

export async function getDocument(props : FuncProps) {
  return (await request.get(`blog/ps/document?id=${props.params?.id}`)) as AxiosResponse<DocumentDTO>
};

export async function deleteDocument(props : FuncProps) {
  return (await request.delete(`blog/ps/document?id=${props.params?.id}`)) as AxiosResponse<any>;
}