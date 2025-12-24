import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@rizumu/tanstack/api/config/axiosClient";
import { PROGRESS_ENDPOINTS } from "@rizumu/tanstack/endpoint";
import { queryKeys } from "@rizumu/tanstack/api/query/queryKeys";
import type { ModelStat } from "@rizumu/models/stats";
import type { ModelProgress } from "@rizumu/models/progress";
import type { ModelGiftTransaction } from "@rizumu/models/giftTransaction";
import type { ModelStreak } from "@rizumu/models/streak";

/**
 * Hook to fetch user's own stats
 */
export const useStats = (enabled = true) => {
  return useQuery<ModelStat>({
    queryKey: queryKeys.progress.stats(),
    queryFn: async () => {
      const response = await axiosClient.get(PROGRESS_ENDPOINTS.STATS);
      return response.data.data;
    },
    enabled,
  });
};

/**
 * Hook to fetch stats by user ID
 */
export const useStatsById = (userId: string, enabled = true) => {
  return useQuery<ModelStat>({
    queryKey: queryKeys.progress.statsById(userId),
    queryFn: async () => {
      const response = await axiosClient.get(
        PROGRESS_ENDPOINTS.STATS_BY_ID(userId)
      );
      return response.data.data;
    },
    enabled: !!userId && enabled,
  });
};

/**
 * Hook to update user's stats (used by backend after session completion)
 */
export const useUpdateStats = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (stats: Partial<ModelStat>) => {
      const response = await axiosClient.patch(
        PROGRESS_ENDPOINTS.UPDATE_STATS,
        stats
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate both own stats and progress queries
      queryClient.invalidateQueries({ queryKey: queryKeys.progress.stats() });
      queryClient.invalidateQueries({ queryKey: queryKeys.progress.all });
    },
  });
};

/**
 * Hook to fetch user's own progress/streak
 */
export const useProgress = (enabled = true) => {
  return useQuery<ModelStreak>({
    queryKey: queryKeys.progress.streak(),
    queryFn: async () => {
      const response = await axiosClient.get(PROGRESS_ENDPOINTS.STREAK);
      return response.data;
    },
    enabled,
  });
};

/**
 * Hook to fetch progress by user ID
 */
export const useProgressById = (userId: string, enabled = true) => {
  return useQuery<ModelProgress>({
    queryKey: queryKeys.progress.progressById(userId),
    queryFn: async () => {
      const response = await axiosClient.get(
        PROGRESS_ENDPOINTS.PROGRESS_BY_ID(userId)
      );
      return response.data.data;
    },
    enabled: !!userId && enabled,
  });
};

/**
 * Hook to fetch user's gifts (received or sent)
 */
export const useGifts = (enabled = true) => {
  return useQuery<ModelGiftTransaction[]>({
    queryKey: queryKeys.progress.gifts(),
    queryFn: async () => {
      const response = await axiosClient.get(PROGRESS_ENDPOINTS.GIFT);
      return response.data.data;
    },
    enabled,
  });
};

/**
 * Hook to fetch gift by ID
 */
export const useGiftById = (giftId: string, enabled = true) => {
  return useQuery<ModelGiftTransaction[]>({
    queryKey: queryKeys.progress.giftById(giftId),
    queryFn: async () => {
      const response = await axiosClient.get(
        PROGRESS_ENDPOINTS.GIFT_BY_ID(giftId)
      );
      return response.data.data;
    },
    enabled: !!giftId && enabled,
  });
};

/**
 * Hook to send gift to another user
 */
export const useSendGift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (giftData: { receiverId: string; icon: string }) => {
      const response = await axiosClient.post(
        PROGRESS_ENDPOINTS.SEND_GIFT,
        giftData
      );
      return response.data;
    },
    onSuccess: (data, { receiverId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.progress.giftById(receiverId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.progress.progressById(data?.gift?.senderId),
      });
    },
  });
};
