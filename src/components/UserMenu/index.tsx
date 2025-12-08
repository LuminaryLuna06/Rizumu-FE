import React, { useState } from "react";
import Popover from "../Popover";
import {
  IconChevronRight,
  IconFriends,
  IconMessage,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import ProfileModal from "../ProfileModal";
import { useAuth } from "@rizumu/context/AuthContext";

function UserMenu() {
  const { user } = useAuth();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const menuItems = [
    {
      icon: <IconUser size={16} />,
      label: "Public Profile",
      onClick: () => setIsProfileOpen(!isProfileOpen),
    },
    {
      icon: <IconMessage size={16} />,
      label: "Find study room",
      onClick: null,
    },
    { icon: <IconSettings size={16} />, label: "App settings", onClick: null },
  ];

  return (
    <>
      <Popover
        opened={isPopoverOpen}
        onClose={() => setIsPopoverOpen(!isPopoverOpen)}
        trigger={
          user?.avatar ? (
            <img
              src={`${user.avatar}`}
              alt="Avatar"
              className="w-11 h-11 border border-white rounded-full cursor-pointer"
            />
          ) : (
            <div className="flex justify-center items-center rounded-full border-1 p-sm border-secondary bg-primary-light hover:bg-primary-hover cursor-pointer">
              <IconUser className="text-secondary" />
            </div>
          )
        }
        className="w-[18rem]"
        position="top-right"
      >
        <div className="font-light text-sm">
          <p className="text-white px-lg py-md font-semibold">
            {user?.name || "User"}
          </p>
          <ul className="text-secondary">
            {menuItems.map((item, index) => (
              <MenuItem
                key={index}
                icon={item.icon}
                label={item.label}
                onClick={item.onClick as any}
              />
            ))}
          </ul>
        </div>
      </Popover>
      <ProfileModal
        opened={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onOpenProfile={() => setIsProfileOpen(true)}
      ></ProfileModal>
    </>
  );
}

const MenuItem = ({
  icon,
  label,
  onClick,
}: {
  icon: any;
  label: String;
  onClick?: () => void;
}) => (
  <li
    className="flex justify-between items-center px-md py-md hover:bg-primary-hover cursor-pointer border-t-1 border-secondary/20"
    onClick={onClick}
  >
    <div className="flex items-center gap-2">
      {icon}
      {label}
    </div>
    <IconChevronRight size={16} />
  </li>
);

export default UserMenu;
