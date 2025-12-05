import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
  getActiveFeaturedDocuments,
  getFeaturableDocuments,
  getFeaturedHistory, removeFromFeatured,
  setDocumentAsFeatured, updateFeaturedInfo
} from "../endpoints/blog-endpoints";
import useAuthEP from "../utils/useAuthEP";

export const useFeaturedDocuments = (limit = 3) => {
  return useQuery<DocumentDTO[]>({
    queryKey : ['featured', 'active', limit],
    queryFn: async () => {
      const response = await getActiveFeaturedDocuments({
        params: {limit}
      })
      return response.data || [];
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1
  })
}

export const useSetFeatured = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  
  return useMutation<DocumentDTO, Error, {id : string; data: FeaturedRequest}>({
    mutationFn: async ({id, data}) => {
      const response = await authEP({
        func : setDocumentAsFeatured,
        params: {id},
        reqBody: data
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['featured'] });
      queryClient.invalidateQueries({ queryKey: ['featurable'] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      
      // 성공 메시지 (토스트 등 사용 가능)
      console.log('Document set as featured successfully');
    },
    onError: (error) => {
      console.error('Failed to set document as featured:', error);
    }
  })
}

// Featured 해제
export const useRemoveFromFeatured = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  
  return useMutation<DocumentDTO, Error, string>({
    mutationFn: async (id) => {
      const response = await authEP({
        func: removeFromFeatured,
        params: { id }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featured'] });
      queryClient.invalidateQueries({ queryKey: ['featurable'] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    }
  });
};

// Featured 정보 수정
export const useUpdateFeaturedInfo = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  
  return useMutation<DocumentDTO, Error, { id: string; featuredInfo: FeaturedInfo }>({
    mutationFn: async ({ id, featuredInfo }) => {
      const response = await authEP({
        func: updateFeaturedInfo,
        params: { id },
        reqBody: featuredInfo
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featured'] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    }
  });
};

// Featured 가능한 문서 목록 조회
export const useFeaturableDocuments = (params?: {
  page?: number;
  size?: number;
  search?: string;
}) => {
  const authEP = useAuthEP();
  
  return useQuery<DocumentsInfo>({
    queryKey: ['featurable', params],
    queryFn: async () => {
      const response = await authEP({
        func: getFeaturableDocuments,
        params: {
          page: params?.page || 0,
          size: params?.size || 20,
          search: params?.search
        }
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1
  });
};

// Featured 히스토리 조회
export const useFeaturedHistory = (params?: {
  page?: number;
  size?: number;
}) => {
  const authEP = useAuthEP();
  
  return useQuery<DocumentsInfo>({
    queryKey: ['featured', 'history', params],
    queryFn: async () => {
      const response = await authEP({
        func: getFeaturedHistory,
        params: {
          page: params?.page || 0,
          size: params?.size || 10
        }
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1
  });
};