import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@rizumu/tanstack/api/config/axiosClient";
import { TASK_ENDPOINTS } from "@rizumu/tanstack/endpoint";
import { queryKeys } from "@rizumu/tanstack/api/query/queryKeys";
import type { ModelTask } from "@rizumu/models/task";
import { useAuth } from "@rizumu/context/AuthContext";

/**
 * Hook to fetch all tasks of the current user
 */
export const useTasks = (enabled = true) => {
  const { user } = useAuth();
  return useQuery<ModelTask[]>({
    queryKey: queryKeys.tasks.list({ userId: user?._id }),
    queryFn: async () => {
      const response = await axiosClient.get(TASK_ENDPOINTS.TASKS);
      return response.data;
    },
    enabled: enabled && !!user,
  });
};

/**
 * Hook to create a new task
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      note?: string;
      is_complete?: boolean;
      time_complete?: string;
    }) => {
      const payload = {
        ...data,
        user_id: user?._id,
        is_complete: data.is_complete ?? false,
        time_complete: data.time_complete ?? new Date().toISOString(),
      };
      const response = await axiosClient.post(TASK_ENDPOINTS.CREATE, payload);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate task queries to refresh the list
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
};

/**
 * Hook to update a task (title, note, or completion status)
 */
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      data,
    }: {
      taskId: string;
      data: Partial<ModelTask>;
    }) => {
      const response = await axiosClient.patch(
        TASK_ENDPOINTS.UPDATE(taskId),
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
};

/**
 * Hook to delete a specific task
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const response = await axiosClient.delete(TASK_ENDPOINTS.DELETE(taskId));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
};

/**
 * Hook to delete all completed tasks
 */
export const useDeleteCompletedTasks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await axiosClient.delete(
        TASK_ENDPOINTS.DELETE_COMPLETED
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
};
