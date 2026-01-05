import ResponsiveButton from "@rizumu/components/ResponsiveButton";
import { IconPhoto, IconUsers, IconHelp } from "@tabler/icons-react";
import { useState } from "react";
import IframePopover from "../../../components/IframePopover";
import ManageFriendModal from "@rizumu/components/ManageFriendModal";
import ChatPopover from "../../../components/ChatPopover";
import BackgroundModal from "@rizumu/components/BackgroundModal";
import { useMemo } from "react";
import { useAuth } from "@rizumu/context/AuthContext";
import { useFriendRequests, useRoomById } from "@rizumu/tanstack/api/hooks";
import { useDriverTour } from "@rizumu/hooks/useDriverTour";

interface FooterProps {
  onBackgroundChange: (bg: { name: string; type: string }) => void;
  focusMode: boolean;
}

function Footer({ onBackgroundChange, focusMode }: FooterProps) {
  const { user } = useAuth();
  const [friendOpened, setFriendOpened] = useState(false);
  const [backgroundModalOpened, setBackgroundModalOpened] = useState(false);
  const { startTimerTour } = useDriverTour();

  const { data: friendRequests } = useFriendRequests(!!user?._id);
  const { data: room } = useRoomById(user?.current_room_id || "");

  const numberRequest = useMemo(() => {
    return friendRequests?.length || 0;
  }, [friendRequests]);

  const checkAdmin = () => {
    if (!room?.owner_id || !user?._id) return false;
    return room.owner_id === user._id;
  };

  return (
    <div className="footer flex justify-between h-[10vh] items-center px-md pb-lg lg:pb-0">
      {/* Footer Left */}
      <div className="flex gap-x-lg">
        <div id="footer-iframe">
          <IframePopover />
        </div>
        {checkAdmin() && (
          <div id="footer-background">
            <ResponsiveButton
              onClick={() => setBackgroundModalOpened(true)}
              className={`${
                focusMode ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
              ariaLabel="Change background"
              title="Change background"
            >
              <IconPhoto size={20} />
            </ResponsiveButton>
          </div>
        )}
        <div id="footer-tutorial">
          <ResponsiveButton
            onClick={startTimerTour}
            className={`${
              focusMode ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
            ariaLabel="Start tutorial"
            title="Start tutorial"
          >
            <IconHelp size={20} />
          </ResponsiveButton>
        </div>
      </div>

      {/* Footer Right */}
      <div className={`flex gap-x-lg justify-center`}>
        <div
          id="footer-friends"
          className={`${
            focusMode ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <ResponsiveButton
            onClick={() => setFriendOpened(true)}
            ariaLabel="Manage friends"
            title="Manage friends"
          >
            <div className="grid grid-cols-1 grid-rows-1">
              <div className="col-start-1 row-start-1">
                <IconUsers size={20} />
              </div>
              {numberRequest > 0 && (
                <div className="col-start-1 row-start-1 self-start justify-self-end -mt-2.5 -mr-2.5">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-primary shadow-sm">
                    {numberRequest > 9 ? "9+" : numberRequest}
                  </span>
                </div>
              )}
            </div>
          </ResponsiveButton>
        </div>
        <div
          id="footer-chat"
          className={`${
            focusMode && !room?.chat_during_pomodoro
              ? "opacity-0 pointer-events-none"
              : "opacity-100"
          }`}
        >
          <ChatPopover />
        </div>
      </div>
      <ManageFriendModal
        opened={friendOpened}
        onClose={() => setFriendOpened(false)}
      />
      <BackgroundModal
        opened={backgroundModalOpened}
        onClose={() => setBackgroundModalOpened(false)}
        onChange={onBackgroundChange}
      />
    </div>
  );
}

export default Footer;
