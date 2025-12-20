import React, { useState, useEffect } from "react";
import {
  IconWorld,
  IconUsers,
  IconTrendingUp,
  IconGift,
  IconChartBarPopular,
  IconArrowLeft,
  IconArrowRight,
  IconClockHour3,
} from "@tabler/icons-react";
import Modal from "../Modal";
import ProfileModal from "../ProfileModal";
import axiosClient from "@rizumu/api/config/axiosClient";
import type { ModelLeaderboard } from "@rizumu/models/leaderboard";

const LeaderboardModal = ({
  opened,
  setOpened,
}: {
  opened: boolean;
  setOpened: (e: boolean) => void;
}) => {
  const [activeTab, setActiveTab] = useState<"global" | "friends">("global");
  const [timeFilter, setTimeFilter] = useState<"daily" | "weekly" | "monthly">(
    "daily"
  );
  const [leaderboardData, setLeaderboardData] = useState<ModelLeaderboard[]>();
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [profileOpened, setProfileOpened] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const getTimeRange = (date: Date, filter: "daily" | "weekly" | "monthly") => {
    const start = new Date(date);
    const end = new Date(date);

    if (filter === "daily") {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    } else if (filter === "weekly") {
      const day = start.getDay();
      const diff = start.getDate() - day + (day === 0 ? -6 : 1);
      start.setDate(diff);
      start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
    } else if (filter === "monthly") {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(start.getMonth() + 1);
      end.setDate(0);
      end.setHours(23, 59, 59, 999);
    }

    return {
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    };
  };

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const { startTime, endTime } = getTimeRange(currentDate, timeFilter);
      const endpoint =
        activeTab === "global"
          ? "/session/leaderboard"
          : "/session/leaderboard_friend";
      const response = await axiosClient.get(
        `${endpoint}?startTime=${startTime}&endTime=${endTime}`
      );
      setLeaderboardData(response.data.data || []);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setLeaderboardData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (opened) {
      fetchLeaderboard();
    }
  }, [opened, timeFilter, currentDate, activeTab]);

  const handlePrevDate = () => {
    const newDate = new Date(currentDate);
    if (timeFilter === "daily") {
      newDate.setDate(newDate.getDate() - 1);
    } else if (timeFilter === "weekly") {
      newDate.setDate(newDate.getDate() - 7);
    } else if (timeFilter === "monthly") {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNextDate = () => {
    const newDate = new Date(currentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(newDate);
    compareDate.setHours(0, 0, 0, 0);

    if (timeFilter === "daily") {
      if (compareDate >= today) {
        return;
      }

      newDate.setDate(newDate.getDate() + 1);
    } else if (timeFilter === "weekly") {
      if (compareDate >= today) {
        return;
      }

      newDate.setDate(newDate.getDate() + 7);
    } else if (timeFilter === "monthly") {
      if (compareDate >= today) {
        return;
      }

      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const formatDisplayDate = () => {
    if (timeFilter === "daily") {
      return currentDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } else if (timeFilter === "weekly") {
      const { startTime, endTime } = getTimeRange(currentDate, "weekly");
      const start = new Date(startTime);
      const end = new Date(endTime);
      return `${start.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      })} - ${end.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}`;
    } else {
      return currentDate.toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.round((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
    setProfileOpened(true);
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title=""
        className="overflow-y-hidden overflow-x-hidden"
      >
        <div className="bg-modal-layout">
          <div className="flex flex-col sm:flex-row  justify-between items-center">
            <div className="flex items-center justify-center sm:justify-start w-full md:w-auto mb-xl sm:mb-0 gap-0 sm:gap-1">
              <button
                onClick={() => setActiveTab("global")}
                className={`flex items-center justify-center sm:justify-start gap-2 px-4 py-2 rounded-lg text-sm font-semibold w-1/2 sm:w-auto transition-all ${
                  activeTab === "global"
                    ? "bg-white text-black shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <IconWorld size={18} /> Global
              </button>

              <button
                onClick={() => setActiveTab("friends")}
                className={`flex items-center justify-center sm:justify-start gap-2 px-4 py-2 rounded-lg text-sm font-semibold w-1/2 sm:w-auto transition-all ${
                  activeTab === "friends"
                    ? "bg-white text-black shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <IconUsers size={18} /> Friends
              </button>
            </div>

            <div className="flex items-center justify-between sm:justify-start w-full md:w-auto pl-md sm:pl-0 pr-md sm:pr-0 gap-0 sm:gap-1">
              <button
                onClick={() => setTimeFilter("daily")}
                className={`gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  timeFilter === "daily"
                    ? "bg-white text-black shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Daily
              </button>

              <button
                onClick={() => setTimeFilter("weekly")}
                className={`gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  timeFilter === "weekly"
                    ? "bg-white text-black shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Weekly
              </button>

              <button
                onClick={() => setTimeFilter("monthly")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  timeFilter === "monthly"
                    ? "bg-white text-black shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          <div className="flex justify-center items-center mb-8 mt-8">
            <button
              onClick={handlePrevDate}
              className="p-2 text-gray-400 hover:text-white transition"
            >
              <IconArrowLeft size={20} />
            </button>
            <div className="mx-4 border border-gray-700 bg-[#1a1a1a] px-6 py-2 rounded-full text-sm font-medium">
              {formatDisplayDate()}
            </div>
            <button
              onClick={handleNextDate}
              className="p-2 text-gray-400 hover:text-white transition"
            >
              <IconArrowRight size={20} />
            </button>
          </div>

          {/* Table */}
          <div className="max-h-[600px] overflow-y-auto overflow-x-hidden custom-scrollbar scrollbar-hidden px-2">
            <table className="w-full relative mb-md">
              <thead>
                <tr>
                  <th className="pb-4 pt-2 text-center w-[10%]">#</th>
                  <th className="pb-4 pt-2 text-left pl-2 w-[60%]">User</th>
                  <th className="pb-4 pt-2 pr-4 w-[20%]">
                    <div className="flex justify-end">
                      <IconClockHour3 />
                    </div>
                  </th>
                  <th className="pb-4 pt-2 text-center w-[10%]"></th>
                </tr>

                <tr>
                  <th colSpan={3} className="p-0">
                    <div className="h-[1px] w-full bg-gray-800 mb-2"></div>
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    </td>
                  </tr>
                ) : leaderboardData?.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-400">
                      No data available for this period
                    </td>
                  </tr>
                ) : (
                  leaderboardData &&
                  leaderboardData.map((user, index) => (
                    <tr
                      key={user._id}
                      onClick={() => handleUserClick(user._id)}
                      className="group hover:bg-primary-hover cursor-pointer last:border-none"
                    >
                      {/* Cột 1 */}
                      <td className="py-4 text-center align-middle">
                        <div className="flex items-center justify-center">
                          {index < 3 && (
                            <IconTrendingUp
                              size={14}
                              className="text-green-500"
                            />
                          )}
                          <span className="font-bold text-lg text-white">
                            {index + 1}
                          </span>
                        </div>
                      </td>

                      {/* Cột 2 */}
                      <td className="py-4 pl-2 align-middle">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="relative">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover border border-gray-700"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center border border-gray-600">
                                <span className="text-sm font-bold">
                                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col min-w-0 max-w-[200px]">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white truncate">
                                {user.name || "Unknown"}
                              </span>
                            </div>
                            {user.username && (
                              <p className="text-xs text-gray-500 truncate hidden sm:block">
                                {user.username}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Cột 3 */}
                      <td className="py-4 pr-4 text-right align-middle">
                        <div className="flex items-center justify-end gap-6">
                          <span className="font-medium text-gray-200">
                            {formatDuration(user.totalDuration)}
                          </span>
                        </div>
                      </td>

                      {/* Cột 4 */}
                      <td>
                        <div className="flex items-center gap-1 text-gray-300">
                          <IconGift size={18} />
                          <span className="font-bold text-white">
                            {user.sessionsCount}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
      <ProfileModal
        opened={profileOpened}
        onClose={() => {
          setProfileOpened(false);
          setSelectedUserId(null);
        }}
        onOpenProfile={() => {
          setProfileOpened(true);
        }}
        userId={selectedUserId || undefined}
      />
    </>
  );
};

export default LeaderboardModal;
