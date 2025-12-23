import Header from "./components/Header";
import Footer from "./components/Footer";
import Timer from "./components/Timer";
import { useAuth } from "@rizumu/context/AuthContext";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Modal from "@rizumu/components/Modal";
import ResponsiveButton from "@rizumu/components/ResponsiveButton";
import { useToast } from "@rizumu/utils/toast/toast";
import type { ModelRoom } from "@rizumu/models/room";
import axiosClient from "@rizumu/tanstack/api/config/axiosClient";

function PomodoroPage() {
  const toast = useToast();
  const { user, refreshUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [background, setBackground] = useState({
    name: "/image/aurora-2k.webp",
    type: "static",
  });
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const previousBackgroundName = useRef<string>("");

  const [joinRoomModalOpened, setJoinRoomModalOpened] = useState(false);
  const [roomToJoin, setRoomToJoin] = useState<ModelRoom | null>(null);
  const [isLoadingRoom, setIsLoadingRoom] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [hasCheckedQuery, setHasCheckedQuery] = useState(false);

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

  const handleCheckRoomInvite = async (slug: string) => {
    try {
      setIsLoadingRoom(true);
      const response = await axiosClient.get(`/room/slug/${slug}`);
      const room = response.data as ModelRoom;

      if (user?.current_room_id === room._id) {
        setSearchParams({});
        return;
      }

      setRoomToJoin(room);
      setJoinRoomModalOpened(true);
    } catch (error: any) {
      console.error("Error fetching room:", error);
      toast.error(error?.response?.data?.message || "Room not found", "Error");
      setSearchParams({});
    } finally {
      setIsLoadingRoom(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomToJoin) return;

    try {
      setIsJoining(true);
      await axiosClient.post(`/room/${roomToJoin._id}/join`);
      toast.success("Joined room successfully!", "Success");
      await refreshUser();
      setJoinRoomModalOpened(false);
      setRoomToJoin(null);
      setSearchParams({});
    } catch (error: any) {
      console.error("Error joining room:", error);
      toast.error(
        error?.response?.data?.message || "Failed to join room",
        "Error"
      );
    } finally {
      setIsJoining(false);
    }
  };

  const handleDeclineJoin = () => {
    setJoinRoomModalOpened(false);
    setRoomToJoin(null);
    setSearchParams({});
  };

  // Check for rid query parameter when page loads
  useEffect(() => {
    const roomSlug = searchParams.get("rid");
    if (roomSlug && user && !hasCheckedQuery) {
      setHasCheckedQuery(true);
      handleCheckRoomInvite(roomSlug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, user, hasCheckedQuery]);

  useEffect(() => {
    if (user) {
      if (user.current_room_id) {
        axiosClient
          .get(`/room/id/${user.current_room_id}`)
          .then((res) => {
            if (res.data?.background.name !== "default_bg") {
              setBackground(res.data.background);
            }
          })
          .catch((err) => console.log(err));
      }
    } else {
      setBackground({
        name: "/image/aurora-2k.webp",
        type: "static",
      });
    }
  }, [user?.current_room_id, user]);

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
        <Header />
        {/* Main Content */}
        <Timer bgType={background.type} bgName={background.name} />
        {/* Footer */}
        <Footer onBackgroundChange={handleBackgroundChange} />
      </div>

      {/* Join Room Modal */}
      <Modal
        opened={joinRoomModalOpened}
        onClose={handleDeclineJoin}
        title="Join a room"
      >
        <div className="space-y-md">
          {isLoadingRoom ? (
            <div className="text-center py-lg">
              <p className="text-secondary/60">Loading room information...</p>
            </div>
          ) : roomToJoin ? (
            <div className="flex flex-col justify-center items-center">
              <p className="mb-md">You've been invited to join</p>
              <p className="text-3xl text-text-active font-bold mb-xl">
                {roomToJoin.name}
              </p>
              <div className="flex justify-center gap-x-sm pt-md">
                <ResponsiveButton
                  onClick={handleDeclineJoin}
                  className="flex justify-center hover:bg-black/90 border w-[200px]"
                  disabled={isJoining}
                >
                  Decline
                </ResponsiveButton>
                <ResponsiveButton
                  onClick={handleJoinRoom}
                  disabled={isJoining}
                  className="flex justify-center bg-white hover:bg-white/90 !text-primary border w-[200px]"
                >
                  {isJoining ? "Joining..." : "Accept"}
                </ResponsiveButton>
              </div>
            </div>
          ) : null}
        </div>
      </Modal>
    </>
  );
}

export default PomodoroPage;
