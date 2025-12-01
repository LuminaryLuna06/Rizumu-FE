import React, { useState } from "react";
import Popover from "../Popover";
import {
  IconArrowRight,
  IconChevronRight,
  IconFriends,
  IconMessage,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";

function UserMenu() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const menuItems = [
    { icon: <IconUser size={16} />, label: "Public Profile" },
    { icon: <IconMessage size={16} />, label: "Find study room" },
    { icon: <IconSettings size={16} />, label: "App settings" },
    { icon: <IconFriends size={16} />, label: "Manage friends" },
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
        <div className="font-light">
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
  <li className="flex justify-between items-center px-md py-md hover:bg-primary-hover cursor-pointer border-t-1 border-slate-300/30">
    <div className="flex items-center gap-2">
      {icon}
      {label}
    </div>
    <IconChevronRight size={16} />
  </li>
);

export default UserMenu;
