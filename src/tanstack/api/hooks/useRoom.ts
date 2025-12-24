import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@rizumu/tanstack/api/config/axiosClient";
import { ROOM_ENDPOINTS } from "@rizumu/tanstack/endpoint";
import { queryKeys } from "@rizumu/tanstack/api/query/queryKeys";
import type { ModelRoom } from "@rizumu/models/room";
import type { ModelPublicRoom } from "@rizumu/models/publicRoom";
import type { ModelRoomMember } from "@rizumu/models/roomMember";

/**
 * Hook to fetch room by ID
 */
export const useRoomById = (roomId: string, enabled = true) => {
  return useQuery<ModelRoom>({
    queryKey: queryKeys.rooms.byId(roomId),
    queryFn: async () => {
      const response = await axiosClient.get(ROOM_ENDPOINTS.BY_ID(roomId));
      return response.data;
    },
    enabled: !!roomId && enabled,
  });
};

/**
 * Hook to fetch room by slug
 */
export const useRoomBySlug = (slug: string, enabled = true) => {
  return useQuery<ModelRoom>({
    queryKey: queryKeys.rooms.bySlug(slug),
    queryFn: async () => {
      const response = await axiosClient.get(ROOM_ENDPOINTS.BY_SLUG(slug));
      return response.data;
    },
    enabled: !!slug && enabled,
  });
};

/**
 * Hook to fetch public rooms
 */
export const usePublicRooms = (enabled = true) => {
  return useQuery<ModelPublicRoom[]>({
    queryKey: queryKeys.rooms.public(),
    queryFn: async () => {
      const response = await axiosClient.get(ROOM_ENDPOINTS.PUBLIC);
      return response.data;
    },
    enabled,
  });
};

/**
 * Hook to fetch room members
 */
export const useRoomMembers = (roomId: string, enabled = true) => {
  return useQuery<ModelRoomMember[]>({
    queryKey: queryKeys.rooms.members(roomId),
    queryFn: async () => {
      const response = await axiosClient.get(ROOM_ENDPOINTS.MEMBERS(roomId));
      return response.data;
    },
    enabled: !!roomId && enabled,
  });
};

/**
 * Hook to join a room
 */
export const useJoinRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roomId: string) => {
      const response = await axiosClient.post(ROOM_ENDPOINTS.JOIN(roomId));
      return response.data;
    },
    onSuccess: (_, roomId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.byId(roomId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
  });
};

/**
 * Hook to leave a room
 */
export const useLeaveRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roomId: string) => {
      const response = await axiosClient.post(ROOM_ENDPOINTS.LEAVE(roomId));
      return response.data;
    },
    onSuccess: (_, roomId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.byId(roomId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
  });
};

/**
 * Hook to update room settings
 */
export const useUpdateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      roomId,
      data,
    }: {
      roomId: string;
      data: Partial<ModelRoom>;
    }) => {
      const response = await axiosClient.patch(
        ROOM_ENDPOINTS.UPDATE_ROOM(roomId),
        data
      );
      return response.data;
    },
    onSuccess: (_, { roomId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.byId(roomId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all });
    },
  });
};

/**
 * Hook to update room background
 */
export const useUpdateRoomBackground = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      roomId,
      background,
    }: {
      roomId: string;
      background: { name: string; type: string };
    }) => {
      const response = await axiosClient.patch(
        ROOM_ENDPOINTS.BACKGROUND(roomId),
        background
      );
      return response.data;
    },
    onSuccess: (_, { roomId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.byId(roomId) });
    },
  });
};

/**
 * Hook to kick a user from room
 */
export const useKickFromRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      roomId,
      userId,
    }: {
      roomId: string;
      userId: string;
    }) => {
      const response = await axiosClient.post(
        ROOM_ENDPOINTS.KARATE_KICK(roomId),
        { user_id: userId }
      );
      return response.data;
    },
    onSuccess: (_, { roomId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.rooms.members(roomId),
      });
    },
  });
};
