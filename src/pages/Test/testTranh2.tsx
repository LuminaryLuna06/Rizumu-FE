import { IconClock, IconMusic, IconCheck, IconX } from "@tabler/icons-react";
import { useState, useRef, useEffect } from "react";

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
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  return (
    <div className="p-xl">
      <h1 className="text-3xl mb-lg">Test Tranh 2</h1>

      <div className="relative inline-block">
        <button
          ref={buttonRef}
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          className="bg-primary text-secondary px-lg py-md rounded-md hover:bg-primary-hover transition-all duration-base"
        >
          Thêm Iframe
        </button>

        <>
          <div
            className={`fixed inset-0 z-modal transition-opacity duration-base ${
              isPopoverOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsPopoverOpen(false)}
          />

          <div
            className={`absolute left-0 top-full mt-sm z-popover w-96 transition-all duration-base ${
              isPopoverOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2 pointer-events-none"
            }`}
          >
            <div className="bg-modal-overlay backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl border border-white border-opacity-20">
              <div className="flex items-center justify-between px-lg py-md bg-black bg-opacity-40 border-b  border-opacity-10">
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
                    <button className="flex items-center gap-xs text-secondary text-sm opacity-70 hover:opacity-100 transition-opacity duration-base">
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
            </div>
          </div>
        </>
      </div>
    </div>
  );
}

export default testTranh2;
