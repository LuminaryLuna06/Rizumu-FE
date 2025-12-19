import { useState } from "react";
import ResponsiveButton from "@rizumu/components/ResponsiveButton";
import UserMenu from "@rizumu/components/UserMenu";
import { IconChartColumn, IconClock, IconMusicCode } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import RoomPopover from "./RoomPopover";
import LeaderboardModal from "@rizumu/components/RankingBoard";
import ActivitiesModal from "@rizumu/components/ActivitiesModal";
import StreakPopover from "@rizumu/components/StreakPopover";
import { useAuth } from "@rizumu/context/AuthContext";

function Header({ totalTime }: { totalTime: number }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [opened, setOpened] = useState(false);
  const [activityOpened, setActivityOpened] = useState(false);

  const formatTime = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes - hours * 60;
      return `${hours}h ${mins}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="header flex justify-between h-[8vh]">
      {/* Header Left */}
      <div className="header-left flex items-center justify-center gap-x-sm">
        <IconMusicCode size={30} className="hidden md:block" />
        <h1
          className="text-3xl hidden md:block font-bold text-secondary-hover hover:cursor-pointer"
          onClick={() => navigate("/pomodoro")}
        >
          Rizumu
        </h1>
      </div>
      {/* Header Right */}
      <div className="header-right flex items-center justify-center gap-x-sm">
        <StreakPopover />
        <ResponsiveButton
          leftSection={<IconClock size={16} />}
          className="font-semibold md:py-sm"
          onClick={() => setActivityOpened(!activityOpened)}
        >
          {formatTime(totalTime)}
        </ResponsiveButton>

        <ResponsiveButton
          className="md:py-sm"
          onClick={() => setOpened(!opened)}
        >
          <IconChartColumn size={22} />
        </ResponsiveButton>
        {!user ? null : <RoomPopover />}
        <UserMenu />
      </div>
      <LeaderboardModal opened={opened} setOpened={setOpened} />
      <ActivitiesModal
        opened={activityOpened}
        onClose={() => setActivityOpened(false)}
      />
    </div>
  );
}

export default Header;
