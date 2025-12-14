import {
  IconChartColumn,
  IconPencil,
  IconShare2,
  IconFlame,
  IconTrophy,
  IconClock,
  IconCircleCheck,
  IconCalendarWeek,
  IconChartLine,
  IconGift,
  IconMap,
  IconDoorExit,
  IconUserPlus,
  IconUserMinus,
} from "@tabler/icons-react";
import Modal from "../Modal";
import ResponsiveButton from "../ResponsiveButton";
import BoxStatistic from "./components/BoxStatistic";
import { useEffect, useState } from "react";
import EditProfileModal from "./components/EditProfileModal";
import HeatMap, { type HeatMapData } from "./components/HeatMap";
import { useAuth } from "@rizumu/context/AuthContext";
import { useToast } from "@rizumu/utils/toast/toast";
import type { ModelUserProfile } from "@rizumu/models/userProfile";
import axiosClient from "@rizumu/api/config/axiosClient";
import { months } from "./data/months";

interface HeatMapResponse {
  durations: number[];
  start_date: string;
  end_date: string;
}

interface ProfileModalProps {
  opened: boolean;
  onClose: () => void;
  onOpenProfile: () => void;
  userId?: string; // ID của user cần xem profile, mặc định là user hiện tại
}

function ProfileModal({
  opened,
  onClose,
  onOpenProfile,
  userId,
}: ProfileModalProps) {
  const { logout, user: currentUser } = useAuth();
  const [editOpened, setEditOpened] = useState(false);
  const [heatmapData, setHeatmapData] = useState<HeatMapData>({});
  const [profileUser, setProfileUser] = useState<ModelUserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [friendshipId, setFriendshipId] = useState<string | null>(null);
  const [friendshipLoading, setFriendshipLoading] = useState(false);
  const toast = useToast();

  // ID của user cần xem (ưu tiên userId prop, nếu không có thì dùng currentUser._id)
  const targetUserId = userId || currentUser?._id;

  // Kiểm tra xem có phải đang xem profile của chính mình không
  const isOwnProfile = targetUserId === currentUser?._id;

  const getProfile = async (id: string) => {
    setProfileLoading(true);
    try {
      const response = await axiosClient.get<{ data: ModelUserProfile }>(
        `/auth/profile/${id}`
      );
      setProfileUser(response.data.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const checkFriendship = async (userId: string) => {
    try {
      const response = await axiosClient.get("/friend/list");
      const friends = response.data || [];
      // Check if the userId exists in the friends list
      const friend = friends.find((friend: any) => friend._id === userId);
      if (friend) {
        setIsFriend(true);
        setFriendshipId(friend.friendshipId);
      } else {
        setIsFriend(false);
        setFriendshipId(null);
      }
    } catch (error) {
      console.error("Error checking friendship:", error);
      setIsFriend(false);
      setFriendshipId(null);
    }
  };

  const handleAddFriend = async () => {
    if (!targetUserId) return;
    try {
      setFriendshipLoading(true);
      await axiosClient.post("/friend/request", { recipientId: targetUserId });
      toast.success("Friend request sent!");
    } catch (error: any) {
      console.error("Error sending friend request:", error);
      toast.error(error?.response?.data?.message || "Failed to send request");
    } finally {
      setFriendshipLoading(false);
    }
  };

  const handleUnfriend = async () => {
    if (!friendshipId) {
      toast.error("Friendship ID not found");
      return;
    }
    try {
      setFriendshipLoading(true);
      await axiosClient.delete(`/friend/${friendshipId}`);
      toast.success("Unfriended successfully!");
      setIsFriend(false);
      setFriendshipId(null);
    } catch (error: any) {
      console.error("Error unfriending:", error);
      toast.error(error?.response?.data?.message || "Failed to unfriend");
    } finally {
      setFriendshipLoading(false);
    }
  };

  const getAvatar = (userAvatar: any) => {
    if (!userAvatar) {
      return (
        <div className="w-30 h-30 md:w-24 md:h-24 rounded-full bg-primary flex items-center justify-center text-4xl font-bold shadow-2xl">
          U
        </div>
      );
    }
    return (
      <img
        src={userAvatar}
        alt="Avatar"
        className="w-30 h-30 md:w-24 md:h-24 rounded-full"
      />
    );
  };

  const getHeatMap = async (userId: string) => {
    if (!userId) return;

    try {
      const year = new Date().getFullYear();
      const startOfYear = new Date(year, 0, 1, 0, 0, 0, 0); // Giờ local (00:00:00)
      const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999); //Giờ local (23:59:59.999)

      // Chuyển sang ISO string (UTC) - Auto theo múi giờ
      const startTime = startOfYear.toISOString();
      const endTime = endOfYear.toISOString();

      const response = await axiosClient.get<HeatMapResponse>(
        `/session/heatmap?user_id=${userId}&startTime=${startTime}&endTime=${endTime}`
      );

      const heatmapDataObj: HeatMapData = {};
      const startDate = new Date(response.data.start_date);

      response.data.durations.forEach((duration, index) => {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + index);

        const dateKey = currentDate.toISOString().split("T")[0];
        heatmapDataObj[dateKey] = duration;
      });

      setHeatmapData(heatmapDataObj);
    } catch (error) {
      console.error("Error fetching heatmap data:", error);
      setHeatmapData({});
    }
  };

  useEffect(() => {
    if (opened && targetUserId) {
      // Reset profile data khi targetUserId thay đổi
      setProfileUser(null);
      setHeatmapData({});
      setIsFriend(false);
      setFriendshipId(null);
      getProfile(targetUserId);
      getHeatMap(targetUserId);
      // Check friendship status nếu không phải profile của mình
      if (!isOwnProfile) {
        checkFriendship(targetUserId);
      }
    }
  }, [opened, targetUserId]);

  const handleLogout = () => {
    logout();
    toast.info("Loged out");
  };
  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        title={
          profileUser?.name
            ? `${profileUser?.name}'s Profile`
            : "User's Profile"
        }
        className="w-full max-w-[1000px] max-h-[70vh] overflow-y-auto overflow-x-hidden custom-scrollbar scrollbar-hidden"
        more={
          isOwnProfile ? (
            <div className="flex items-center h-20 lg:h-10 gap-2 md:gap-sm hidden md:flex">
              <ResponsiveButton
                className="bg-white/10 hover:bg-white/20 h-11 md:h-5 gap-x-xs text-sm"
                onClick={() => {
                  setEditOpened(true);
                  onClose();
                }}
                leftSection={<IconPencil size={16} />}
              >
                Edit
              </ResponsiveButton>
              <ResponsiveButton
                className="!bg-emerald-500 hover:bg-emarald-600 h-11 md:h-5 gap-x-xs text-sm"
                leftSection={<IconShare2 size={16} />}
              >
                Copy link
              </ResponsiveButton>
            </div>
          ) : null
        }
      >
        <div className="flex flex-col md:flex-row items-center mb-xl h-1/3">
          <div className="flex-1 flex flex-col justify-center items-center mb-md md:mb-0 gap-md">
            {profileLoading ? (
              <div className="w-30 h-30 md:w-24 md:h-24 rounded-full bg-secondary/20 animate-pulse" />
            ) : (
              getAvatar(profileUser?.avatar)
            )}
            {/* Add Friend / Unfriend Button */}
            {!isOwnProfile && !profileLoading && (
              <button
                onClick={isFriend ? handleUnfriend : handleAddFriend}
                disabled={friendshipLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isFriend
                    ? "bg-red-500/20 hover:bg-red-500/30 text-red-400"
                    : "bg-blue-500/20 hover:bg-blue-500/30 text-blue-400"
                } ${friendshipLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {friendshipLoading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : isFriend ? (
                  <IconUserMinus size={18} />
                ) : (
                  <IconUserPlus size={18} />
                )}
                {isFriend ? "Unfriend" : "Add Friend"}
              </button>
            )}
          </div>
          <div className="flex-5 flex-col w-full">
            <div className="flex flex-col-reverse md:flex-row items-center gap-sm w-full h-25 md:h-10 mb-xs">
              <div className="flex items-center gap-2">
                {profileLoading ? (
                  <div className="h-8 bg-secondary/20 rounded animate-pulse w-48" />
                ) : (
                  <>
                    <h1 className="text-2xl md:text-xl font-bold">
                      {profileUser?.name ? `${profileUser?.name}` : "User"}
                    </h1>
                    {profileUser?.country ? (
                      <div className="flex justify-center items-center bg-secondary/10 px-2 py-1 rounded-lg w-[50px] text-xs">
                        {profileUser?.country}
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </div>
              {isOwnProfile && (
                <div className="flex items-center h-20 lg:h-10 gap-2 md:gap-xl lg:gap-sm md:hidden flex">
                  <ResponsiveButton
                    className="flex justify-center h-11 md:h-8 lg:h-5 bg-white/10 hover:bg-white/20 gap-x-xs text-sm min-w-[100px]"
                    onClick={() => {
                      setEditOpened(true);
                      onClose();
                    }}
                    leftSection={<IconPencil size={16} />}
                  >
                    Edit
                  </ResponsiveButton>
                  <ResponsiveButton
                    className="!bg-emerald-500 hover:bg-emarald-600 h-11 md:h-8 lg:h-5 gap-x-xs text-sm min-w-[100px]"
                    leftSection={<IconShare2 size={16} />}
                  >
                    Copy link
                  </ResponsiveButton>
                </div>
              )}
            </div>
            {profileLoading ? (
              <div className="h-4 bg-secondary/20 rounded animate-pulse w-full mb-sm" />
            ) : (
              <p className="mb-sm">
                {profileUser?.bio ? `${profileUser?.bio}` : ""}
              </p>
            )}
            <div>
              <div className="flex justify-between text-sm font-bold mb-xs">
                <p>Lv. 6</p>
                <p>40 XP to next</p>
              </div>
              <div className="bg-gray-700 rounded-full h-1 w-full mb-sm">
                <div
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-1 rounded-full"
                  style={{ width: `${(173 / 213) * 100}%` }}
                />
              </div>
              <div className="flex justify-end text-xs mb-xs text-secondary">
                <p>173 / 213 XP</p>
              </div>
            </div>
            <div>
              <p>
                Your coins: <span className="font-bold">17</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col mb-xl">
          <div className="flex font-bold items-center text-xl gap-sm h-8 mb-md">
            <IconChartColumn />
            <h1>Stats</h1>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md">
            <BoxStatistic
              className="from-orange-400 to-pink-500"
              header="Current Streak"
              detail="0"
              note="DAYS"
              icon={<IconFlame size={50} />}
            />
            <BoxStatistic
              className="from-orange-400 to-pink-600"
              header="Best Streak"
              detail="3"
              note="DAYS"
              icon={<IconTrophy size={50} />}
            />
            <BoxStatistic
              className="from-emerald-400 to-teal-600"
              header="Total hours"
              detail="2h 58m"
              note=""
              icon={<IconClock size={50} />}
            />
            <BoxStatistic
              className="from-purple-500 to-indigo-600"
              header="Pomodoros"
              detail="22"
              note="Completed"
              icon={<IconCircleCheck size={50} />}
            />
            <BoxStatistic
              className="from-blue-400 to-cyan-500"
              header="This Week"
              detail="20"
              note="POMODOROS"
              icon={<IconCalendarWeek size={50} />}
            />
            <BoxStatistic
              className="from-cyan-400 to-blue-600"
              header="Daily average"
              detail="5m"
              note="LAST 30 DAYS"
              icon={<IconChartLine size={50} />}
            />
            <BoxStatistic
              className="from-pink-500 to-rose-600"
              header="Gifts Sent"
              detail={
                <div className="flex items-center gap-xs">
                  <IconGift size={24} />
                  <span>5</span>
                </div>
              }
              note=""
              icon={<IconGift size={50} />}
            />
          </div>
        </div>

        <div className="flex flex-col mb-xl">
          <div className="flex font-bold items-center text-xl gap-sm h-8 mb-md">
            <IconMap />
            <h1>Heatmap</h1>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 w-full overflow-visible relative [&_text]:fill-white/80">
            {months.map((month, index) => (
              <HeatMap
                key={index}
                month={month.name}
                monthNumber={index + 1}
                data={heatmapData}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-between mb-lg">
          <div className="flex font-bold items-center text-xl gap-sm h-8 mb-md">
            <IconGift />
            <h1>Gifts Received</h1>
          </div>
          <div className="flex items-center border-1 rounded-md h-8 text-md mb-md p-4">
            <p>Total: 0</p>
          </div>
        </div>

        {isOwnProfile && (
          <div className="flex justify-center ">
            <ResponsiveButton
              onClick={() => {
                handleLogout();
                onClose();
              }}
              className="bg-red-500 hover:bg-red-600 h-11 min-w-[100px] gap-x-xs text-sm justify-center"
              leftSection={<IconDoorExit size={16} />}
            >
              Logout
            </ResponsiveButton>
          </div>
        )}
      </Modal>
      <EditProfileModal
        opened={editOpened}
        onClose={() => setEditOpened(false)}
        user={profileUser as ModelUserProfile}
        onOpenProfile={() => {
          setEditOpened(false);
          onOpenProfile();
        }}
      />
    </>
  );
}

export default ProfileModal;
