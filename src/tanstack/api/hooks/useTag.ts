import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@rizumu/tanstack/api/config/axiosClient";
import { TAG_ENDPOINTS } from "@rizumu/tanstack/endpoint";
import { queryKeys } from "@rizumu/tanstack/api/query/queryKeys";
import type { ModelTag } from "@rizumu/models/tag";
import { useAuth } from "@rizumu/context/AuthContext";

/**
 * Hook to fetch all tags
 */
export const useTags = (enabled = true) => {
  const { user } = useAuth();
  return useQuery<ModelTag[]>({
    queryKey: [...queryKeys.tags.all, user?._id],
    queryFn: async () => {
      const response = await axiosClient.get(TAG_ENDPOINTS.TAGS);
      return response.data;
    },
    enabled: enabled && !!user,
  });
};

/**
 * Hook to create a new tag
 */
export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; color: string }) => {
      const response = await axiosClient.post(TAG_ENDPOINTS.CREATE, data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate tag queries
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });
    },
  });
};

/**
 * Hook to update a tag
 */
export const useUpdateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tagId,
      data,
    }: {
      tagId: string;
      data: Partial<ModelTag>;
    }) => {
      const response = await axiosClient.put(TAG_ENDPOINTS.UPDATE(tagId), data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate tag queries
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });
    },
  });
};

/**
 * Hook to delete a tag
 */
export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tagId: string) => {
      const response = await axiosClient.delete(TAG_ENDPOINTS.DELETE(tagId));
      return response.data;
    },
    onSuccess: () => {
      // Invalidate tag queries
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });
    },
  });
};
