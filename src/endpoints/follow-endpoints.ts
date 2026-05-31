// src/endpoints/follow-endpoints.ts
import {AxiosResponse} from "axios";
import {request} from "../appConfig/request-response";
import {FuncProps} from "../utils/useAuthEP";
import {FollowStatusDTO, FollowUserDTO} from "../types/follow/followTypes";

// 팔로우 (인증 필요)
export async function followUser(props: FuncProps) {
  return (await request.post(`/api/v1/follows/${props.params?.targetUserId}`, undefined, {
    headers: {
      Authorization: `Bearer ${props.accessToken}`
    }
  })) as AxiosResponse<FollowStatusDTO>;
}

// 언팔로우 (인증 필요)
export async function unfollowUser(props: FuncProps) {
  return (await request.delete(`/api/v1/follows/${props.params?.targetUserId}`, {
    headers: {
      Authorization: `Bearer ${props.accessToken}`
    }
  })) as AxiosResponse<FollowStatusDTO>;
}

// 팔로우 상태 + 카운트 (비인증 허용 — 로그인 시 isFollowing 채워짐)
export async function getFollowStatus(props: FuncProps) {
  return (await request.get(`/api/v1/follows/ps/${props.params?.targetUserId}/status`, {
    headers: props.accessToken ? { Authorization: `Bearer ${props.accessToken}` } : undefined
  })) as AxiosResponse<FollowStatusDTO>;
}

// 내가 팔로우 중인 사용자 목록
export async function getMyFollowing(props: FuncProps) {
  return (await request.get(`/api/v1/follows/me/following`, {
    headers: {
      Authorization: `Bearer ${props.accessToken}`
    }
  })) as AxiosResponse<FollowUserDTO[]>;
}

// 내 팔로워 목록
export async function getMyFollowers(props: FuncProps) {
  return (await request.get(`/api/v1/follows/me/followers`, {
    headers: {
      Authorization: `Bearer ${props.accessToken}`
    }
  })) as AxiosResponse<FollowUserDTO[]>;
}

// 특정 사용자의 팔로워 목록 (공개)
export async function getUserFollowers(props: FuncProps) {
  return (await request.get(`/api/v1/follows/ps/${props.params?.targetUserId}/followers`)) as AxiosResponse<FollowUserDTO[]>;
}

// 특정 사용자가 팔로우 중인 사용자 목록 (공개)
export async function getUserFollowing(props: FuncProps) {
  return (await request.get(`/api/v1/follows/ps/${props.params?.targetUserId}/following`)) as AxiosResponse<FollowUserDTO[]>;
}
