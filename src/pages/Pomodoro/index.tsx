import Header from "./components/Header";
import Footer from "./components/Footer";
import Timer from "./components/Timer";
import { useAuth } from "@rizumu/context/AuthContext";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Modal from "@rizumu/components/Modal";
import ResponsiveButton from "@rizumu/components/ResponsiveButton";
import { useToast } from "@rizumu/utils/toast/toast";

import ProfileModal from "@rizumu/components/ProfileModal";
import {
  useJoinRoom,
  useRoomBySlug,
  useRoomById,
} from "@rizumu/tanstack/api/hooks";

function PomodoroPage() {
  const toast = useToast();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [background, setBackground] = useState({
    name: "/image/aurora-2k.webp",
    type: "static",
  });
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const previousBackgroundName = useRef<string>("");

  const [joinRoomModalOpened, setJoinRoomModalOpened] = useState(false);
  const [hasCheckedQuery, setHasCheckedQuery] = useState(false);
  const [sharedUserId, setSharedUserId] = useState<string | null>();
  const [profileModalOpened, setProfileModalOpened] = useState(false);
  const roomSlug = searchParams.get("rid");
  const userId = searchParams.get("uid");
  const join = useJoinRoom();
  const { data: room, isLoading } = useRoomBySlug(roomSlug || "", !!roomSlug);
  const { data: currentRoom } = useRoomById(
    user?.current_room_id || "",
    !!user?.current_room_id
  );

  useEffect(() => {
    const img = new Image();
    img.onload = () => setIsBackgroundLoaded(true);
    img.onerror = () => setIsBackgroundLoaded(true);
    img.src = "/image/aurora-2k.webp";
  }, []);

  // Preload background image for smooth transitions
  useEffect(() => {
    if (previousBackgroundName.current !== background.name) {
      previousBackgroundName.current = background.name;

      if (background.type === "static") {
        setIsBackgroundLoaded(false);

        let isCancelled = false;
        const img = new Image();

        img.onload = () => {
          if (!isCancelled) {
            setIsBackgroundLoaded(true);
          }
        };

        img.onerror = () => {
          if (!isCancelled) {
            setIsBackgroundLoaded(true);
          }
        };

        img.src = background.name;

        return () => {
          isCancelled = true;
          img.onload = null;
          img.onerror = null;
        };
      } else {
        setIsVideoLoaded(false);
      }
    }
  }, [background]);

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

  // Handle room fetch error
  useEffect(() => {
    if (roomSlug && !isLoading && !room) {
      toast.error("Room not found", "Error");
      setSearchParams({});
    }
  }, [roomSlug, isLoading, room]);

  // Check for uid query parameter when page loads
  useEffect(() => {
    if (userId) {
      setSharedUserId(userId);
      setProfileModalOpened(true);

      setSearchParams((prev) => {
        prev.delete("uid");
        return prev;
      });
    }
  }, [userId]);

  // Update background when user joins a room
  useEffect(() => {
    if (
      currentRoom?.background?.name &&
      currentRoom.background.name !== "default_bg"
    ) {
      setBackground({
        name: currentRoom.background.name,
        type: currentRoom.background.type,
      });
    } else if (!user) {
      setBackground({
        name: "/image/aurora-2k.webp",
        type: "static",
      });
    }
  }, [currentRoom, user]);
  const handleBackgroundChange = (bg: { name: string; type: string }) => {
    setBackground(bg);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen w-full overflow-hidden px-md md:px-xl text-secondary font-light text-sm z-base">
        {background.type === "static" ? (
          <div
            className={`absolute top-0 left-0 w-full h-full bg-cover bg-center -z-10 transition-opacity duration-700 ${
              isBackgroundLoaded ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${background.name})`,
              willChange: "opacity",
              backfaceVisibility: "hidden",
              transform: "translateZ(0)",
            }}
          />
        ) : (
          <video
            src={background.name}
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setIsVideoLoaded(true)}
            className={`absolute top-0 left-0 w-full h-full object-cover -z-10 transition-opacity duration-700 ${
              isVideoLoaded ? "opacity-100" : "opacity-0"
            }`}
            style={{
              willChange: "opacity",
              backfaceVisibility: "hidden",
              transform: "translateZ(0)",
            }}
          />
        )}

        {/* Header */}
        <Header focusMode={isFocusMode} />
        {/* Main Content */}
        <Timer
          bgType={background.type}
          bgName={background.name}
          focusMode={isFocusMode}
          setFocusMode={(mode?: boolean) =>
            setIsFocusMode(typeof mode === "boolean" ? mode : (prev) => !prev)
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
