import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuthEP from "../utils/useAuthEP";
import {
  getDiscoveryDigest,
  requestDiscoveryCollect,
} from "../endpoints/discovery-endpoints";
import {
  DiscoveryCollectRequest,
  DiscoveryDigestResponse,
} from "../types/discovery/discoveryTypes";

const POLL_INTERVAL_MS = 3000;

// 목적지 다이제스트 조회 + 수집 중이면 자동 폴링
export const useDiscoveryDigest = (query: string, locale: string) => {
  return useQuery<DiscoveryDigestResponse>({
    queryKey: ["discoveryDigest", query.trim().toLowerCase(), locale],
    queryFn: async () => {
      const response = await getDiscoveryDigest({ params: { query, locale } });
      return response.data;
    },
    enabled: !!query.trim(),
    refetchInterval: (q) => {
      const status = q.state.data?.jobStatus;
      return status === "QUEUED" || status === "PROCESSING"
        ? POLL_INTERVAL_MS
        : false;
    },
  });
};

// 목적지 정보 수집 요청 (인증 필요)
export const useRequestDiscovery = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();

  return useMutation<
    DiscoveryDigestResponse,
    Error,
    DiscoveryCollectRequest & { force?: boolean }
  >({
    mutationFn: async ({ query, locale, force }) => {
      const response = await authEP({
        func: requestDiscoveryCollect,
        params: { force },
        reqBody: { query, locale },
      });
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "discoveryDigest",
          variables.query.trim().toLowerCase(),
          variables.locale ?? "en",
        ],
      });
    },
  });
};
