import ResponsiveButton from "@rizumu/components/ResponsiveButton";
import { IconCloud, IconPhoto, IconGift, IconUsers } from "@tabler/icons-react";
import { useState } from "react";
import IframePopover from "./IframePopover";
import ManageFriendModal from "@rizumu/components/ManageFriendModal";
import ChatPopover from "./ChatPopover";
import BackgroundModal from "@rizumu/components/BackgroundModal";

interface FooterProps {
  onBackgroundChange: (bg: { name: string; type: string }) => void;
}

function Footer({ onBackgroundChange }: FooterProps) {
  const [friendOpened, setFriendOpened] = useState(false);
  const [backgroundModalOpened, setBackgroundModalOpened] = useState(false);
  return (
    <div className="footer flex justify-between h-[10vh] items-center">
      {/* Footer Left */}
      <div className="flex gap-x-lg">
        <ResponsiveButton>
          <IconCloud size={20} />
        </ResponsiveButton>
        <IframePopover />
        <ResponsiveButton onClick={() => setBackgroundModalOpened(true)}>
          <IconPhoto size={20} />
        </ResponsiveButton>
        {/* <ResponsiveButton>
          <IconSticker2 size={20} />
        </ResponsiveButton> */}
      </div>

      {/* Footer Right */}
      <div className="flex gap-x-lg justify-center">
        <ResponsiveButton>
          <IconGift size={20} />
        </ResponsiveButton>
        <ResponsiveButton onClick={() => setFriendOpened(true)}>
          <IconUsers size={20} />
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
