import { request } from "../appConfig/request-response";
import { AxiosResponse } from "axios";
import { FuncProps } from "../utils/useAuthEP";
import {
  TravelResponse,
  TravelListResponse,
  TravelMedia,
} from "../types/travel/travelTypes";

// Travel CRUD
export async function createTravel(props: FuncProps) {
  return (await request.post("api/v1/travels", props.reqBody, {
    headers: {
      Authorization: `Bearer ${props.accessToken}`,
    },
  })) as AxiosResponse<TravelResponse>;
}

export async function getTravel(props: FuncProps) {
  return (await request.get(`api/v1/travels/${props.params.travelId}`, {
    headers: {
      Authorization: `Bearer ${props.accessToken}`,
    },
  })) as AxiosResponse<TravelResponse>;
}

export async function updateTravel(props: FuncProps) {
  return (await request.put(
    `api/v1/travels/${props.params.travelId}`,
    props.reqBody,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`,
      },
    }
  )) as AxiosResponse<TravelResponse>;
}

export async function deleteTravel(props: FuncProps) {
  return (await request.delete(`api/v1/travels/${props.params.travelId}`, {
    headers: {
      Authorization: `Bearer ${props.accessToken}`,
    },
  })) as AxiosResponse<void>;
}

// Travel List
export async function getMyTravels(props: FuncProps) {
  return (await request.get(
    `api/v1/travels/my?page=${props.params?.page ?? 0}&size=${props.params?.size ?? 10}`,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`,
      },
    }
  )) as AxiosResponse<TravelListResponse>;
}

export async function getPublicTravels(props: FuncProps) {
  return (await request.get(
    `api/v1/travels/public?page=${props.params?.page ?? 0}&size=${props.params?.size ?? 10}`
  )) as AxiosResponse<TravelListResponse>;
}

// Visited Regions (Korea Map)
export async function updateTravelRegions(props: FuncProps) {
  return (await request.put(
    `api/v1/travels/${props.params.travelId}/regions`,
    props.reqBody,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`,
      },
    }
  )) as AxiosResponse<TravelResponse>;
}

// Member Management
export async function addTravelMember(props: FuncProps) {
  return (await request.post(
    `api/v1/travels/${props.params.travelId}/members`,
    props.reqBody,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`,
      },
    }
  )) as AxiosResponse<TravelResponse>;
}

export async function removeTravelMember(props: FuncProps) {
  return (await request.delete(
    `api/v1/travels/${props.params.travelId}/members/${props.params.userId}`,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`,
      },
    }
  )) as AxiosResponse<void>;
}

export async function updateMemberRole(props: FuncProps) {
  return (await request.put(
    `api/v1/travels/${props.params.travelId}/members/${props.params.userId}/role?role=${props.params.role}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`,
      },
    }
  )) as AxiosResponse<TravelResponse>;
}

// Schedule Management
export async function addTravelSchedule(props: FuncProps) {
  return (await request.post(
    `api/v1/travels/${props.params.travelId}/schedules`,
    props.reqBody,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`,
      },
    }
  )) as AxiosResponse<TravelResponse>;
}

export async function updateTravelSchedule(props: FuncProps) {
  return (await request.put(
    `api/v1/travels/${props.params.travelId}/schedules/${props.params.scheduleId}`,
    props.reqBody,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`,
      },
    }
  )) as AxiosResponse<TravelResponse>;
}

export async function deleteTravelSchedule(props: FuncProps) {
  return (await request.delete(
    `api/v1/travels/${props.params.travelId}/schedules/${props.params.scheduleId}`,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`,
      },
    }
  )) as AxiosResponse<TravelResponse>;
}

// Media Management
export async function uploadTravelMedia(props: FuncProps) {
  const formData = new FormData();
  formData.append("file", props.params.file);
  if (props.reqBody) {
    formData.append(
      "request",
      new Blob([JSON.stringify(props.reqBody)], { type: "application/json" })
    );
  }
  return (await request.post(
    `api/v1/travels/${props.params.travelId}/media`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    }
  )) as AxiosResponse<TravelMedia>;
}

export async function getTravelMedia(props: FuncProps) {
  return (await request.get(
    `api/v1/travels/${props.params.travelId}/media?page=${props.params?.page ?? 0}&size=${props.params?.size ?? 20}`,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`,
      },
    }
  )) as AxiosResponse<TravelMedia[]>;
}

export async function deleteTravelMedia(props: FuncProps) {
  return (await request.delete(
    `api/v1/travels/${props.params.travelId}/media/${props.params.mediaId}`,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`,
      },
    }
  )) as AxiosResponse<void>;
}

// Media Download
export async function downloadTravelMediaFile(props: FuncProps) {
  return (await request.get(
    `api/v1/travels/${props.params.travelId}/media/${props.params.mediaId}/download`,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`,
      },
      responseType: "blob",
    }
  )) as AxiosResponse<Blob>;
}

export async function downloadTravelMediaBatch(props: FuncProps) {
  return (await request.post(
    `api/v1/travels/${props.params.travelId}/media/download`,
    props.reqBody,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`,
      },
      responseType: "blob",
    }
  )) as AxiosResponse<Blob>;
}
