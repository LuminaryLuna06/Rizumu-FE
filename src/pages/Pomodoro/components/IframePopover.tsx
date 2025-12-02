import { IconClock, IconMusic, IconCheck, IconX } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import Popover from "@rizumu/components/Popover";
import ResponsiveButton from "@rizumu/components/ResponsiveButton";

function testTranh2() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [previewData, setPreviewData] = useState<{
    type: "youtube" | "spotify" | null;
    embedUrl: string;
  }>({ type: null, embedUrl: "" });
  const [tempPreviewData, setTempPreviewData] = useState<{
    type: "youtube" | "spotify" | null;
    embedUrl: string;
  }>({ type: null, embedUrl: "" });

  useEffect(() => {
    if (!inputUrl.trim() || !isEditing) {
      setTempPreviewData({ type: null, embedUrl: "" });
      return;
    }

    if (inputUrl.includes("youtube.com") || inputUrl.includes("youtu.be")) {
      let videoId = "";

      if (inputUrl.includes("youtube.com/watch?v=")) {
        videoId = inputUrl.split("v=")[1]?.split("&")[0];
      } else if (inputUrl.includes("youtu.be/")) {
        videoId = inputUrl.split("youtu.be/")[1]?.split("?")[0];
      } else if (inputUrl.includes("youtube.com/embed/")) {
        videoId = inputUrl.split("embed/")[1]?.split("?")[0];
      }

      if (videoId) {
        setTempPreviewData({
          type: "youtube",
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
        });
      }
    } else if (inputUrl.includes("spotify.com")) {
      let embedUrl = inputUrl;

      if (
        inputUrl.includes("open.spotify.com") &&
        !inputUrl.includes("embed")
      ) {
        embedUrl = inputUrl.replace(
          "open.spotify.com",
          "open.spotify.com/embed"
        );
      }

      setTempPreviewData({
        type: "spotify",
        embedUrl: embedUrl,
      });
    } else {
      setTempPreviewData({ type: null, embedUrl: "" });
    }
  }, [inputUrl, isEditing]);

  const handleSetIframe = () => {
    if (tempPreviewData.type && tempPreviewData.embedUrl) {
      setPreviewData(tempPreviewData);
      setIsEditing(false);
      setInputUrl("");
      setTempPreviewData({ type: null, embedUrl: "" });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setInputUrl("");
    setTempPreviewData({ type: null, embedUrl: "" });
  };

  const handleChangeClick = () => {
    setIsEditing(true);
  };

  const handleRecentClick = () => {
    console.log("Recent clicked");
  };

  return (
    <Popover
      opened={isPopoverOpen}
      onClose={() => setIsPopoverOpen(!isPopoverOpen)}
      trigger={
        <ResponsiveButton>
          <IconMusic size={20} />
        </ResponsiveButton>
      }
      position="top"
    >
      <div className="flex items-center justify-between px-lg py-md">
        <h3 className="text-secondary capitalize">
          {previewData.type || "YouTube, Spotify"}
        </h3>

        {isEditing ? (
          <div className="flex items-center gap-sm flex-1 ml-md">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="URL from YT, Spotify, Apple Music"
              className="flex-1 px-md py-xs rounded-md bg-secondary text-primary outline-none focus:ring-2 focus:ring-primary transition-all duration-base text-xs"
              autoFocus
            />
            <button
              onClick={handleSetIframe}
              disabled={!tempPreviewData.type}
              className="p-xs rounded-md bg-green-600 text-secondary hover:bg-green-700 transition-all duration-base disabled:opacity-30 disabled:cursor-not-allowed"
              title="Set iframe"
            >
              <IconCheck size={18} />
            </button>
            <button
              onClick={handleCancelEdit}
              className="p-xs rounded-md bg-red-600 text-secondary hover:bg-red-700 transition-all duration-base"
              title="Cancel"
            >
              <IconX size={18} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-md">
            <button
              onClick={handleRecentClick}
              className="flex items-center gap-xs text-secondary text-sm opacity-70 hover:opacity-100 transition-opacity duration-base"
            >
              <IconClock size={20} />
              <span>Recent</span>
            </button>
            <button
              onClick={handleChangeClick}
              className="flex items-center gap-xs text-secondary text-sm opacity-70 hover:opacity-100 transition-opacity duration-base"
            >
              <IconMusic size={20} />
              <span>Change</span>
            </button>
          </div>
        )}
      </div>

      <div className="p-lg">
        {previewData.type && previewData.embedUrl ? (
          <div className="bg-black rounded-md overflow-hidden">
            <iframe
              src={previewData.embedUrl}
              width="100%"
              height={previewData.type === "youtube" ? "200" : "152"}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full"
            />
          </div>
        ) : (
          <div className="text-center text-secondary opacity-50 py-xl">
            Click "Change" to add YouTube or Spotify
          </div>
        )}
      </div>
    </Popover>
  );
}

export default testTranh2;
