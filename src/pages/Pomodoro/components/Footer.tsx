import ResponsiveButton from "@rizumu/components/ResponsiveButton";
import {
  IconCloud,
  IconPhoto,
  IconSticker2,
  IconGift,
  IconUsers,
  IconMessage,
} from "@tabler/icons-react";
import React from "react";
import IframePopover from "./IframePopover";

function Footer() {
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
        <ResponsiveButton>
          <IconUsers size={20} />
        </ResponsiveButton>
        <ResponsiveButton>
          <IconMessage size={20} />
        </ResponsiveButton>
      </div>
    </div>
  );
}

export default Footer;
