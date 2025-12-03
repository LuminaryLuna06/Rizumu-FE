import React, { useState } from "react";
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
type LeaderboardUser = {
  rank: number;
  name: string;
  avatar: string;
  status?: string;
  badge?: string;
  time: string;
  gifts: number;
  trend?: "up" | "down" | "flat";
};

const MOCK_DATA: LeaderboardUser[] = [
  {
    rank: 1,
    name: "Hung",
    avatar: "https://i.pravatar.cc/150?u=mars",
    time: "7h 30m",
    gifts: 8,
    trend: "up",
  },
  {
    rank: 2,
    name: "Tranh",
    status:
      "The distance between insanity and genius is measured only by success.",
    avatar: "https://i.pravatar.cc/150?u=scarface",
    time: "6h 28m",
    gifts: 9,
    trend: "up",
  },
  {
    rank: 3,
    name: "An :)",
    status: "Peter 1:3",
    avatar: "https://i.pravatar.cc/150?u=pbj",
    time: "6h 0m",
    gifts: 9,
    trend: "up",
  },
  {
    rank: 4,
    name: "Rosie",
    status: "IIT JEE aspirant",
    badge: "IN",
    avatar: "https://i.pravatar.cc/150?u=rosie",
    time: "5h 13m",
    gifts: 3,
  },
];

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

  return (
    <Modal opened={opened} onClose={() => setOpened(false)} title="">
      <div className="bg-modal-layout">
        <div className="flex flex-col sm:flex-row  justify-between items-center">
          <div className="flex items-center w-full md:w-auto mb-4">
            <button
              onClick={() => setActiveTab("global")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "global"
                  ? "bg-white text-black shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <IconWorld size={18} /> Global
            </button>

            <button
              onClick={() => setActiveTab("friends")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "friends"
                  ? "bg-white text-black shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <IconUsers size={18} /> Friends
            </button>
          </div>

          <div className="flex items-center w-full md:w-auto">
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
              Monthly
            </button>

            <button
              onClick={() => setTimeFilter("monthly")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                timeFilter === "monthly"
                  ? "bg-white text-black shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Weekly
            </button>
          </div>
        </div>

        <div className="flex justify-center items-center mb-8 mt-8">
          <button className="p-2 text-gray-400 hover:text-white transition">
            <IconArrowLeft size={20} />
          </button>
          <div className="mx-4 border border-gray-700 bg-[#1a1a1a] px-6 py-2 rounded-full text-sm font-medium">
            02 Dec 2025
          </div>
          <button className="p-2 text-gray-400 hover:text-white transition">
            <IconArrowRight size={20} />
          </button>
        </div>

        {/* Table */}
        <div className="max-h-[150px] overflow-y-auto custom-scrollbar scrollbar-hidden px-2">
          <table className="w-full relative">
            {/* Hàng 1 */}
            <thead className="sticky t-0 z-10">
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
              {MOCK_DATA.map((user) => (
                <tr
                  key={user.rank}
                  className="group hover:bg-primary-hover cursor-pointer last:border-none"
                >
                  {/* Cột 1 */}
                  <td className="py-4 text-center align-middle">
                    <div className="flex items-center justify-center">
                      {user.trend === "up" && (
                        <IconTrendingUp size={14} className="text-green-500" />
                      )}
                      <span className="font-bold text-lg text-white">
                        {user.rank}
                      </span>
                    </div>
                  </td>

                  {/* Cột 2 */}
                  <td className="py-4 pl-2 align-middle">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover border border-gray-700"
                        />
                        {user.badge && (
                          <span className="absolute -bottom-1 -right-1 bg-gray-800 text-[10px] font-bold px-1 rounded border border-gray-600 text-gray-300">
                            {user.badge}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0 max-w-[200px]">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white truncate">
                            {user.name}
                          </span>
                        </div>
                        {user.status && (
                          <p className="text-xs text-gray-500 truncate hidden sm:block">
                            {user.status}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Cột 3 */}
                  <td className="py-4 pr-4 text-right align-middle">
                    <div className="flex items-center justify-end gap-6">
                      <span className="font-medium text-gray-200">
                        {user.time}
                      </span>
                    </div>
                  </td>

                  {/* Cột 4 */}
                  <td>
                    <div className="flex items-center gap-1 text-gray-300">
                      <IconGift size={18} />
                      <span className="font-bold text-white">{user.gifts}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};

export default LeaderboardModal;
