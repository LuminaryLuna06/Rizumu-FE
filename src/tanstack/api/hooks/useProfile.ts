import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@rizumu/tanstack/api/config/axiosClient";
import { PROFILE_ENDPOINTS } from "@rizumu/tanstack/endpoint";
import { queryKeys } from "@rizumu/tanstack/api/query/queryKeys";
import type { ModelUserProfile } from "@rizumu/models/userProfile";

/**
 * Hook to fetch user profile by ID
 */
export const useProfileById = (userId: string, enabled = true) => {
  return useQuery<ModelUserProfile>({
    queryKey: queryKeys.profile.byId(userId),
    queryFn: async () => {
      const response = await axiosClient.get(
        PROFILE_ENDPOINTS.PROFILE_BY_ID(userId)
      );
      return response.data.data;
    },
    enabled: !!userId && enabled,
  });
};

/**
 * Hook to upload/update user avatar
 */
export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (avatarFile: File) => {
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      const response = await axiosClient.post(
        PROFILE_ENDPOINTS.AVATAR,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate current user profile to refetch with new avatar
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });

      // Update specific profile cache if user ID is available
      if (data.data?.userId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.profile.byId(data.data.userId),
        });
      }
    },
  });
};

/**
 * Hook to search users by query string
 */
export const useSearchUsers = (query: string, enabled = true) => {
  return useQuery<ModelUserProfile[]>({
    queryKey: queryKeys.profile.search(query),
    queryFn: async () => {
      const response = await axiosClient.get(PROFILE_ENDPOINTS.SEARCH(query));
      return response.data;
    },
    enabled: !!query && query.length > 0 && enabled,
  });
};
