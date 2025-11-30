import React from "react";
import ResponsiveButton from "@rizumu/components/ResponsiveButton";
import {
  IconChartInfographic,
  IconClock,
  IconClockHour11Filled,
  IconCloudFilled,
  IconFlagFilled,
  IconGift,
  IconLamp2,
  IconMessage,
  IconMusic,
  IconPhoto,
  IconPlayCard,
  IconPlayerSkipForwardFilled,
  IconSticker2,
  IconUsers,
} from "@tabler/icons-react";
import backgroundImg from "@rizumu/assets/image/BG.jpg";

function PomodoroPage() {
  return (
    <div
      className="bg-primary-light px-lg text-secondary bg-center"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className="header flex justify-between h-[10vh]">
        {/* Header Left */}
        <div className="header-left flex items-center justify-center">
          <IconLamp2 size={20} className="hidden md:block" />
          <h1 className="text-[20px] hidden md:block">StudyFoc</h1>
        </div>
        {/* Header Right */}
        <div className="header-right flex items-center justify-center gap-lg">
          <ResponsiveButton
            leftSection={<IconClock size={20} />}
            className="font-bold"
          >
            0m
          </ResponsiveButton>

          <ResponsiveButton>
            <IconChartInfographic size={20} />
          </ResponsiveButton>
          <ResponsiveButton>Leaving room</ResponsiveButton>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content flex flex-col justify-center items-center gap-y-xs h-[80vh] font-inter">
        <a
          href="#!"
          className="bg-primary-light rounded-xl px-xl py-xs hover:bg-primary-secondary-hover transition-colors duration-300 ease-in-out cursor-pointer"
        >
          Select a tag
        </a>
        <p className="leading-tight timer lg:text-[13em] sm:text-[9em] md:text-[10em] text-[8em] font-bold tracking-[0.07em] drop-shadow-[0_2px_30px_rgba(255,255,255,0.15)] filter leading-[100%] transition-all duration-800 ease-in-out">
          25:00
        </p>
        <button className="flex justify-center items-center">
          <IconFlagFilled size={20} />
          <p>Website</p>
        </button>
        <div className="flex items-center justify-center gap-x-2xl cursor-pointer">
          <IconClockHour11Filled />
          <button className="px-lg py-lg w-[140px] md:w-[200px] md:text-lg md:px-lg md:py-lg my-lg text-primary rounded-full bg-secondary text-lg font-bold hover:bg-secondary-hover cursor-pointer transition-colors duration-300">
            Start
          </button>
          <IconPlayerSkipForwardFilled />
        </div>
      </div>

      {/* Footer */}
      <div className="footer flex justify-between h-[10vh]  items-center">
        {/* Footer Left */}
        <div className="flex gap-x-xl">
          <ResponsiveButton>
            <IconCloudFilled size={20} />
          </ResponsiveButton>
          <ResponsiveButton>
            <IconMusic size={20} />
          </ResponsiveButton>
          <ResponsiveButton>
            <IconPhoto size={20} />
          </ResponsiveButton>
          <ResponsiveButton>
            <IconSticker2 size={20} />
          </ResponsiveButton>
        </div>

        {/* Footer Right */}
        <div className="flex gap-x-xl justify-center">
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
