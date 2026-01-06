import React, { useState } from "react";
import Popover from "../Popover";
import {
  IconApps,
  IconChevronDown,
  IconChevronRight,
  IconExternalLink,
  IconLogout2,
  IconMessage,
  IconSettings,
  IconTool,
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
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
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
      id: "our-apps",
      icon: <IconApps size={16} />,
      label: "Our apps",
      submenu: [
        {
          icon: <IconTool size={16} />,
          label: "CADA Webkit",
          externalLink: "https://cada-utils.vercel.app/",
        },
      ],
    },
    {
      icon: <IconLogout2 size={16} />,
      label: "Logout",
      onClick: async () => {
        await logout();
        toast.info("Loged out", "Info");
        setIsPopoverOpen(!isPopoverOpen);
      },
    },
  ];

  return (
    <>
      <Popover
        opened={isPopoverOpen}
        onClose={() => setIsPopoverOpen(!isPopoverOpen)}
        trigger={
          <div id="user-menu-trigger">
            {user?.avatar ? (
              <img
                src={`${user.avatar}`}
                alt="Avatar"
                className="w-11 h-11 border border-white rounded-full cursor-pointer"
              />
            ) : (
              <div className="flex justify-center items-center rounded-full border-1 p-sm border-secondary bg-primary-light hover:bg-primary-hover cursor-pointer">
                <IconUser className="text-secondary" />
              </div>
            )}
          </div>
        }
        className="w-[18rem]"
        position="top-right"
      >
        <div id="user-menu-content" className="font-light text-sm">
          <p className="text-white px-lg py-md font-semibold">
            {user?.name || "User"}
          </p>
          <ul className="text-secondary border-t-1 border-secondary/20">
            {menuItems.map((item, index) => (
              <React.Fragment key={index}>
                <MenuItem
                  icon={item.icon}
                  label={item.label}
                  onClick={
                    item.submenu
                      ? () =>
                          setExpandedMenu(
                            expandedMenu === item.id ? null : item.id!
                          )
                      : (item.onClick as any)
                  }
                  hasSubmenu={!!item.submenu}
                  isExpanded={expandedMenu === item.id}
                />
                {item.submenu && expandedMenu === item.id && (
                  <ul>
                    {item.submenu.map((subItem, subIndex) => (
                      <SubMenuItem
                        key={subIndex}
                        icon={subItem.icon}
                        label={subItem.label}
                        externalLink={subItem.externalLink}
                      />
                    ))}
                  </ul>
                )}
              </React.Fragment>
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
  hasSubmenu = false,
  isExpanded = false,
}: {
  icon: any;
  label: String;
  onClick?: () => void;
  hasSubmenu?: boolean;
  isExpanded?: boolean;
}) => (
  <li
    className={`flex justify-between items-center p-md hover:bg-primary-hover cursor-pointer ${
      label === "Our apps" || label === "Logout"
        ? "border-t-1 border-secondary/20"
        : ""
    }`}
    onClick={onClick}
  >
    <div className="flex items-center gap-2">
      {icon}
      {label}
    </div>
    {hasSubmenu ? (
      <IconChevronDown
        size={16}
        className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
      />
    ) : (
      <IconChevronRight size={16} />
    )}
  </li>
);

const SubMenuItem = ({
  icon,
  label,
  externalLink,
}: {
  icon: any;
  label: string;
  externalLink: string;
}) => (
  <li
    className="flex justify-between items-center p-md hover:bg-primary-hover cursor-pointer"
    onClick={() => window.open(externalLink, "_blank", "noopener,noreferrer")}
  >
    <div className="flex items-center gap-2">
      {icon}
      {label}
    </div>
    <IconExternalLink size={16} />
  </li>
);

export default UserMenu;
