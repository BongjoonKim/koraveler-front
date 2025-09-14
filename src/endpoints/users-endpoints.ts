// src/endpoints/user-endpoints.ts
import { FuncProps } from "../utils/useAuthEP";
import { request } from "../appConfig/request-response";

// 사용자 검색 (키워드로)
export const searchUsers = async ({ accessToken, params }: FuncProps) => {
  const response = await request.get('/api/v1/users/search', {
    params: {
      keyword: params.keyword,
      size: params.size || 10,
      excludeChannelId: params.excludeChannelId // 이미 채널에 있는 사용자 제외
    },
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return response;
};

// 사용자 목록 조회 (페이징)
export const getUsers = async ({ accessToken, params }: FuncProps) => {
  const response = await request.get('/api/v1/users', {
    params: {
      page: params.page || 0,
      size: params.size || 20,
      sortBy: params.sortBy || 'createdAt',
      sortDirection: params.sortDirection || 'desc'
    },
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return response;
};

// 특정 사용자 정보 조회
export const getUserById = async ({ accessToken, params }: FuncProps) => {
  const response = await request.get(`/api/v1/users/${params.userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return response;
};

// 채널에 없는 사용자 검색
export const searchUsersNotInChannel = async ({ accessToken, params }: FuncProps) => {
  const response = await request.get('/api/v1/users/search/available', {
    params: {
      keyword: params.keyword,
      channelId: params.channelId,
      size: params.size || 10
    },
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return response;
};