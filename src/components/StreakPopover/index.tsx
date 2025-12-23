import { IconFlame, IconTrophyFilled } from "@tabler/icons-react";
import { useState } from "react";
import Popover from "../Popover";
import ResponsiveButton from "../ResponsiveButton";
import { useAuth } from "@rizumu/context/AuthContext";
import { useProgress } from "@rizumu/tanstack/api/hooks";

function StreakPopover() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { user } = useAuth();
  const { data: streaks, isLoading: streaksLoading } = useProgress(!!user);

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
            {streaksLoading ? 0 : streaks && streaks.currentStreak}
          </ResponsiveButton>
        }
        position="top-right"
        className="w-78 md:w-90"
      >
        <div className="p-lg font-semibold text-secondary">
          <div className="flex items-center justify-between">
            <div className="flex flex-col px-4">
              <p className=" text-2xl">You are on</p>
              <p className="font-bold text-5xl">
                {streaksLoading ? "..." : streaks && streaks.currentStreak}
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
                {streaksLoading ? "..." : streaks && streaks.bestStreak}
              </p>
            </div>
          </div>
        </div>
      </Popover>
    </>
  );
}

export default StreakPopover;
