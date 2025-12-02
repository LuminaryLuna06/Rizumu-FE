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
} from "@tabler/icons-react";
import Modal from "../Modal";
import ResponsiveButton from "../ResponsiveButton";
import BoxStatistic from "./components/BoxStatistic";
import { useState } from "react";
import EditProfileModal from "./components/EditProfileModal";
import HeatMap from "./components/HeatMap";
import { data as heatmapData } from "@rizumu/pages/Test/TestHieu";

interface ProfileModalProps {
  opened: boolean;
  user: any;
  onClose: () => void;
}

function ProfileModal({ opened, user, onClose }: ProfileModalProps) {
  const [editOpened, setEditOpened] = useState(false);
  const getAvatar = (userAvatar: any) => {
    if (!userAvatar) {
      return (
        <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-4xl font-bold shadow-2xl">
          U
        </div>
      );
    }
    return (
      <img src={userAvatar} alt="Avatar" className="rounded-full w-24 h-24" />
    );
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        title={
          user?.name?.length > 0 ? `${user?.name}'s Profile` : "User's Profile"
        }
        className="w-[1000px] overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <div className="flex items-center mb-xl">
          <div className="flex-1 flex justify-center items-center">
            {getAvatar(user?.avatar)}
          </div>
          <div className="flex-5 flex-col">
            <div className="flex items-center gap-sm w-full h-10 mb-xs">
              <h1 className="text-xl font-bold">Wazzup</h1>
              <ResponsiveButton
                className="bg-white/10 hover:bg-white/20 h-1/3 gap-x-xs text-sm"
                onClick={() => {
                  setEditOpened(true);
                  onClose();
                }}
              >
                <IconPencil size={16} /> Edit
              </ResponsiveButton>
              <ResponsiveButton className="bg-white/10 hover:bg-white/20 h-1/3 gap-x-xs text-sm">
                <IconShare2 size={16} /> Copy link
              </ResponsiveButton>
            </div>
            <p className="mb-sm">Bio here</p>
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
          <div className="grid grid-cols-4 gap-md">
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
          <div className="grid grid-cols-6 w-full overflow-visible relative [&_text]:fill-white/80">
            <HeatMap
              month="Jan"
              monthNumber={1}
              day={31}
              year={2025}
              data={heatmapData}
            />
            <HeatMap
              month="Feb"
              monthNumber={2}
              day={28}
              year={2025}
              data={heatmapData}
            />
            <HeatMap
              month="Mar"
              monthNumber={3}
              day={31}
              year={2025}
              data={heatmapData}
            />
            <HeatMap
              month="Apr"
              monthNumber={4}
              day={30}
              year={2025}
              data={heatmapData}
            />
            <HeatMap
              month="May"
              monthNumber={5}
              day={31}
              year={2025}
              data={heatmapData}
            />
            <HeatMap
              month="Jun"
              monthNumber={6}
              day={30}
              year={2025}
              data={heatmapData}
            />
            <HeatMap
              month="Jul"
              monthNumber={7}
              day={31}
              year={2025}
              data={heatmapData}
            />
            <HeatMap
              month="Aug"
              monthNumber={8}
              day={31}
              year={2025}
              data={heatmapData}
            />
            <HeatMap
              month="Sep"
              monthNumber={9}
              day={30}
              year={2025}
              data={heatmapData}
            />
            <HeatMap
              month="Oct"
              monthNumber={10}
              day={31}
              year={2025}
              data={heatmapData}
            />
            <HeatMap
              month="Nov"
              monthNumber={11}
              day={30}
              year={2025}
              data={heatmapData}
            />
            <HeatMap
              month="Dec"
              monthNumber={12}
              day={31}
              year={2025}
              data={heatmapData}
            />
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
      </Modal>
      <EditProfileModal
        opened={editOpened}
        onClose={() => setEditOpened(false)}
      />
    </>
  );
}

export default ProfileModal;
