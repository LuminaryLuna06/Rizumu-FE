import { IconFlame, IconTrophy, IconTrophyFilled } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import Popover from "../Popover";
import ResponsiveButton from "../ResponsiveButton";
import axiosClient from "@rizumu/api/config/axiosClient";
import type { ModelStreak } from "@rizumu/models/streak";

function StreakPopover() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [streaks, setStreaks] = useState<ModelStreak>();
  const getStreak = async () => {
    try {
      const response = await axiosClient.get("/progress");
      setStreaks(response.data);
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    getStreak();
  }, []);
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
            {streaks ? streaks.currentStreak : 0}
          </ResponsiveButton>
        }
        position="top-right"
      >
        <div className="p-lg font-semibold text-secondary">
          <div className="flex items-center justify-between">
            <div className="flex flex-col px-4">
              <p className=" text-2xl">You are on</p>
              <p className="font-bold text-5xl">
                {streaks ? streaks.currentStreak : "..."}
              </p>
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
              <p className="font-bold">
                {streaks ? streaks.bestStreak : "..."} days
              </p>
            </div>
          </div>
        </div>
      </Popover>
    </>
  );
}

export default StreakPopover;
