import { useQuery } from "@tanstack/react-query";
import axiosClient from "@rizumu/tanstack/api/config/axiosClient";
import { MESSAGE_ENDPOINTS } from "@rizumu/tanstack/endpoint";
import { queryKeys } from "@rizumu/tanstack/api/query/queryKeys";

/**
 * Hook to fetch room messages
 * @param roomId - Room ID
 * @param before - Optional timestamp for pagination
 * @param enabled - Whether to enable the query
 */
export const useRoomMessages = (
  roomId: string,
  before?: string,
  enabled = true
) => {
  return useQuery({
    queryKey: queryKeys.messages.list(roomId, before),
    queryFn: async () => {
      const response = await axiosClient.get(
        MESSAGE_ENDPOINTS.BY_ROOM(roomId, before)
      );
      return response.data;
    },
    enabled: enabled && !!roomId,
  });
};
