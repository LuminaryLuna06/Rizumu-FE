import Header from "./components/Header";
import Footer from "./components/Footer";
import Timer from "./components/Timer";
import OnlineUsers from "../../components/OnlineUsers";
import { useAuth } from "@rizumu/context/AuthContext";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Modal from "@rizumu/components/Modal";
import ResponsiveButton from "@rizumu/components/ResponsiveButton";
import { useToast } from "@rizumu/utils/toast/toast";
import { useSocket } from "@rizumu/context/SocketContext";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@rizumu/tanstack/api/query/queryKeys";
import type { ModelTag } from "@rizumu/models/tag";

import ProfileModal from "@rizumu/components/ProfileModal";
import {
  useJoinRoom,
  useRoomBySlug,
  useRoomById,
} from "@rizumu/tanstack/api/hooks";
import Tasks from "./components/Tasks";

import BackgroundView from "./components/BackgroundView";

function PomodoroPage() {
  const toast = useToast();
  const { user, isAuthenticated } = useAuth();
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [background, setBackground] = useState({
    name: "/image/aurora-2k.webp",
    type: "static",
  });

  const [joinRoomModalOpened, setJoinRoomModalOpened] = useState(false);
  const [hasCheckedQuery, setHasCheckedQuery] = useState(false);
  const [sharedUserId, setSharedUserId] = useState<string | null>();
  const [profileModalOpened, setProfileModalOpened] = useState(false);

  const roomSlug = searchParams.get("rid");
  const userId = searchParams.get("uid");
  const join = useJoinRoom();
  const { data: room, isLoading } = useRoomBySlug(
    roomSlug || "",
    !!roomSlug && isAuthenticated
  );
  const { data: currentRoom } = useRoomById(
    user?.current_room_id || "",
    !!user?.current_room_id
  );
  const [members, setMembers] = useState<any[]>([]);
  const [selectedTag, setSelectedTag] = useState<ModelTag | null>(null);

  // Save tag to localStorage
  useEffect(() => {
    if (!user) return;
    const key = `pomodoro_selected_tag_${user._id}`;
    try {
      if (selectedTag) {
        localStorage.setItem(key, JSON.stringify(selectedTag));
      } else {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error("Failed to save selected tag:", error);
    }
  }, [selectedTag, user]);

  const handleJoinRoom = () => {
    if (!room) return;
    join.mutate(room._id, {
      onSuccess: () => {
        toast.success("Joined room successfully!", "Success");
        setJoinRoomModalOpened(false);
        setSearchParams({});
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to join!",
          "Error"
        );
      },
    });
  };

  const handleDeclineJoin = () => {
    setJoinRoomModalOpened(false);
    setSearchParams({});
  };

  // Check for rid query parameter when page loads
  useEffect(() => {
    if (roomSlug && user && !hasCheckedQuery && !isLoading) {
      if (room) {
        setHasCheckedQuery(true);
        if (user.current_room_id !== room._id) {
          setJoinRoomModalOpened(true);
        } else if (user.current_room_id === room._id) {
          setSearchParams({});
        }
      }
    }
  }, [roomSlug, user, hasCheckedQuery, room, isLoading]);

  // Check for uid query parameter when page loads
  useEffect(() => {
    if (userId && !!user) {
      setSharedUserId(userId);
      setProfileModalOpened(true);

      setSearchParams((prev) => {
        prev.delete("uid");
        return prev;
      });
    }
  }, [userId, user]);

  //Listen for background changes
  useEffect(() => {
    if (!socket) return;

    const handleBackgroundChanged = (data: any) => {
      if (data.background) {
        setBackground({
          name: data.background.name,
          type: data.background.type,
        });

        if (data.changed_by?.id !== user?._id) {
          toast.info(`Admin changed the background`, "Background Update");
        }
      }
    };

    socket.on("background_changed", handleBackgroundChanged);

    return () => {
      socket.off("background_changed", handleBackgroundChanged);
    };
  }, [socket, user?._id]);

  // Listen for online users and status changes
  useEffect(() => {
    if (!socket) return;

    const handleRoomOnlineUsers = (data: any[]) => {
      setMembers(data);
    };

    const handleUserOnline = (data: {
      user_id?: string;
      name?: string;
      avatar?: string;
      status: "online";
    }) => {
      if (!data.user_id) {
        console.warn("user_online event missing user_id");
        return;
      }

      if (user?.current_room_id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.rooms.members(user.current_room_id),
        });
      }

      setMembers((prev) => {
        const existingIndex = prev.findIndex((m) => m.user_id === data.user_id);

        if (existingIndex >= 0) {
          return prev.map((member) =>
            member.user_id === data.user_id
              ? {
                  ...member,
                  status: "online",
                  avatar: data.avatar || member.avatar,
                }
              : member
          );
        } else {
          return [
            ...prev,
            {
              user_id: data.user_id!,
              name: data.name || "Unknown",
              avatar: data.avatar || "",
              status: "online",
            },
          ];
        }
      });
    };

    // Listen for user going offline
    const handleUserOffline = (data: {
      user_id?: string;
      name?: string;
      status: "offline";
    }) => {
      if (!data.user_id) {
        console.warn("user_offline event missing user_id");
        return;
      }

      if (user?.current_room_id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.rooms.members(user.current_room_id),
        });
      }

      setMembers((prev) =>
        prev.filter((member) => member.user_id !== data.user_id)
      );
    };

    socket.on("room_online_users", handleRoomOnlineUsers);
    socket.on("user_online", handleUserOnline);
    socket.on("user_offline", handleUserOffline);

    return () => {
      socket.off("room_online_users", handleRoomOnlineUsers);
      socket.off("user_online", handleUserOnline);
      socket.off("user_offline", handleUserOffline);
    };
  }, [socket]);

  const lastLoadedRoomId = useRef<string | null>(null);

  // Update background when user joins a room or switches rooms (do not overwrite on local selection)
  useEffect(() => {
    if (currentRoom?._id) {
      if (lastLoadedRoomId.current !== currentRoom._id) {
        lastLoadedRoomId.current = currentRoom._id;
        if (
          currentRoom.background?.name &&
          currentRoom.background.name !== "default_bg"
        ) {
          setBackground({
            name: currentRoom.background.name,
            type: currentRoom.background.type || "static",
          });
        }
      }
    } else if (!user) {
      lastLoadedRoomId.current = null;
      setBackground({
        name: "/image/aurora-2k.webp",
        type: "static",
      });
    }
  }, [currentRoom?._id, currentRoom?.background?.name, user]);

  const handleBackgroundChange = (bg: { name: string; type: string }) => {
    setBackground(bg);
  };

  return (
    <>
      <div className="flex flex-col h-[100dvh] w-full overflow-hidden text-secondary font-light text-sm z-base">
        {/* Smooth 2-Layer Cross-fade Background */}
        <BackgroundView background={background} />

        {/* Online Users Display */}
        {!!user && <OnlineUsers members={members} />}
        {/* Tasks Display */}
        {!!user && <Tasks />}

        {/* Header */}
        <Header
          focusMode={isFocusMode}
          selectedTag={selectedTag}
          onTagSelect={setSelectedTag}
        />
        {/* Main Content */}
        <Timer
          bgType={background.type}
          bgName={background.name}
          focusMode={isFocusMode}
          selectedTag={selectedTag}
          onTagSelect={setSelectedTag}
          setFocusMode={(mode?: boolean | ((prev: boolean) => boolean)) =>
            setIsFocusMode(
              typeof mode === "boolean"
                ? mode
                : typeof mode === "function"
                ? mode
                : (prev) => !prev
            )
          }
        />
        {/* Footer */}
        <Footer
          onBackgroundChange={handleBackgroundChange}
          focusMode={isFocusMode}
        />
      </div>

      {/* Join Room Modal */}
      <Modal
        opened={joinRoomModalOpened}
        onClose={handleDeclineJoin}
        title="Join a room"
        closeOnClickOutside={false}
      >
        <div className="space-y-md">
          {isLoading ? (
            <div className="text-center py-lg">
              <p className="text-secondary/60">Loading room information...</p>
            </div>
          ) : room ? (
            <div className="flex flex-col justify-center items-center">
              <p className="mb-md">You've been invited to join</p>
              <p className="text-3xl text-text-active font-bold mb-xl">
                {room.name}
              </p>
              <div className="flex justify-center gap-x-sm pt-md">
                <ResponsiveButton
                  onClick={handleDeclineJoin}
                  className="flex justify-center hover:bg-black/90 border w-[200px]"
                  disabled={join.isPending}
                >
                  Decline
                </ResponsiveButton>
                <ResponsiveButton
                  onClick={handleJoinRoom}
                  disabled={join.isPending}
                  className="flex justify-center bg-white hover:bg-white/90 !text-primary border w-[200px]"
                >
                  {join.isPending ? "Joining..." : "Accept"}
                </ResponsiveButton>
              </div>
            </div>
          ) : null}
        </div>
      </Modal>

      <ProfileModal
        opened={profileModalOpened}
        onClose={() => {
          setProfileModalOpened(false);
          setSharedUserId(null);
        }}
        onOpenProfile={() => {}}
        userId={sharedUserId || undefined}
      />
    </>
  );
}

export default PomodoroPage;
