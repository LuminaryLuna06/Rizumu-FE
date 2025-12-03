import { IconFlameFilled, IconTrophy, IconUser } from "@tabler/icons-react";
import React, { useState } from "react";
import Modal from "../Modal";
import FireStreak3Img from "@rizumu/assets/image/FireStreak3.png";
import Popover from "../Popover";

function StreakModal() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(true);
  return (
    <>
      <Popover
        opened={isPopoverOpen}
        onClose={() => setIsPopoverOpen(!isPopoverOpen)}
        trigger={
          <div className="flex justify-center items-center rounded-full border-2 p-sm border-secondary bg-primary hover:bg-primary-hover cursor-pointer">
            <IconFlameFilled className="text-secondary" />
            <p className="text-white">1</p>
          </div>
        }
        position="right"
      >
        <div className="flex items-center justify-between text-white mx-lg mt-lg">
          <div className="flex flex-col px-4">
            <p className="font-semibold text-2xl">You are on</p>
            <p className="font-bold text-5xl">1</p>
            <p className="text-grey">Streak day</p>
          </div>
          <div>
            <img
              src={FireStreak3Img}
              alt="FireStreak"
              className="w-[120px] h-[120px]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 rounded-xl border-solid text-white bg-popover-overlay/50 border-secondary m-lg hover:bg-secondary-hover/30 cursor-pointer">
          <div className="px-4 py-6">Best Streak</div>
          <div className="flex px-4 py-6 gap-2">
            <IconTrophy />
            <p className="font-bold">1 day</p>
          </div>
        </div>
      </Popover>
    </>
  );
}

export default StreakModal;
