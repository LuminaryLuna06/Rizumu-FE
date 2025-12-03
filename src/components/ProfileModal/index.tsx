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
} from "@tabler/icons-react";
import Modal from "../Modal";
import ResponsiveButton from "../ResponsiveButton";
import BoxStatistic from "./components/BoxStatistic";
import { useEffect, useState } from "react";
import EditProfileModal from "./components/EditProfileModal";
import HeatMap from "./components/HeatMap";
import { data as heatmapData } from "@rizumu/pages/Test/TestHieu";
import { useAuth } from "@rizumu/context/AuthContext";
import { useToast } from "@rizumu/utils/toast/toast";
import type { ModelUserProfile } from "@rizumu/models/userProfile";

interface ProfileModalProps {
  opened: boolean;
  onClose: () => void;
  onOpenProfile: () => void;
}

function ProfileModal({ opened, onClose, onOpenProfile }: ProfileModalProps) {
  const { logout, user, refreshUser } = useAuth();
  const [editOpened, setEditOpened] = useState(false);
  const toast = useToast();
  const months = [
    {
      name: "Jan",
      days: 31,
    },
    {
      name: "Feb",
      days: 28,
    },
    {
      name: "Mar",
      days: 31,
    },
    {
      name: "Apr",
      days: 30,
    },
    {
      name: "May",
      days: 31,
    },
    {
      name: "Jun",
      days: 30,
    },
    {
      name: "Jul",
      days: 31,
    },
    {
      name: "Aug",
      days: 31,
    },
    {
      name: "Sep",
      days: 30,
    },
    {
      name: "Oct",
      days: 31,
    },
    {
      name: "Nov",
      days: 30,
    },
    {
      name: "Dec",
      days: 31,
    },
  ];

  const getAvatar = (userAvatar: any) => {
    if (!userAvatar) {
      return (
        <div className="w-30 h-30 lg:w-24 lg:h-24 rounded-full bg-primary flex items-center justify-center text-4xl font-bold shadow-2xl">
          U
        </div>
      );
    }
    return (
      <img
        src={userAvatar}
        alt="Avatar"
        className="w-30 h-30 lg:w-24 lg:h-24 rounded-full"
      />
    );
  };
  useEffect(() => {
    if (opened === true) {
      refreshUser();
    }
  }, [opened]);

  const handleLogout = () => {
    logout();
    toast.info("Loged out");
  };
  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        title={user?.name ? `${user?.name}'s Profile` : "User's Profile"}
        className="w-full max-w-[1000px] max-h-[70vh] overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        more={
          <div className="flex items-center h-20 lg:h-10 gap-2 md:gap-xl lg:gap-sm hidden md:flex">
            <ResponsiveButton
              className="bg-white/10 hover:bg-white/20 h-11 md:h-8 lg:h-5 gap-x-xs text-sm"
              onClick={() => {
                setEditOpened(true);
                onClose();
              }}
              leftSection={<IconPencil size={16} />}
            >
              Edit
            </ResponsiveButton>
            <ResponsiveButton
              className="!bg-emerald-500 hover:bg-emarald-600 h-11 md:h-8 lg:h-5 gap-x-xs text-sm"
              leftSection={<IconShare2 size={16} />}
            >
              Copy link
            </ResponsiveButton>
          </div>
        }
      >
        <div className="flex flex-col md:flex-row items-center mb-xl h-1/3">
          <div className="flex-1 flex justify-center items-center mb-md md:mb-0">
            {getAvatar(user?.avatar)}
          </div>
          <div className="flex-5 flex-col w-full">
            <div className="flex flex-col-reverse md:flex-row items-center gap-sm w-full h-25 md:h-20 lg:h-10 mb-xs">
              <h1 className="text-2xl md:text-xl font-bold">
                {user?.name ? `${user?.name}` : "User"}
              </h1>
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
            </div>
            <p className="mb-sm">{user?.bio ? `${user?.bio}` : ""}</p>
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
            <h1>Study Statistics</h1>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
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
            <h1>Study Activity</h1>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 w-full overflow-visible relative [&_text]:fill-white/80">
            {months.map((month, index) => (
              <HeatMap
                month={month.name}
                monthNumber={index + 1}
                day={month.days}
                year={new Date().getFullYear()}
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

        <div className="flex justify-center ">
          <ResponsiveButton
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 h-11 min-w-[100px] gap-x-xs text-sm justify-center"
            leftSection={<IconDoorExit size={16} />}
          >
            Logout
          </ResponsiveButton>
        </div>
      </Modal>
      <EditProfileModal
        opened={editOpened}
        onClose={() => setEditOpened(false)}
        user={user as ModelUserProfile}
        onOpenProfile={() => {
          setEditOpened(false);
          onOpenProfile();
        }}
      />
    </>
  );
}

export default ProfileModal;
