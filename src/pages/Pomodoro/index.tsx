import React from "react";
import ResponsiveButton from "@rizumu/components/ResponsiveButton";
import {
  IconChartInfographic,
  IconClock,
  IconClockHour11Filled,
  IconCloud,
  IconFlag,
  IconGift,
  IconMessage,
  IconMusic,
  IconMusicCode,
  IconPhoto,
  IconPlayerSkipForwardFilled,
  IconSticker2,
  IconUsers,
} from "@tabler/icons-react";
import fujiImg from "@rizumu/assets/image/fuji2.jpg";
import { useNavigate } from "react-router-dom";
import IframePopover from "./components/IframePopover";

function PomodoroPage() {
  const navigate = useNavigate();
  return (
    <div
      className="bg-primary-light px-xl text-secondary bg-center z-base font-light"
      style={{ backgroundImage: `url(${fujiImg})` }}
    >
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
            <IconChartInfographic size={24} />
          </ResponsiveButton>
          <ResponsiveButton className="md:py-sm truncate">
            Leaving room
          </ResponsiveButton>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content flex flex-col justify-center items-center gap-y-xs h-[82vh]">
        <a
          href="/#/pomodoro"
          className="bg-primary-light rounded-xl px-xl py-xs hover:bg-primary-secondary-hover transition-colors duration-300 ease-in-out cursor-pointer"
        >
          Select a tag
        </a>

        <div className="flex gap-x-xl items-center mt-10">
          <div className="w-8 h-8 rounded-full bg-secondary"></div>
          <div className="w-7 h-7 hover:w-8 hover:h-8 hover:bg-secondary rounded-full bg-secondary/60 transition-all duration-slow"></div>
          <div className="w-7 h-7 hover:w-8 hover:h-8 hover:bg-secondary rounded-full bg-secondary/60 transition-all duration-slow"></div>
        </div>

        <p className="leading-tight md:text-[9em] text-[6em] font-bold tracking-[0.07em] transition-all duration-slower ease-in-out">
          25:00
        </p>
        <button className="flex justify-center items-center">
          <IconFlag size={20} />
          <p>Website</p>
        </button>
        <div className="flex items-center justify-center gap-x-xl cursor-pointer">
          <IconClockHour11Filled />
          <button className="px-lg py-lg w-[140px] md:w-[200px] md:text-lg md:px-lg md:py-lg my-lg text-primary rounded-full bg-secondary text-lg font-bold hover:bg-secondary-hover cursor-pointer transition-colors duration-300">
            Start
          </button>
          <IconPlayerSkipForwardFilled />
        </div>
      </div>

      {/* Footer */}
      <div className="footer flex justify-between h-[10vh] items-center">
        {/* Footer Left */}
        <div className="flex gap-x-lg">
          <ResponsiveButton>
            <IconCloud size={20} />
          </ResponsiveButton>
          <IframePopover />
          <ResponsiveButton>
            <IconPhoto size={20} />
          </ResponsiveButton>
          <ResponsiveButton>
            <IconSticker2 size={20} />
          </ResponsiveButton>
        </div>

        {/* Footer Right */}
        <div className="flex gap-x-lg justify-center">
          <ResponsiveButton>
            <IconGift size={20} />
          </ResponsiveButton>
          <ResponsiveButton>
            <IconUsers size={20} />
          </ResponsiveButton>
          <ResponsiveButton>
            <IconMessage size={20} />
          </ResponsiveButton>
        </div>
      </div>
    </div>
  );
}

export default PomodoroPage;
