import {
  IconChartColumn,
  IconPencil,
  IconShare2,
  IconFlame,
  IconClock,
  IconCircleCheck,
  IconCalendarWeek,
  IconChartLine,
  IconGift,
  IconMap,
  IconUserPlus,
  IconUserMinus,
} from "@tabler/icons-react";
import Modal from "../Modal";
import ResponsiveButton from "../ResponsiveButton";
import BoxStatistic from "./components/BoxStatistic";
import { useEffect, useState, useMemo } from "react";
import EditProfileModal from "./components/EditProfileModal";
import HeatMap from "./components/HeatMap";
import { useAuth } from "@rizumu/context/AuthContext";
import { useToast } from "@rizumu/utils/toast/toast";
import type { ModelUserProfile } from "@rizumu/models/userProfile";
import { months } from "../../constants/months";
import GiftModal from "../GiftModal";
import axiosClient from "@rizumu/tanstack/api/config/axiosClient";
import {
  useGiftById,
  useHeatmapData,
  useProfileById,
  useProgressById,
  useStats,
} from "@rizumu/tanstack/api/hooks";

interface ProfileModalProps {
  opened: boolean;
  onClose: () => void;
  onOpenProfile: () => void;
  userId?: string; // ID của user cần xem profile, mặc định là user hiện tại
}
const year = new Date().getFullYear();
const startOfYear = new Date(year, 0, 1, 0, 0, 0, 0);
const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

const startTime = startOfYear.toISOString();
const endTime = endOfYear.toISOString();

const formatDuration = (hours: number) => {
  const hrs = Math.floor(hours);
  const mins = Math.round((hours - hrs) * 60);
  return `${hrs}h ${mins}m`;
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

function ProfileModal({
  opened,
  onClose,
  onOpenProfile,
  userId,
}: ProfileModalProps) {
  const toast = useToast();
  const { user: currentUser } = useAuth();
  const [editOpened, setEditOpened] = useState(false);
  const [sendGift, setSendGift] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [friendshipId, setFriendshipId] = useState<string | null>(null);
  const [friendshipLoading, setFriendshipLoading] = useState(false);

  const targetUserId = userId || currentUser?._id;
  const isOwnProfile = targetUserId === currentUser?._id;

  const { data, isLoading } = useProfileById(targetUserId || "");

  const checkFriendship = async (userId: string) => {
    try {
      const response = await axiosClient.get("/friend/list");
      const friends = response.data || [];
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
      toast.success("Friend request sent!", "Success");
    } catch (error: any) {
      console.error("Error sending friend request:", error);
      toast.error(
        error?.response?.data?.message || "Failed to send request",
        "Error"
      );
    } finally {
      setFriendshipLoading(false);
    }
  };

  const handleUnfriend = async () => {
    if (!friendshipId) {
      toast.error("Friendship ID not found", "Error");
      return;
    }
    try {
      setFriendshipLoading(true);
      await axiosClient.delete(`/friend/${friendshipId}`);
      toast.success("Unfriended successfully!", "Success");
      setIsFriend(false);
      setFriendshipId(null);
    } catch (error: any) {
      console.error("Error unfriending:", error);
      toast.error(
        error?.response?.data?.message || "Failed to unfriend",
        "Error"
      );
    } finally {
      setFriendshipLoading(false);
    }
  };

  const handleShareProfile = () => {
    if (!targetUserId) {
      toast.error("User ID not found", "Error");
      return;
    }

    try {
      const currentUrl = window.location.origin + window.location.pathname;
      const shareUrl = `${currentUrl}?uid=${targetUserId}`;

      navigator.clipboard.writeText(shareUrl);
      toast.success("Profile link copied to clipboard!", "Success");
    } catch (error) {
      console.error("Error copying link:", error);
      toast.error("Failed to copy link", "Error");
    }
  };

  const { data: stats, isLoading: statsLoading } = useStats(opened);
  const { data: progress, isLoading: progressLoading } = useProgressById(
    targetUserId || "",
    opened
  );
  const { data: heatmap, isLoading: heatmapLoading } = useHeatmapData(
    startTime,
    endTime,
    targetUserId || "",
    opened
  );
  const { data: gifts, isLoading: giftLoading } = useGiftById(
    targetUserId || "",
    opened
  );

  const heatmapData = useMemo(() => {
    if (!heatmap || !heatmap.durations) return {};

    const heatmapDataObj: { [key: string]: number } = {};
    const startDate = new Date(startTime);

    heatmap.durations.forEach((duration, index) => {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + index);

      const dateKey = currentDate.toISOString().split("T")[0];
      heatmapDataObj[dateKey] = duration;
    });

    return heatmapDataObj;
  }, [heatmap, startTime]);

  useEffect(() => {
    if (opened && targetUserId) {
      setIsFriend(false);
      setFriendshipId(null);
      if (!isOwnProfile) {
        checkFriendship(targetUserId);
      }
    }
  }, [opened, targetUserId]);

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        title={data?.name ? `${data?.name}'s Profile` : "User's Profile"}
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
                onClick={() => handleShareProfile()}
              >
                Copy link
              </ResponsiveButton>
            </div>
          ) : (
            <div className="flex items-center h-20 lg:h-10 gap-2 md:gap-sm hidden md:flex">
              <ResponsiveButton
                className="bg-white/10 hover:bg-white/20 h-11 md:h-5 gap-x-xs text-sm"
                leftSection={<IconGift size={16} />}
                onClick={() => {
                  setSendGift(true);
                }}
              >
                Send gift
              </ResponsiveButton>
            </div>
          )
        }
      >
        <div className="flex flex-col md:flex-row items-center mb-xl h-1/3">
          <div className="flex-1 flex flex-col justify-center items-center mb-md md:mb-0 gap-md">
            {isLoading ? (
              <div className="w-30 h-30 md:w-24 md:h-24 rounded-full bg-secondary/20 animate-pulse" />
            ) : (
              getAvatar(data?.avatar)
            )}
            {/* Add Friend / Unfriend Button */}
            {!isOwnProfile && !isLoading && (
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
                {isLoading ? (
                  <div className="h-8 bg-secondary/20 rounded animate-pulse w-48" />
                ) : (
                  <>
                    <h1 className="text-2xl md:text-xl font-bold">
                      {data?.name ? `${data?.name}` : "User"}
                    </h1>
                    {data?.country ? (
                      <div className="flex justify-center items-center bg-secondary/10 px-2 py-1 rounded-lg w-[50px] text-xs">
                        {data?.country}
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </div>
              {isOwnProfile ? (
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
                    onClick={() => handleShareProfile()}
                  >
                    Copy link
                  </ResponsiveButton>
                </div>
              ) : (
                <div className="flex items-center h-20 lg:h-10 gap-2 md:gap-xl lg:gap-sm md:hidden flex">
                  <ResponsiveButton
                    className="bg-white/10 hover:bg-white/20 h-11 md:h-5 gap-x-xs text-sm"
                    leftSection={<IconGift size={16} />}
                    onClick={() => {
                      setSendGift(true);
                    }}
                  >
                    Send gift
                  </ResponsiveButton>
                </div>
              )}
            </div>
            {isLoading ? (
              <div className="h-4 bg-secondary/20 rounded animate-pulse w-full mb-sm" />
            ) : (
              <p className="mb-sm">{data?.bio ? `${data?.bio}` : ""}</p>
            )}
            <div>
              <div className="flex justify-between text-sm font-semibold mb-xs">
                {isLoading || statsLoading || !stats ? (
                  <>
                    <div className="h-5 w-12 bg-secondary/20 rounded animate-pulse" />
                    <div className="h-5 w-24 bg-secondary/20 rounded animate-pulse" />
                  </>
                ) : (
                  <>
                    <p>Lv. {stats.level}</p>
                    <p>
                      {stats.remaining_xp - stats.current_xp} XP to next level
                    </p>
                  </>
                )}
              </div>
              <div className="bg-gray-700 rounded-full h-1 w-full mb-sm">
                <div
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-1 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      isLoading
                        ? 0
                        : ((stats?.current_xp || 0) /
                            ((stats?.current_xp || 0) +
                              (stats?.remaining_xp || 0) || 1)) *
                          100
                    }%`,
                  }}
                />
              </div>
              <div className="flex justify-end text-xs mb-xs text-secondary">
                {isLoading || statsLoading || !stats ? (
                  <div className="h-4 w-20 bg-secondary/20 rounded animate-pulse" />
                ) : (
                  <p>
                    {stats.current_xp} / {stats.remaining_xp} XP
                  </p>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                Your coins:{" "}
                {isLoading || statsLoading || !stats ? (
                  <div className="h-5 w-10 bg-secondary/20 rounded animate-pulse" />
                ) : (
                  <span className="font-bold">{stats.coins}</span>
                )}
              </div>
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
              detail={progressLoading ? "..." : String(progress?.streak ?? 0)}
              note="DAYS"
              icon={<IconFlame size={50} />}
            />
            {/* <BoxStatistic
              className="from-orange-400 to-pink-600"
              header="Best Streak"
              detail={
                progressLoading ? "..." : String(progress?.streak ?? 0)
              }
              note="DAYS"
              icon={<IconTrophy size={50} />}
            /> */}
            <BoxStatistic
              className="from-emerald-400 to-teal-600"
              header="Total hours"
              detail={
                progressLoading
                  ? "..."
                  : formatDuration(progress?.total_hours ?? 0)
              }
              note=""
              icon={<IconClock size={50} />}
            />
            <BoxStatistic
              className="from-purple-500 to-indigo-600"
              header="Pomodoros"
              detail={
                progressLoading ? "..." : String(progress?.promo_complete ?? 0)
              }
              note="Completed"
              icon={<IconCircleCheck size={50} />}
            />
            <BoxStatistic
              className="from-blue-400 to-cyan-500"
              header="This Week"
              detail={
                progressLoading
                  ? "..."
                  : String(progress?.week_promo_complete ?? 0)
              }
              note="POMODOROS"
              icon={<IconCalendarWeek size={50} />}
            />
            <BoxStatistic
              className="from-cyan-400 to-blue-600"
              header="Daily average"
              detail={
                progressLoading
                  ? "..."
                  : formatDuration(progress?.daily_average ?? 0)
              }
              note="LAST 30 DAYS"
              icon={<IconChartLine size={50} />}
            />
            <BoxStatistic
              className="from-pink-500 to-rose-600"
              header="Gifts Sent"
              detail={
                progressLoading ? (
                  "..."
                ) : (
                  <div className="flex items-center gap-xs">
                    <IconGift size={24} />
                    <span>{progress?.gifts_sent ?? 0}</span>
                  </div>
                )
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

        <div className="flex justify-between mb-lg items-center">
          <div className="flex font-bold items-center text-xl gap-sm h-8">
            <IconGift />
            <h1>Gifts Received</h1>
          </div>
          <div className="flex items-center border border-white/10 rounded-md h-8 text-md p-4 bg-secondary/10">
            <p>Total: {gifts?.length}</p>
          </div>
        </div>

        {giftLoading ? (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-xl px-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="w-full aspect-square rounded-2xl bg-secondary/10 animate-pulse border-2 border-transparent"
              />
            ))}
          </div>
        ) : gifts && gifts.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-xl px-2">
            {gifts.map((gift: any, index: number) => (
              <div
                key={index}
                className="relative flex flex-col items-center p-2 rounded-2xl transition-all duration-300 border-2 border-transparent bg-secondary/10 hover:border-white/10"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 flex flex-col items-center justify-center drop-shadow-xl mt-2">
                  <img
                    src={gift.icon}
                    alt="Gift icon"
                    className="w-full h-full object-contain transform hover:scale-110 transition-transform duration-300"
                  />
                  <p className="mb-md text-xs italic ">
                    from{" "}
                    <span className="text-base font-semibold not-italic">
                      {gift.senderName}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-secondary/50 bg-secondary/5 rounded-2xl mb-xl border border-dashed border-white/10">
            <IconGift size={48} className="mb-2 opacity-20" />
            <p>No gifts received yet</p>
          </div>
        )}
      </Modal>
      <EditProfileModal
        opened={editOpened}
        onClose={() => setEditOpened(false)}
        user={data as ModelUserProfile}
        onOpenProfile={() => {
          setEditOpened(false);
          onOpenProfile();
        }}
      />
      <GiftModal
        opened={sendGift}
        onClose={() => setSendGift(false)}
        profile={data || null}
      />
    </>
  );
}

export default ProfileModal;
