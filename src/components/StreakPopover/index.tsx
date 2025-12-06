import { IconFlame, IconTrophy, IconTrophyFilled } from "@tabler/icons-react";
import React, { useState } from "react";
import Popover from "../Popover";
import ResponsiveButton from "../ResponsiveButton";

function StreakPopover() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [streaks, setStreaks] = useState(4);
  return (
    <>
      <Popover
        opened={isPopoverOpen}
        onClose={() => setIsPopoverOpen(!isPopoverOpen)}
        trigger={
          <ResponsiveButton
            leftSection={<IconFlame size={16} />}
            className="font-semibold md:py-sm"
          >
            {streaks}
          </ResponsiveButton>
        }
        position="top-right"
      >
        <div className="p-lg font-semibold text-secondary">
          <div className="flex items-center justify-between">
            <div className="flex flex-col px-4">
              <p className=" text-2xl">You are on</p>
              <p className="font-bold text-5xl">{streaks}</p>
              <p className="text-secondary/50 ">Streak days</p>
            </div>
            <div>
              <img
                src={"/gif/Flame2.gif"}
                alt="FireStreak"
                className="w-[120px] h-[120px]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-secondary/10 p-lg">
            <div className="text-secondary/50">Best Streak</div>
            <div className="flex gap-1">
              <IconTrophyFilled size={22} />
              <p className="font-bold">{streaks} days</p>
            </div>
          </div>
        </div>
      </Popover>
    </>
  );
}

export default StreakPopover;
