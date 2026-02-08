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

// Update user account info
export const updateUserAccount = async ({ accessToken, reqBody }: FuncProps) => {
  const response = await request.put('/ps/user/account', reqBody, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return response;
};

// 내 프로필 조회
export const getUserProfile = async ({ accessToken }: FuncProps) => {
  const response = await request.get('/api/v1/user/profile', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return response;
};

// 프로필 수정
export const updateUserProfile = async ({ accessToken, reqBody }: FuncProps) => {
  const response = await request.put('/api/v1/user/profile', reqBody, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return response;
};

// 비밀번호 변경
export const changePassword = async ({ accessToken, reqBody }: FuncProps) => {
  const response = await request.put('/api/v1/user/password', reqBody, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return response;
};

// 회원 탈퇴
export const deleteUserAccount = async ({ accessToken, reqBody }: FuncProps) => {
  const response = await request.delete('/api/v1/user/account', {
    data: reqBody,
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