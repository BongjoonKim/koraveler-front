import { request } from "../appConfig/request-response";
import { AxiosResponse } from "axios";
import { FuncProps } from "../utils/useAuthEP";
import { TravelChannelMemberResponse, TravelChannelResponse } from "../types/travel/travelChannelTypes";

// 채널 생성
export async function createTravelChannel(props: FuncProps) {
  return (await request.post(
    `api/v1/travels/${props.params.travelId}/channels`,
    props.reqBody,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`,
      },
    }
  )) as AxiosResponse<TravelChannelResponse>;
}

// 채널 목록 조회
export async function getTravelChannels(props: FuncProps) {
  return (await request.get(
    `api/v1/travels/${props.params.travelId}/channels`,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`,
      },
    }
  )) as AxiosResponse<TravelChannelResponse[]>;
}

// 단일 채널 조회
export async function getTravelChannel(props: FuncProps) {
  return (await request.get(
    `api/v1/travels/${props.params.travelId}/channels/${props.params.travelChannelId}`,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`,
      },
    }
  )) as AxiosResponse<TravelChannelResponse>;
}

// 채널 메타데이터 수정
export async function updateTravelChannel(props: FuncProps) {
  return (await request.put(
    `api/v1/travels/${props.params.travelId}/channels/${props.params.travelChannelId}`,
    props.reqBody,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`,
      },
    }
  )) as AxiosResponse<TravelChannelResponse>;
}

// 채널 삭제
export async function deleteTravelChannel(props: FuncProps) {
  return (await request.delete(
    `api/v1/travels/${props.params.travelId}/channels/${props.params.travelChannelId}`,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`,
      },
    }
  )) as AxiosResponse<void>;
}

// 멤버 동기화
export async function syncTravelChannelMembers(props: FuncProps) {
  return (await request.post(
    `api/v1/travels/${props.params.travelId}/channels/${props.params.travelChannelId}/sync`,
    null,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`,
      },
    }
  )) as AxiosResponse<void>;
}

// 채널에 멤버 추가 (Travel 프로젝트 멤버만)
export async function addTravelChannelMember(props: FuncProps) {
  return (await request.post(
    `api/v1/travels/${props.params.travelId}/channels/${props.params.travelChannelId}/members/${props.params.targetUserId}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`,
      },
    }
  )) as AxiosResponse<void>;
}

// 채널에서 멤버 제거
export async function removeTravelChannelMember(props: FuncProps) {
  return (await request.delete(
    `api/v1/travels/${props.params.travelId}/channels/${props.params.travelChannelId}/members/${props.params.targetUserId}`,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`,
      },
    }
  )) as AxiosResponse<void>;
}

// 채널에 추가 가능한 Travel 멤버 목록 조회
export async function getAvailableMembersForChannel(props: FuncProps) {
  return (await request.get(
    `api/v1/travels/${props.params.travelId}/channels/${props.params.travelChannelId}/available-members`,
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`,
      },
    }
  )) as AxiosResponse<TravelChannelMemberResponse[]>;
}
