import useAuthEP from "../utils/useAuthEP";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  TravelResponse,
  TravelListResponse,
  TravelCreateRequest,
  TravelUpdateRequest,
  TravelMemberRequest,
  TravelRegionsRequest,
  TravelRole,
  TravelMedia,
} from "../types/travel/travelTypes";
import {
  createTravel,
  getTravel,
  getMyTravels,
  updateTravel,
  updateTravelRegions,
  deleteTravel,
  addTravelMember,
  removeTravelMember,
  updateMemberRole,
  uploadTravelMedia,
  getTravelMedia,
  deleteTravelMedia,
  downloadTravelMediaFile,
  downloadTravelMediaBatch,
} from "../endpoints/travel-endpoints";

// 내 여행 목록 조회
export const useGetMyTravels = (page = 0, size = 10) => {
  const authEP = useAuthEP();

  return useQuery<TravelListResponse>({
    queryKey: ["myTravels", page, size],
    queryFn: async () => {
      const response = await authEP({
        func: getMyTravels,
        params: { page, size },
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

// 여행 상세 조회
export const useGetTravel = (travelId?: string) => {
  const authEP = useAuthEP();

  return useQuery<TravelResponse>({
    queryKey: ["travel", travelId],
    queryFn: async () => {
      if (!travelId) throw new Error("travelId is required");
      const response = await authEP({
        func: getTravel,
        params: { travelId },
      });
      return response.data;
    },
    enabled: !!travelId,
    staleTime: 1000 * 60 * 5,
  });
};

// 여행 생성
export const useCreateTravel = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();

  return useMutation<TravelResponse, Error, TravelCreateRequest>({
    mutationFn: async (reqBody) => {
      const response = await authEP({
        func: createTravel,
        reqBody,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myTravels"] });
    },
  });
};

// 여행 수정
export const useUpdateTravel = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();

  return useMutation<
    TravelResponse,
    Error,
    { travelId: string; reqBody: TravelUpdateRequest }
  >({
    mutationFn: async ({ travelId, reqBody }) => {
      const response = await authEP({
        func: updateTravel,
        params: { travelId },
        reqBody,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["travel", data.id] });
      queryClient.invalidateQueries({ queryKey: ["myTravels"] });
    },
  });
};

// 방문 지역(시/군) 갱신 — Korea Map 플러그인
export const useUpdateTravelRegions = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();

  return useMutation<
    TravelResponse,
    Error,
    { travelId: string; reqBody: TravelRegionsRequest }
  >({
    mutationFn: async ({ travelId, reqBody }) => {
      const response = await authEP({
        func: updateTravelRegions,
        params: { travelId },
        reqBody,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["travel", data.id] });
      queryClient.invalidateQueries({ queryKey: ["myTravels"] });
    },
  });
};

// 여행 삭제
export const useDeleteTravel = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (travelId) => {
      await authEP({
        func: deleteTravel,
        params: { travelId },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myTravels"] });
    },
  });
};

// 멤버 추가
export const useAddTravelMember = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();

  return useMutation<
    TravelResponse,
    Error,
    { travelId: string; reqBody: TravelMemberRequest }
  >({
    mutationFn: async ({ travelId, reqBody }) => {
      const response = await authEP({
        func: addTravelMember,
        params: { travelId },
        reqBody,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["travel", data.id] });
    },
  });
};

// 멤버 삭제
export const useRemoveTravelMember = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { travelId: string; userId: string }>({
    mutationFn: async ({ travelId, userId }) => {
      await authEP({
        func: removeTravelMember,
        params: { travelId, userId },
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["travel", variables.travelId],
      });
    },
  });
};

// 멤버 역할 변경
export const useUpdateMemberRole = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();

  return useMutation<
    TravelResponse,
    Error,
    { travelId: string; userId: string; role: TravelRole }
  >({
    mutationFn: async ({ travelId, userId, role }) => {
      const response = await authEP({
        func: updateMemberRole,
        params: { travelId, userId, role },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["travel", data.id] });
    },
  });
};

// 미디어 목록 조회
export const useGetTravelMedia = (travelId?: string, page = 0, size = 50) => {
  const authEP = useAuthEP();

  return useQuery<TravelMedia[]>({
    queryKey: ["travelMedia", travelId, page, size],
    queryFn: async () => {
      if (!travelId) throw new Error("travelId is required");
      const response = await authEP({
        func: getTravelMedia,
        params: { travelId, page, size },
      });
      return response.data;
    },
    enabled: !!travelId,
    staleTime: 1000 * 60 * 3,
  });
};

// 미디어 업로드
export const useUploadTravelMedia = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();

  return useMutation<
    TravelMedia,
    Error,
    { travelId: string; file: File; description?: string }
  >({
    mutationFn: async ({ travelId, file, description }) => {
      const response = await authEP({
        func: uploadTravelMedia,
        params: { travelId, file },
        reqBody: description ? { description } : undefined,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["travelMedia", variables.travelId],
      });
    },
  });
};

// 미디어 삭제
export const useDeleteTravelMedia = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { travelId: string; mediaId: string }>({
    mutationFn: async ({ travelId, mediaId }) => {
      await authEP({
        func: deleteTravelMedia,
        params: { travelId, mediaId },
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["travelMedia", variables.travelId],
      });
    },
  });
};

// 미디어 다운로드
export const useDownloadTravelMedia = () => {
  const authEP = useAuthEP();

  const downloadSingle = async (
    travelId: string,
    mediaId: string,
    fileName: string
  ) => {
    const response = await authEP({
      func: downloadTravelMediaFile,
      params: { travelId, mediaId },
    });
    const url = URL.createObjectURL(response.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadBatch = async (travelId: string, mediaIds: string[]) => {
    const response = await authEP({
      func: downloadTravelMediaBatch,
      params: { travelId },
      reqBody: { mediaIds },
    });
    const url = URL.createObjectURL(response.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = "travel-media.zip";
    a.click();
    URL.revokeObjectURL(url);
  };

  return { downloadSingle, downloadBatch };
};
