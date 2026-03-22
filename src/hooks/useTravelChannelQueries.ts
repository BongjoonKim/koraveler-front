import useAuthEP from "../utils/useAuthEP";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  TravelChannelMemberResponse,
  TravelChannelResponse,
  TravelChannelCreateRequest,
  TravelChannelUpdateRequest,
} from "../types/travel/travelChannelTypes";
import {
  createTravelChannel,
  getTravelChannels,
  updateTravelChannel,
  deleteTravelChannel,
  syncTravelChannelMembers,
  addTravelChannelMember,
  removeTravelChannelMember,
  getAvailableMembersForChannel,
} from "../endpoints/travel-channel-endpoints";

// 채널 목록 조회
export const useGetTravelChannels = (travelId?: string) => {
  const authEP = useAuthEP();

  return useQuery<TravelChannelResponse[]>({
    queryKey: ["travelChannels", travelId],
    queryFn: async () => {
      if (!travelId) throw new Error("travelId is required");
      const response = await authEP({
        func: getTravelChannels,
        params: { travelId },
      });
      return response.data;
    },
    enabled: !!travelId,
    staleTime: 1000 * 60 * 2,
  });
};

// 채널 생성
export const useCreateTravelChannel = (travelId: string) => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();

  return useMutation<TravelChannelResponse, Error, TravelChannelCreateRequest>({
    mutationFn: async (reqBody) => {
      const response = await authEP({
        func: createTravelChannel,
        params: { travelId },
        reqBody,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["travelChannels", travelId] });
      queryClient.invalidateQueries({ queryKey: ["travel", travelId] });
    },
  });
};

// 채널 메타데이터 수정
export const useUpdateTravelChannel = (travelId: string) => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();

  return useMutation<
    TravelChannelResponse,
    Error,
    { travelChannelId: string; reqBody: TravelChannelUpdateRequest }
  >({
    mutationFn: async ({ travelChannelId, reqBody }) => {
      const response = await authEP({
        func: updateTravelChannel,
        params: { travelId, travelChannelId },
        reqBody,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["travelChannels", travelId] });
    },
  });
};

// 채널 삭제
export const useDeleteTravelChannel = (travelId: string) => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (travelChannelId) => {
      await authEP({
        func: deleteTravelChannel,
        params: { travelId, travelChannelId },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["travelChannels", travelId] });
      queryClient.invalidateQueries({ queryKey: ["travel", travelId] });
    },
  });
};

// 멤버 동기화
export const useSyncTravelChannelMembers = (travelId: string) => {
  const authEP = useAuthEP();

  return useMutation<void, Error, string>({
    mutationFn: async (travelChannelId) => {
      await authEP({
        func: syncTravelChannelMembers,
        params: { travelId, travelChannelId },
      });
    },
  });
};

// 채널에 추가 가능한 Travel 멤버 목록 조회
export const useAvailableMembersForChannel = (
  travelId?: string,
  travelChannelId?: string
) => {
  const authEP = useAuthEP();

  return useQuery<TravelChannelMemberResponse[]>({
    queryKey: ["travelChannelAvailableMembers", travelId, travelChannelId],
    queryFn: async () => {
      if (!travelId || !travelChannelId) throw new Error("travelId and travelChannelId are required");
      const response = await authEP({
        func: getAvailableMembersForChannel,
        params: { travelId, travelChannelId },
      });
      return response.data;
    },
    enabled: !!travelId && !!travelChannelId,
    staleTime: 1000 * 30,
  });
};

// 채널에 멤버 추가 (Travel 프로젝트 멤버만)
export const useAddTravelChannelMember = (travelId: string) => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { travelChannelId: string; targetUserId: string }>({
    mutationFn: async ({ travelChannelId, targetUserId }) => {
      await authEP({
        func: addTravelChannelMember,
        params: { travelId, travelChannelId, targetUserId },
      });
    },
    onSuccess: (_, { travelChannelId }) => {
      queryClient.invalidateQueries({
        queryKey: ["travelChannelAvailableMembers", travelId, travelChannelId],
      });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
};

// 채널에서 멤버 제거
export const useRemoveTravelChannelMember = (travelId: string) => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { travelChannelId: string; targetUserId: string }>({
    mutationFn: async ({ travelChannelId, targetUserId }) => {
      await authEP({
        func: removeTravelChannelMember,
        params: { travelId, travelChannelId, targetUserId },
      });
    },
    onSuccess: (_, { travelChannelId }) => {
      queryClient.invalidateQueries({
        queryKey: ["travelChannelAvailableMembers", travelId, travelChannelId],
      });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
};
