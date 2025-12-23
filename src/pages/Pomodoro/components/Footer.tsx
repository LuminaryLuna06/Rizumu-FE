import ResponsiveButton from "@rizumu/components/ResponsiveButton";
import { IconPhoto, IconUsers } from "@tabler/icons-react";
import { useState } from "react";
import IframePopover from "./IframePopover";
import ManageFriendModal from "@rizumu/components/ManageFriendModal";
import ChatPopover from "./ChatPopover";
import BackgroundModal from "@rizumu/components/BackgroundModal";
import { useMemo } from "react";
import { useAuth } from "@rizumu/context/AuthContext";
import { useFriendRequests } from "@rizumu/tanstack/api/hooks";

interface FooterProps {
  onBackgroundChange: (bg: { name: string; type: string }) => void;
}

function Footer({ onBackgroundChange }: FooterProps) {
  const { user } = useAuth();
  const [friendOpened, setFriendOpened] = useState(false);
  const [backgroundModalOpened, setBackgroundModalOpened] = useState(false);

  const { data: friendRequests } = useFriendRequests(!!user?._id);

  const numberRequest = useMemo(() => {
    return friendRequests?.length || 0;
  }, [friendRequests]);
  return (
    <div className="footer flex justify-between h-[10vh] items-center">
      {/* Footer Left */}
      <div className="flex gap-x-lg">
        <IframePopover />
        <ResponsiveButton
          onClick={() => setBackgroundModalOpened(true)}
          className={`transition-all duration-500 ${
            focusMode ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <IconPhoto size={20} />
        </ResponsiveButton>
        {/* <ResponsiveButton>
          <IconSticker2 size={20} />
        </ResponsiveButton> */}
      </div>

      {/* Footer Right */}
      <div
        className={`flex gap-x-lg justify-center transition-all duration-500 ${
          focusMode ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <ResponsiveButton onClick={() => setFriendOpened(true)}>
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
        <ChatPopover />
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
