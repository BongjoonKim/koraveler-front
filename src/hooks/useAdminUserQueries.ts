// src/hooks/useAdminUserQueries.ts
// 관리자 사용자 관리 Query/Mutation 훅
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuthEP from "../utils/useAuthEP";
import {
  getAdminUsers,
  getAdminUserDetail,
  updateAdminUserRoles,
  updateAdminUserStatus,
} from "../endpoints/admin-endpoints";
import {
  AdminUserDetailResponse,
  AdminUserListResponse,
  AdminUserStatusFilter,
  AdminUserSummary,
} from "../types/admin/adminUserTypes";

const ADMIN_USERS_KEY = ["admin", "users"] as const;

// 가입자 목록
export const useAdminUsers = (params: {
  page?: number;
  size?: number;
  keyword?: string;
  status?: AdminUserStatusFilter;
}) => {
  const authEP = useAuthEP();

  return useQuery<AdminUserListResponse>({
    queryKey: [...ADMIN_USERS_KEY, "list", params],
    queryFn: async () => {
      const response = await authEP({
        func: getAdminUsers,
        params: {
          page: params.page ?? 0,
          size: params.size ?? 20,
          keyword: params.keyword,
          status: params.status ?? "all",
        },
      });
      return response.data;
    },
    staleTime: 1000 * 60, // 관리 화면이므로 짧게
    gcTime: 1000 * 60 * 5,
    retry: 1,
  });
};

// 사용자 상세 (작성 글 페이징 포함)
export const useAdminUserDetail = (
  userId: string | null,
  docPage = 0,
  docSize = 10
) => {
  const authEP = useAuthEP();

  return useQuery<AdminUserDetailResponse>({
    queryKey: [...ADMIN_USERS_KEY, "detail", userId, docPage, docSize],
    queryFn: async () => {
      const response = await authEP({
        func: getAdminUserDetail,
        params: { userId, docPage, docSize },
      });
      return response.data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    retry: 1,
  });
};

// 권한 변경
export const useUpdateAdminUserRoles = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();

  return useMutation<AdminUserSummary, Error, { userId: string; roles: string[] }>({
    mutationFn: async ({ userId, roles }) => {
      const response = await authEP({
        func: updateAdminUserRoles,
        params: { userId },
        reqBody: { roles },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEY });
    },
  });
};

// 탈퇴 처리 / 계정 복구
export const useUpdateAdminUserStatus = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();

  return useMutation<AdminUserSummary, Error, { userId: string; enabled: boolean }>({
    mutationFn: async ({ userId, enabled }) => {
      const response = await authEP({
        func: updateAdminUserStatus,
        params: { userId },
        reqBody: { enabled },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEY });
    },
  });
};
