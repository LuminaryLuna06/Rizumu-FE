import React, { useState } from "react";
import Popover from "../Popover";
import {
  IconArrowRight,
  IconFriends,
  IconMessage,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";

function UserMenu() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const menuItems = [
    { icon: <IconUser />, label: "Public Profile" },
    { icon: <IconMessage />, label: "Find study room" },
    { icon: <IconSettings />, label: "App settings" },
    { icon: <IconFriends />, label: "Manage friends" },
  ];

  return (
    <div>
      <Popover
        opened={isPopoverOpen}
        onClose={() => setIsPopoverOpen(!isPopoverOpen)}
        trigger={
          <button className="bg-primary text-secondary px-lg py-md rounded-md hover:bg-primary-hover transition-all duration-base">
            Thêm Iframe
          </button>
        }
      >
        <div>
          <p className="text-white px-md py-md">UserName</p>
          <div className="h-[1px] bg-oklch(70.7% 0.022 261.325)"></div>

          <ul className="text-secondary">
            {menuItems.map((item, index) => (
              <MenuItem key={index} icon={item.icon} label={item.label} />
            ))}
          </ul>
        </div>
      </Popover>
    </div>
  );
}

const MenuItem = ({ icon, label }: { icon: any; label: String }) => (
  <li className="flex justify-between px-md py-md hover:bg-primary-hover cursor-pointer border-t-1 border-slate-300/30">
    <div className="flex items-center gap-2">
      {icon}
      {label}
    </div>
    <div>
      <IconArrowRight />
    </div>
  </li>
);

export default UserMenu;
