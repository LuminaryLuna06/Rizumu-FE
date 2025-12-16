import React, { useState } from "react";
import Popover from "../Popover";
import {
  IconChevronRight,
  IconFriends,
  IconLogout,
  IconLogout2,
  IconMessage,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import ProfileModal from "../ProfileModal";
import { useAuth } from "@rizumu/context/AuthContext";
import FindStudyRoomModal from "../FindStudyRoomModal";
import { useToast } from "@rizumu/utils/toast/toast";
import AppSetting from "../AppSetting";

function UserMenu() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isStudyRoomOpen, setIsStudyRoomOpen] = useState(false);
  const [isSettingOpen, setIsSettingOpen] = useState(true);
  const menuItems = [
    {
      icon: <IconUser size={16} />,
      label: "Public Profile",
      onClick: () => setIsProfileOpen(true),
    },
    {
      icon: <IconMessage size={16} />,
      label: "Find study room",
      onClick: () => setIsStudyRoomOpen(true),
    },
    {
      icon: <IconSettings size={16} />,
      label: "App settings",
      onClick: () => setIsSettingOpen(true),
    },
    {
      icon: <IconLogout2 size={16} />,
      label: "Logout",
      onClick: async () => {
        await logout();
        toast.info("Loged out", "Info");
      },
    },
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
      <FindStudyRoomModal
        opened={isStudyRoomOpen}
        onClose={() => setIsStudyRoomOpen(false)}
      />
      <AppSetting
        opened={isSettingOpen}
        onClose={() => setIsSettingOpen(false)}
      />
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
