import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@rizumu/tanstack/api/config/axiosClient";
import { FRIEND_ENDPOINTS } from "@rizumu/tanstack/endpoint";
import { queryKeys } from "@rizumu/tanstack/api/query/queryKeys";
import type { ModelFriend } from "@rizumu/models/friend";
import type { ModelFriendRequest } from "@rizumu/models/friendRequest";

/**
 * Hook to fetch friend list
 */
export const useFriends = (enabled = true) => {
  return useQuery<ModelFriend[]>({
    queryKey: queryKeys.friends.list(),
    queryFn: async () => {
      const response = await axiosClient.get(FRIEND_ENDPOINTS.FRIEND);
      return response.data || [];
    },
    enabled,
  });
};

/**
 * Hook to fetch friend requests received
 */
export const useFriendRequests = (enabled = true) => {
  return useQuery<ModelFriendRequest[]>({
    queryKey: queryKeys.friends.requests(),
    queryFn: async () => {
      const response = await axiosClient.get(FRIEND_ENDPOINTS.GET_REQUESTS);
      return response.data || [];
    },
    enabled,
  });
};

/**
 * Hook to send friend request
 */
export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recipientId: string) => {
      const response = await axiosClient.post(FRIEND_ENDPOINTS.SEND_REQUEST, {
        recipientId,
      });
      return response.data;
    },
    onSuccess: () => {
      // Don't invalidate friends list since request is pending
      // Only invalidate after accept/reject
      queryClient.invalidateQueries({ queryKey: queryKeys.friends.requests() });
    },
  });
};

/**
 * Hook to accept friend request
 */
export const useAcceptFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: string) => {
      const response = await axiosClient.put(FRIEND_ENDPOINTS.ACCEPT, {
        friendshipId: requestId,
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate both friends list and requests
      queryClient.invalidateQueries({ queryKey: queryKeys.friends.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.friends.requests() });
    },
  });
};

/**
 * Hook to delete friend / reject friend request
 */
export const useDeleteFriend = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (friendshipId: string) => {
      const response = await axiosClient.delete(
        FRIEND_ENDPOINTS.DELETE(friendshipId)
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate both friends list and requests
      queryClient.invalidateQueries({ queryKey: queryKeys.friends.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.friends.requests() });
    },
  });
};

/**
 * Hook to check if a user is a friend
 * Utility hook that uses the friends list
 */
export const useIsFriend = (userId: string) => {
  const { data: friends, isLoading } = useFriends();

  const friend = friends?.find((f) => f._id === userId);

  return {
    isFriend: !!friend,
    friendshipId: friend?.friendshipId || null,
    isLoading,
  };
};
