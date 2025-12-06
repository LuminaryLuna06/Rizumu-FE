import React, { useState } from "react";
import ResponsiveButton from "@rizumu/components/ResponsiveButton";
import UserMenu from "@rizumu/components/UserMenu";
import { IconChartColumn, IconClock, IconMusicCode } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import RoomPopover from "./RoomPopover";
import LeaderboardModal from "@rizumu/components/RankingBoard";

function Header() {
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);
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
        <ResponsiveButton
          leftSection={<IconClock size={16} />}
          className="font-semibold md:py-sm"
        >
          0m
        </ResponsiveButton>

        <ResponsiveButton
          className="md:py-sm"
          onClick={() => setOpened(!opened)}
        >
          <IconChartColumn size={22} />
        </ResponsiveButton>
        <RoomPopover />
        <UserMenu />
      </div>
      <LeaderboardModal opened={opened} setOpened={setOpened} />
    </div>
  );
}

export default Header;
