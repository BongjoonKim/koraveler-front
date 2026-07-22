// src/endpoints/admin-endpoints.ts
// 관리자 사용자 관리 API (백엔드 AdminUserController — admin 권한 필요)
import { FuncProps } from "../utils/useAuthEP";
import { request } from "../appConfig/request-response";

// 가입자 목록 조회 (검색·상태 필터·페이징)
export const getAdminUsers = async ({ accessToken, params }: FuncProps) => {
  const response = await request.get("/api/v1/admin/users", {
    params: {
      page: params?.page ?? 0,
      size: params?.size ?? 20,
      keyword: params?.keyword || undefined,
      status: params?.status || "all",
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
};

// 사용자 상세 (기본 정보 + 작성한 글 + 여행 프로젝트)
export const getAdminUserDetail = async ({ accessToken, params }: FuncProps) => {
  const response = await request.get(`/api/v1/admin/users/${params.userId}`, {
    params: {
      docPage: params?.docPage ?? 0,
      docSize: params?.docSize ?? 10,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
};

// 권한 변경
export const updateAdminUserRoles = async ({ accessToken, params, reqBody }: FuncProps) => {
  const response = await request.put(
    `/api/v1/admin/users/${params.userId}/roles`,
    reqBody,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response;
};

// 탈퇴 처리 / 계정 복구
export const updateAdminUserStatus = async ({ accessToken, params, reqBody }: FuncProps) => {
  const response = await request.patch(
    `/api/v1/admin/users/${params.userId}/status`,
    reqBody,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response;
};
