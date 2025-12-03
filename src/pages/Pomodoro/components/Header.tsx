import React from "react";
import ResponsiveButton from "@rizumu/components/ResponsiveButton";
import UserMenu from "@rizumu/components/UserMenu";
import { IconChartColumn, IconClock, IconMusicCode } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import RoomPopover from "./RoomPopover";

function Header() {
  const navigate = useNavigate();
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
          className="font-normal md:py-sm"
        >
          0m
        </ResponsiveButton>

        <ResponsiveButton className="md:py-sm">
          <IconChartColumn size={22} />
        </ResponsiveButton>
        <RoomPopover />
        <UserMenu />
      </div>
    </div>
  );
}

export default Header;
