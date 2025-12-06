import ResponsiveButton from "@rizumu/components/ResponsiveButton";
import {
  IconCloud,
  IconPhoto,
  IconSticker2,
  IconGift,
  IconUsers,
  IconMessage,
} from "@tabler/icons-react";
import React, { useState } from "react";
import IframePopover from "./IframePopover";
import ManageFriendModal from "@rizumu/components/ManageFriendModal";

function Footer() {
  const [friendOpened, setFriendOpened] = useState(false);
  return (
    <div className="footer flex justify-between h-[10vh] items-center">
      {/* Footer Left */}
      <div className="flex gap-x-lg">
        <ResponsiveButton>
          <IconCloud size={20} />
        </ResponsiveButton>
        <IframePopover />
        <ResponsiveButton>
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
        <ResponsiveButton>
          <IconMessage size={20} />
        </ResponsiveButton>
      </div>
      <ManageFriendModal
        opened={friendOpened}
        onClose={() => setFriendOpened(false)}
      />
    </div>
  );
}

export default Footer;
