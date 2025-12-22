import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axiosClient from "../config/axiosClient";
import { queryKeys } from "../query/queryKeys";

// Types
interface Tag {
  id: string;
  name: string;
  color: string;
  user_id: string;
  created_at: string;
}

interface CreateTagRequest {
  name: string;
  color: string;
}

interface UpdateTagRequest {
  name?: string;
  color?: string;
}

// GET: Lấy danh sách tags
export const useGetTags = () => {
  return useQuery<Tag[], AxiosError>({
    queryKey: queryKeys.tags.lists(),
    queryFn: async () => {
      const { data } = await axiosClient.get("/tags");
      return data;
    },
  });
};

// POST: Tạo tag mới
export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation<Tag, AxiosError, CreateTagRequest>({
    mutationFn: async (tagData) => {
      const { data } = await axiosClient.post("/tags", tagData);
      return data;
    },
    onSuccess: () => {
      // Invalidate tags list để refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });
    },
  });
};

// PUT: Cập nhật tag
export const useUpdateTag = () => {
  const queryClient = useQueryClient();

  return useMutation<Tag, AxiosError, { id: string; data: UpdateTagRequest }>({
    mutationFn: async ({ id, data }) => {
      const response = await axiosClient.put(`/tags/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });
    },
  });
};

// DELETE: Xóa tag
export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, string>({
    mutationFn: async (tagId) => {
      await axiosClient.delete(`/tags/${tagId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });
    },
  });
};
