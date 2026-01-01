import ResponsiveButton from "@rizumu/components/ResponsiveButton";
import UserMenu from "@rizumu/components/UserMenu";
import {
  IconChartColumn,
  IconClock,
  IconMusicCode,
  IconMaximize,
  IconMinimize,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import RoomPopover from "./RoomPopover";
import LeaderboardModal from "@rizumu/components/RankingBoard";
import ActivitiesModal from "@rizumu/components/ActivitiesModal";
import StreakPopover from "@rizumu/components/StreakPopover";
import { useAuth } from "@rizumu/context/AuthContext";
import { useState, useMemo, useEffect } from "react";
import { useHourlyData } from "@rizumu/tanstack/api/hooks";
import TagSelector from "./TagSelector";
import type { ModelTag } from "@rizumu/models/tag";

function Header({
  focusMode,
  selectedTag,
  onTagSelect,
}: {
  focusMode: boolean;
  selectedTag: ModelTag | null;
  onTagSelect: (tag: ModelTag | null) => void;
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [opened, setOpened] = useState(false);
  const [activitiesModalOpened, setActivitiesModalOpened] = useState(false);

  const { startTime, endTime } = useMemo(() => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const date = new Date().getDate();

    return {
      startTime: new Date(year, month, date, 0, 0, 0, 0).toISOString(),
      endTime: new Date(year, month, date, 23, 59, 59, 999).toISOString(),
    };
  }, []);

  const { data: hourlyDurations } = useHourlyData(
    startTime,
    endTime,
    user?._id || "",
    !!user?._id
  );

  const totalTime = useMemo(() => {
    if (!hourlyDurations) return 0;
    return Math.floor(hourlyDurations.reduce((sum, val) => sum + val, 0));
  }, [hourlyDurations]);

  const formatTime = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes - hours * 60;
      return `${hours}h ${mins}m`;
    }
    return `${minutes}m`;
  };

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="header flex justify-between h-[8vh] px-md pt-xl lg:pt-0">
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
        <div
          className={`flex items-center justify-center gap-x-sm transition-all duration-500 ${
            focusMode ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="hidden md:block lg:hidden">
            <TagSelector selectedTag={selectedTag} onTagSelect={onTagSelect} />
          </div>
          <div id="header-streak">
            <StreakPopover />
          </div>

          <div id="header-activities">
            <ResponsiveButton
              leftSection={<IconClock size={16} />}
              className="font-semibold md:py-sm"
              onClick={() => setActivitiesModalOpened(!activitiesModalOpened)}
              ariaLabel="Open activities analytic"
              title="Open activities analytic"
            >
              {formatTime(totalTime)}
            </ResponsiveButton>
          </div>

          <div id="header-leaderboard">
            <ResponsiveButton
              className="md:py-sm"
              onClick={() => setOpened(!opened)}
              ariaLabel="Open leaderboard"
              title="Open leaderboard"
            >
              <IconChartColumn size={22} />
            </ResponsiveButton>
          </div>
          {!user ? null : (
            <div id="header-room">
              <RoomPopover />
            </div>
          )}
          <div id="header-user-menu">
            <UserMenu />
          </div>
        </div>

        <div
          className={`absolute right-4 transition-all duration-500 ${
            focusMode ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          title={
            isFullscreen
              ? "Thoát chế độ toàn màn hình"
              : "Mở chế độ toàn màn hình"
          }
        >
          <ResponsiveButton
            className="md:py-sm"
            onClick={toggleFullscreen}
            ariaLabel={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <IconMinimize size={22} />
            ) : (
              <IconMaximize size={22} />
            )}
          </ResponsiveButton>
        </div>
      </div>
      <LeaderboardModal opened={opened} setOpened={setOpened} />
      <ActivitiesModal
        opened={activitiesModalOpened}
        onClose={() => setActivitiesModalOpened(false)}
      />
    </div>
  );
}

export default Header;
