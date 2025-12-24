import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@rizumu/tanstack/api/config/axiosClient";
import { SESSION_ENDPOINTS } from "@rizumu/tanstack/endpoint";
import { queryKeys } from "@rizumu/tanstack/api/query/queryKeys";
import type { ModelUserPomodoroSession } from "@rizumu/models/userPomodoroSession";
import type { ModelLeaderboard } from "@rizumu/models/leaderboard";
import type { ModelHeatmap } from "@rizumu/models/heatmap";

/**
 * Hook to create a new session
 */
export const useCreateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionData: Partial<ModelUserPomodoroSession>) => {
      const response = await axiosClient.post(
        SESSION_ENDPOINTS.CREATE_SESSION,
        sessionData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.progress.all });
    },
  });
};

/**
 * Hook to update/patch a session
 */
export const useUpdateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionData: Partial<ModelUserPomodoroSession>) => {
      const response = await axiosClient.patch(
        SESSION_ENDPOINTS.PATCH_SESSION,
        sessionData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.progress.all });
    },
  });
};

/**
 * Hook to update session note
 */
export const useUpdateSessionNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessionId,
      notes,
    }: {
      sessionId: string;
      notes: string;
    }) => {
      const response = await axiosClient.patch(
        SESSION_ENDPOINTS.PATCH_NOTE(sessionId),
        { notes }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all });
    },
  });
};

/**
 * Hook to update session tag
 */
export const useUpdateSessionTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessionId,
      tagId,
    }: {
      sessionId: string;
      tagId: string;
    }) => {
      const response = await axiosClient.patch(
        SESSION_ENDPOINTS.PATCH_TAG(sessionId),
        { tag_id: tagId }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all });
    },
  });
};

/**
 * Hook to fetch hourly session data
 */
export const useHourlyData = (
  startTime: string,
  endTime: string,
  userId: string,
  enabled = true
) => {
  return useQuery<number[]>({
    queryKey: queryKeys.sessions.hourly(startTime, endTime, userId),
    queryFn: async () => {
      const response = await axiosClient.get(
        SESSION_ENDPOINTS.HOURLY(startTime, endTime, userId)
      );
      return response.data;
    },
    staleTime: Infinity,
    enabled: !!startTime && !!endTime && !!userId && enabled,
  });
};

/**
 * Hook to fetch daily session data
 */
export const useDailyData = (
  startTime: string,
  endTime: string,
  userId: string,
  enabled = true
) => {
  return useQuery<ModelUserPomodoroSession[]>({
    queryKey: queryKeys.sessions.daily(startTime, endTime, userId),
    queryFn: async () => {
      const response = await axiosClient.get(
        SESSION_ENDPOINTS.DAILY(startTime, endTime, userId)
      );
      return response.data;
    },
    staleTime: Infinity,
    enabled: !!startTime && !!endTime && !!userId && enabled,
  });
};

/**
 * Hook to fetch heatmap data
 */
export const useHeatmapData = (
  startTime: string,
  endTime: string,
  userId: string,
  enabled = true
) => {
  return useQuery<ModelHeatmap>({
    queryKey: queryKeys.sessions.heatmap(startTime, endTime, userId),
    queryFn: async () => {
      const response = await axiosClient.get(
        SESSION_ENDPOINTS.HEATMAP(startTime, endTime, userId)
      );
      return response.data;
    },
    enabled: !!startTime && !!endTime && !!userId && enabled,
  });
};

/**
 * Hook to fetch leaderboard data
 */
export const useLeaderboard = (
  startTime: string,
  endTime: string,
  enabled = true
) => {
  return useQuery<ModelLeaderboard[]>({
    queryKey: queryKeys.sessions.leaderboard(startTime, endTime),
    queryFn: async () => {
      const response = await axiosClient.get(
        SESSION_ENDPOINTS.LEADERBOARD(startTime, endTime)
      );
      return response.data.data;
    },
    enabled: !!startTime && !!endTime && enabled,
  });
};

/**
 * Hook to fetch friends leaderboard data
 */
export const useLeaderboardFriend = (
  startTime: string,
  endTime: string,
  enabled = true
) => {
  return useQuery<ModelLeaderboard[]>({
    queryKey: queryKeys.sessions.leaderboardFriend(startTime, endTime),
    queryFn: async () => {
      const response = await axiosClient.get(
        SESSION_ENDPOINTS.LEADERBOARD_FRIEND(startTime, endTime)
      );
      return response.data.data;
    },
    enabled: !!startTime && !!endTime && enabled,
  });
};
