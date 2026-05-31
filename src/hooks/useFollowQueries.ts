import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import useAuthEP from "../utils/useAuthEP";
import {
  followUser,
  getFollowStatus,
  getMyFollowers,
  getMyFollowing,
  unfollowUser,
} from "../endpoints/follow-endpoints";
import {FollowStatusDTO, FollowUserDTO} from "../types/follow/followTypes";

export const useFollowStatus = (targetUserId?: string, viewerKey?: string | null) => {
  // viewerKey 가 바뀌면 캐시도 분리되어야 함 (로그인/로그아웃 전환 시).
  return useQuery<FollowStatusDTO | null>({
    queryKey: ["follow-status", targetUserId, viewerKey ?? "anon"],
    queryFn: async () => {
      if (!targetUserId) return null;
      const res = await getFollowStatus({ params: { targetUserId } });
      return res.data;
    },
    enabled: !!targetUserId,
    staleTime: 1000 * 30,
  });
};

export const useMyFollowing = (enabled: boolean = true) => {
  const authEP = useAuthEP();
  return useQuery<FollowUserDTO[]>({
    queryKey: ["follow", "me", "following"],
    queryFn: async () => {
      const res = await authEP({ func: getMyFollowing });
      return res.data || [];
    },
    enabled,
    staleTime: 1000 * 60,
  });
};

export const useMyFollowers = (enabled: boolean = true) => {
  const authEP = useAuthEP();
  return useQuery<FollowUserDTO[]>({
    queryKey: ["follow", "me", "followers"],
    queryFn: async () => {
      const res = await authEP({ func: getMyFollowers });
      return res.data || [];
    },
    enabled,
    staleTime: 1000 * 60,
  });
};

export const useFollowUser = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  return useMutation<FollowStatusDTO, Error, string>({
    mutationFn: async (targetUserId) => {
      const res = await authEP({ func: followUser, params: { targetUserId } });
      return res.data;
    },
    onSuccess: (_data, targetUserId) => {
      queryClient.invalidateQueries({ queryKey: ["follow-status", targetUserId] });
      queryClient.invalidateQueries({ queryKey: ["follow", "me"] });
      queryClient.invalidateQueries({ queryKey: ["following-feed"] });
      queryClient.invalidateQueries({ queryKey: ["user-badges"] });
    },
  });
};

export const useUnfollowUser = () => {
  const authEP = useAuthEP();
  const queryClient = useQueryClient();
  return useMutation<FollowStatusDTO, Error, string>({
    mutationFn: async (targetUserId) => {
      const res = await authEP({ func: unfollowUser, params: { targetUserId } });
      return res.data;
    },
    onSuccess: (_data, targetUserId) => {
      queryClient.invalidateQueries({ queryKey: ["follow-status", targetUserId] });
      queryClient.invalidateQueries({ queryKey: ["follow", "me"] });
      queryClient.invalidateQueries({ queryKey: ["following-feed"] });
      queryClient.invalidateQueries({ queryKey: ["user-badges"] });
    },
  });
};
