import ResponsiveButton from "@rizumu/components/ResponsiveButton";
import {
  IconChartInfographic,
  IconClock,
  IconClockHour11Filled,
  IconClockPlay,
  IconCloudFilled,
  IconFlagFilled,
  IconLamp2,
  IconPlayerSkipForwardFilled,
} from "@tabler/icons-react";
import React from "react";

function LandingPage() {
  return (
    <div className="bg-primary-light px-lg text-secondary bg-[url(https://plus.unsplash.com/premium_photo-1666717576644-5701d3406840?q=80&w=3537&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] bg-center">
      <div className="header flex justify-between h-[10vh]">
        {/* Header Left */}
        <div className="header-left flex items-center justify-center">
          <IconLamp2 size={20} />
          <h1 className="text-[20px]">StudyFoc</h1>
        </div>
        {/* Header Right */}
        <div className="header-right flex items-center justify-center gap-lg">
          <ResponsiveButton leftSection={<IconClock size={20} />}>
            0m
          </ResponsiveButton>

          <ResponsiveButton>
            <IconChartInfographic size={20} />
          </ResponsiveButton>
          <ResponsiveButton>Leaving room</ResponsiveButton>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content flex flex-col justify-center items-center gap-y-xs h-[80vh] font-poppins">
        <a href="#!" className="bg-primary-light rounded-md px-sm py-xs">
          Select a tag
        </a>
        <p className="text-[200px] leading-tight">25:00</p>
        <button className="flex justify-center items-center">
          <IconFlagFilled size={20} />
          <p>Website</p>
        </button>
        <div className="flex items-center justify-center gap-x-2xl">
          <IconClockHour11Filled />
          <button className="px-lg py-lg w-[200px] my-lg text-primary rounded-full bg-secondary text-lg font-bold hover:bg-secondary-hover">
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
            <IconCloudFilled size={20} />
          </ResponsiveButton>
          <ResponsiveButton>
            <IconCloudFilled size={20} />
          </ResponsiveButton>
          <ResponsiveButton>
            <IconCloudFilled size={20} />
          </ResponsiveButton>
        </div>

        {/* Footer Right */}
        <div className="flex gap-x-xl justify-center">
          <ResponsiveButton>
            <IconCloudFilled size={20} />
          </ResponsiveButton>
          <ResponsiveButton>
            <IconCloudFilled size={20} />
          </ResponsiveButton>
          <ResponsiveButton>
            <IconCloudFilled size={20} />
          </ResponsiveButton>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
