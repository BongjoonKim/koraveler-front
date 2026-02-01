import useAuthEP from "../utils/useAuthEP";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {DocumentViewResponse, IncreaseViewRequest, ViewStatsDTO} from "../types/blog/blogTypes";
import {getViews, getViewStats, increaseView} from "../endpoints/blog-endpoints";
import {ApiResponse} from "../types/messenger/messengerTypes";

export const useGetViews = (documentId?: string) => {
  return useQuery<DocumentViewResponse>({
    queryKey: ["views", documentId],
    queryFn: async () => {
      if (!documentId) throw new Error("documentId is required");
      const response = await getViews({ params: { documentId } });
      return response.data;
    },
    enabled: !!documentId,
    staleTime: 1000 * 60 * 5, // 5분
  });
};

// 조회수 증가 hook
export const useIncreaseView = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IncreaseViewRequest, Error, string>({
    mutationFn: async (documentId: string) => {
      const response = await increaseView({params: {documentId}});
      return response.data;
    },
    onSuccess: (data, documentId) => {
      queryClient.invalidateQueries({queryKey:["views", documentId]});
      queryClient.invalidateQueries({ queryKey: ["viewStats", documentId] });
    }
  })
  
}

// 상세 조회 통계 hook
export const useGetViewStats = (documentId?: string) => {
  return useQuery<ViewStatsDTO>({
    queryKey: ["viewStats", documentId],
    queryFn: async () => {
      if (!documentId) throw new Error("documentId is required");
      const response = await getViewStats({ params: { documentId } });
      return response.data;
    },
    enabled: !!documentId,
    staleTime: 1000 * 60 * 1, // 1분 (실시간 통계용이므로 더 짧게)
  })
}