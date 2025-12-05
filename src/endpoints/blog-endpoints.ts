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

// Featured 관련 엔드포인트
export async function getActiveFeaturedDocuments(props: FuncProps) {
  return (await request.get(`blog/ps/featured/active`, {
    params: {
      limit: props.params?.limit || 3
    }
  })) as AxiosResponse<DocumentDTO[]>;
}

export async function setDocumentAsFeatured(props: FuncProps) {
  return (await request.put(`blog/document/${props.params?.id}/feature`, props.reqBody, {
    headers: {
      Authorization: `Bearer ${props.accessToken}`
    }
  })) as AxiosResponse<DocumentDTO>;
}

export async function removeFromFeatured(props: FuncProps) {
  return (await request.delete(`blog/document/${props.params?.id}/feature`, {
    headers: {
      Authorization: `Bearer ${props.accessToken}`
    }
  })) as AxiosResponse<DocumentDTO>;
}

export async function updateFeaturedInfo(props: FuncProps) {
  return (await request.patch(`blog/document/${props.params?.id}/feature`, props.reqBody, {
    headers: {
      Authorization: `Bearer ${props.accessToken}`
    }
  })) as AxiosResponse<DocumentDTO>;
}

export async function getFeaturableDocuments(props: FuncProps) {
  const searchParam = props.params?.search ? `&search=${props.params.search}` : '';
  return (await request.get(`blog/documents/featurable?page=${props.params?.page || 0}&size=${props.params?.size || 20}${searchParam}`, {
    headers: {
      Authorization: `Bearer ${props.accessToken}`
    }
  })) as AxiosResponse<DocumentsInfo>;
}

export async function getFeaturedHistory(props: FuncProps) {
  return (await request.get(`blog/featured/history?page=${props.params?.page || 0}&size=${props.params?.size || 10}`, {
    headers: {
      Authorization: `Bearer ${props.accessToken}`
    }
  })) as AxiosResponse<DocumentsInfo>;
}