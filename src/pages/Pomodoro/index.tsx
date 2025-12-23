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
import type { ModelStreak } from "@rizumu/models/streak";
import axiosClient from "@rizumu/tanstack/api/config/axiosClient";
import ProfileModal from "@rizumu/components/ProfileModal";

function PomodoroPage() {
  const { user, refreshUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();
  const [background, setBackground] = useState({
    name: "/image/aurora-2k.webp",
    type: "static",
  });
  const [totalTime, setTotalTime] = useState(0);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const previousBackgroundName = useRef<string>("");

  // State for join room modal
  const [joinRoomModalOpened, setJoinRoomModalOpened] = useState(false);
  const [roomToJoin, setRoomToJoin] = useState<ModelRoom | null>(null);
  const [isLoadingRoom, setIsLoadingRoom] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [hasCheckedQuery, setHasCheckedQuery] = useState(false);

  const [sharedUserId, setSharedUserId] = useState<string | null>(null);
  const [profileModalOpened, setProfileModalOpened] = useState(false);

  const [numberRequest, setNumberRequest] = useState(0);
  const [streaks, setStreaks] = useState<ModelStreak>();

  const fetchTotalTime = async () => {
    if (!user?._id) return;
    let total = 0;
    try {
      const year = new Date().getFullYear();
      const month = new Date().getMonth();
      const date = new Date().getDate();

      const startTime = new Date(year, month, date, 0, 0, 0, 0).toISOString();
      const endTime = new Date(
        year,
        month,
        date,
        23,
        59,
        59,
        999
      ).toISOString();

      const response = await axiosClient.get(
        `/session/hourly?startTime=${startTime}&endTime=${endTime}&userId=${user?._id}`
      );
      response.data.forEach((data: number) => {
        total += data;
      });
      setTotalTime(Math.floor(total));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await axiosClient.get("/friend/requests/received");
      const length = response.data?.length || 0;
      setNumberRequest(length);
    } catch (error: any) {
      console.error("Error fetching requests:", error);
      toast.error(
        error?.response?.data?.message || "Failed to load requests",
        "Error"
      );
    }
  };

  const getStreak = async () => {
    try {
      const response = await axiosClient.get("/progress");
      setStreaks(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (shouldFetch) {
      fetchTotalTime();
      getStreak();
      setShouldFetch(false);
    }
  }, [shouldFetch]);

  // Preload default background on mount
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
      // Try to get room by slug
      const response = await axiosClient.get(`/room/slug/${slug}`);
      const room = response.data as ModelRoom;

      // Check if user is already in this room
      if (user?.current_room_id === room._id) {
        // Already in this room, just remove the query param
        setSearchParams({});
        return;
      }

      setRoomToJoin(room);
      setJoinRoomModalOpened(true);
    } catch (error: any) {
      console.error("Error fetching room:", error);
      toast.error(error?.response?.data?.message || "Room not found", "Error");
      // Remove invalid query param
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
      // Remove query param after joining
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
    // Remove query param
    setSearchParams({});
  };

  // Check for rid query parameter when page loads
  useEffect(() => {
    const roomSlug = searchParams.get("rid");
    const userId = searchParams.get("uid");

    if (roomSlug && user && !hasCheckedQuery) {
      setHasCheckedQuery(true);
      handleCheckRoomInvite(roomSlug);
    }

    if (userId) {
      setSharedUserId(userId);
      setProfileModalOpened(true);

      setSearchParams((prev) => {
        prev.delete("uid");
        return prev;
      });
    }
  }, [searchParams, user, hasCheckedQuery]);

  useEffect(() => {
    if (user) {
      fetchTotalTime();
      fetchRequests();
      getStreak();
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
      setTotalTime(0);
      setNumberRequest(0);
      setStreaks(undefined);
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
        <Header totalTime={totalTime} streaks={streaks} />
        {/* Main Content */}
        <Timer
          bgType={background.type}
          bgName={background.name}
          onSessionComplete={() => setShouldFetch(true)}
        />
        {/* Footer */}
        <Footer
          onBackgroundChange={handleBackgroundChange}
          numberRequest={numberRequest}
          onRefreshRequests={fetchRequests}
        />
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
