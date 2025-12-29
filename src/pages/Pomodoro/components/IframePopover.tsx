import {
  IconClock,
  IconMusic,
  IconCheck,
  IconX,
  IconBrandYoutube,
  IconBrandSpotify,
  IconBrandApple,
  IconBrandSoundcloud,
  IconTrash,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import Popover from "@rizumu/components/Popover";
import ResponsiveButton from "@rizumu/components/ResponsiveButton";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";

const STORAGE_KEY_CURRENT = "iframe_current_link";
const STORAGE_KEY_HISTORY = "iframe_link_history";
const MAX_HISTORY_ITEMS = 10;

interface LinkData {
  url: string;
  type: "youtube" | "spotify" | "appleMusic" | "soundCloud";
  embedUrl: string;
  timestamp: number;
  title?: string;
  thumbnail?: string;
}

function IframePopover() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  const [linkHistory, setLinkHistory] = useState<LinkData[]>([]);
  const [previewData, setPreviewData] = useState<{
    type: "youtube" | "spotify" | "appleMusic" | "soundCloud" | null;
    embedUrl: string;
  }>({ type: null, embedUrl: "" });
  const [tempPreviewData, setTempPreviewData] = useState<{
    type: "youtube" | "spotify" | "appleMusic" | "soundCloud" | null;
    embedUrl: string;
  }>({ type: null, embedUrl: "" });

  // Load current link and history from localStorage on mount
  useEffect(() => {
    const savedCurrent = localStorage.getItem(STORAGE_KEY_CURRENT);
    if (savedCurrent) {
      try {
        const currentData = JSON.parse(savedCurrent) as LinkData;
        setPreviewData({
          type: currentData.type,
          embedUrl: currentData.embedUrl,
        });
      } catch (error) {
        console.error("Failed to load current link:", error);
      }
    }

    const savedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory) as LinkData[];
        setLinkHistory(history);
      } catch (error) {
        console.error("Failed to load link history:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!inputUrl.trim() || !isEditing) {
      setTempPreviewData({ type: null, embedUrl: "" });
      return;
    }

    if (inputUrl.includes("youtube.com") || inputUrl.includes("youtu.be")) {
      let videoId = "";
      let playlistId = "";

      if (inputUrl.includes("list=")) {
        playlistId = inputUrl.split("list=")[1]?.split("&")[0];
      }

      if (inputUrl.includes("youtube.com/watch?v=")) {
        videoId = inputUrl.split("v=")[1]?.split("&")[0];
      } else if (inputUrl.includes("youtu.be/")) {
        videoId = inputUrl.split("youtu.be/")[1]?.split("?")[0];
      } else if (inputUrl.includes("youtube.com/embed/")) {
        videoId = inputUrl.split("embed/")[1]?.split("?")[0];
      }

      if (playlistId) {
        setTempPreviewData({
          type: "youtube",
          embedUrl: `https://www.youtube.com/embed/${
            videoId ? videoId : ""
          }videoseries?list=${playlistId}`,
        });
      } else if (videoId) {
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
    } else if (inputUrl.includes("music.apple.com")) {
      let embedUrl = inputUrl;

      if (!inputUrl.includes("embed")) {
        embedUrl = inputUrl.replace("music.apple.com", "embed.music.apple.com");
      }

      setTempPreviewData({
        type: "appleMusic",
        embedUrl: embedUrl,
      });
    } else if (inputUrl.includes("soundcloud.com")) {
      const encodedUrl = encodeURIComponent(inputUrl);
      setTempPreviewData({
        type: "soundCloud",
        embedUrl: `https://w.soundcloud.com/player/?url=${encodedUrl}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`,
      });
    } else {
      setTempPreviewData({ type: null, embedUrl: "" });
    }
  }, [inputUrl, isEditing]);

  const fetchLinkMetadata = async (
    url: string,
    type: "youtube" | "spotify" | "appleMusic" | "soundCloud"
  ): Promise<{ title: string; thumbnail?: string }> => {
    if (type === "youtube") {
      try {
        const response = await fetch(
          `https://www.youtube.com/oembed?url=${encodeURIComponent(
            url
          )}&format=json`
        );
        if (response.ok) {
          const data = await response.json();
          return {
            title: data.title || "YouTube Video",
            thumbnail: data.thumbnail_url,
          };
        }
      } catch (error) {
        console.error("Failed to fetch YouTube metadata:", error);
      }
      return { title: "YouTube Video" };
    } else if (type === "spotify") {
      // For Spotify, use official Web API SDK
      try {
        // Initialize Spotify API with Client Credentials from environment
        const spotify = SpotifyApi.withClientCredentials(
          import.meta.env.VITE_SPOTIFY_CLIENT_ID,
          import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
        );

        // Extract Spotify ID from URL
        const urlParts = url.split("/");
        const typeIndex = urlParts.findIndex(
          (part) => part === "track" || part === "playlist" || part === "album"
        );

        if (typeIndex === -1 || !urlParts[typeIndex + 1]) {
          throw new Error("Invalid Spotify URL");
        }

        const contentType = urlParts[typeIndex];
        const spotifyId = urlParts[typeIndex + 1].split("?")[0];

        let title = "Spotify Content";
        let thumbnail: string | undefined;

        if (contentType === "track") {
          const track = await spotify.tracks.get(spotifyId);
          title = `${track.name} - ${track.artists
            .map((a) => a.name)
            .join(", ")}`;
          thumbnail = track.album.images[0]?.url;
        } else if (contentType === "playlist") {
          const playlist = await spotify.playlists.getPlaylist(spotifyId);
          title = playlist.name;
          thumbnail = playlist.images[0]?.url;
        } else if (contentType === "album") {
          const album = await spotify.albums.get(spotifyId);
          title = `${album.name} - ${album.artists
            .map((a) => a.name)
            .join(", ")}`;
          thumbnail = album.images[0]?.url;
        }

        return { title, thumbnail };
      } catch (error) {
        console.error("Failed to fetch Spotify metadata:", error);
        // Fallback to URL parsing
        try {
          const urlParts = url.split("/");
          const typeIndex = urlParts.findIndex(
            (part) =>
              part === "track" || part === "playlist" || part === "album"
          );
          if (typeIndex !== -1 && urlParts[typeIndex + 1]) {
            const contentType = urlParts[typeIndex];
            return {
              title: `Spotify ${
                contentType.charAt(0).toUpperCase() + contentType.slice(1)
              }`,
              thumbnail: undefined,
            };
          }
        } catch (parseError) {
          console.error("Failed to parse Spotify URL:", parseError);
        }
      }
      return { title: "Spotify Content" };
    } else if (type === "appleMusic") {
      try {
        const parts = url.split("/");
        const namePart = parts[parts.length - 1]?.split("?")[0];
        if (namePart) {
          const title = namePart
            .split("-")
            .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
            .join(" ");
          return { title: title || "Apple Music" };
        }
      } catch (error) {
        console.error("Failed to parse Apple Music title:", error);
      }
      return { title: "Apple Music Content" };
    } else if (type === "soundCloud") {
      try {
        const response = await fetch(
          `https://soundcloud.com/oembed?url=${encodeURIComponent(
            url
          )}&format=json`
        );
        if (response.ok) {
          const data = await response.json();
          return {
            title: data.title || "SoundCloud Track",
            thumbnail: data.thumbnail_url,
          };
        }
      } catch (error) {
        console.error("Failed to fetch SoundCloud metadata:", error);
      }
      return { title: "SoundCloud Content" };
    }
    return { title: "Music Content" };
  };

  const saveToHistory = (
    url: string,
    type: "youtube" | "spotify" | "appleMusic" | "soundCloud",
    embedUrl: string,
    title?: string,
    thumbnail?: string
  ) => {
    const newLink: LinkData = {
      url,
      type,
      embedUrl,
      timestamp: Date.now(),
      title,
      thumbnail,
    };

    setLinkHistory((prevHistory) => {
      // Remove duplicate if exists
      const filtered = prevHistory.filter((item) => item.url !== url);
      // Add new link at the beginning
      const updated = [newLink, ...filtered].slice(0, MAX_HISTORY_ITEMS);

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));

      return updated;
    });
  };

  const saveCurrentLink = (linkData: LinkData) => {
    localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(linkData));
  };

  const handleSetIframe = async () => {
    if (tempPreviewData.type && tempPreviewData.embedUrl) {
      // Fetch metadata
      const metadata = await fetchLinkMetadata(inputUrl, tempPreviewData.type);

      const linkData: LinkData = {
        url: inputUrl,
        type: tempPreviewData.type,
        embedUrl: tempPreviewData.embedUrl,
        timestamp: Date.now(),
        title: metadata.title,
        thumbnail: metadata.thumbnail,
      };

      setPreviewData(tempPreviewData);
      saveCurrentLink(linkData);
      saveToHistory(
        inputUrl,
        tempPreviewData.type,
        tempPreviewData.embedUrl,
        metadata.title,
        metadata.thumbnail
      );
      setIsEditing(false);
      setInputUrl("");
      setTempPreviewData({ type: null, embedUrl: "" });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setInputUrl("");
    setTempPreviewData({ type: null, embedUrl: "" });
    setShowRecent(false);
  };

  const handleChangeClick = () => {
    setIsEditing(true);
    setShowRecent(false);
  };

  const handleRecentClick = () => {
    setShowRecent(!showRecent);
    setIsEditing(false);
  };

  const handleSelectRecent = (link: LinkData) => {
    setPreviewData({
      type: link.type,
      embedUrl: link.embedUrl,
    });
    saveCurrentLink(link);
    saveToHistory(
      link.url,
      link.type,
      link.embedUrl,
      link.title,
      link.thumbnail
    );
    setShowRecent(false);
  };

  const handleDeleteLink = (e: React.MouseEvent, index: number) => {
    e.stopPropagation(); // Prevent triggering handleSelectRecent

    setLinkHistory((prevHistory) => {
      const updated = prevHistory.filter((_, i) => i !== index);
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <Popover
      opened={isPopoverOpen}
      onClose={() => setIsPopoverOpen(!isPopoverOpen)}
      trigger={
        <ResponsiveButton title="Add music" ariaLabel="Add music">
          <IconMusic size={20} />
        </ResponsiveButton>
      }
      position="bottom-left"
      className="w-80 md:w-120 max-h-[70vh]"
    >
      <div className="flex items-center justify-between px-lg py-md">
        <h3 className="text-secondary capitalize">
          {previewData.type === "appleMusic"
            ? "Apple Music"
            : previewData.type === "soundCloud"
            ? "SoundCloud"
            : previewData.type || "Music Player"}
        </h3>

        {isEditing ? (
          <div className="flex items-center gap-sm flex-1 ml-md">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="URL from YT, Spotify, Apple, SC"
              className="flex-1 px-md py-xs rounded-md bg-secondary text-primary outline-none transition-all duration-base text-xs"
              autoFocus
            />
            <button
              onClick={handleSetIframe}
              disabled={!tempPreviewData.type}
              className="p-xs rounded-md text-secondary hover:bg-secondary hover:text-primary transition-all duration-base disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="Set iframe"
            >
              <IconCheck size={18} />
            </button>
            <button
              onClick={handleCancelEdit}
              className="p-xs rounded-md text-secondary hover:bg-secondary hover:text-primary transition-all duration-base cursor-pointer"
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

      <div className="p-lg max-h-[calc(70vh-30px)] overflow-y-auto scrollbar-hidden">
        {showRecent ? (
          <div className="space-y-sm">
            {linkHistory.length > 0 ? (
              linkHistory.map((link, index) => (
                <div key={index} className="relative group">
                  <button
                    onClick={() => handleSelectRecent(link)}
                    className="w-full text-left p-sm rounded-md hover:bg-secondary/10 transition-all duration-base flex items-center gap-md"
                  >
                    {/* Thumbnail */}
                    <div className="flex-shrink-0 w-20 h-11 rounded-md overflow-hidden bg-secondary/50 flex items-center justify-center">
                      {link.thumbnail ? (
                        <img
                          src={link.thumbnail}
                          alt={link.title || link.type}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <IconMusic
                          size={24}
                          className="text-secondary opacity-50"
                        />
                      )}
                    </div>

                    {/* Title and Platform */}
                    <div className="flex-1 min-w-0">
                      <div className="text-secondary/90 text-sm font-medium truncate">
                        {link.title || link.url}
                      </div>
                      <div className="flex items-center gap-xs mt-xs">
                        {link.type === "youtube" ? (
                          <IconBrandYoutube
                            size={20}
                            className="text-red-500"
                          />
                        ) : link.type === "spotify" ? (
                          <IconBrandSpotify
                            size={20}
                            className="text-green-500"
                          />
                        ) : link.type === "appleMusic" ? (
                          <IconBrandApple size={20} className="text-white" />
                        ) : link.type === "soundCloud" ? (
                          <IconBrandSoundcloud
                            size={20}
                            className="text-orange-500"
                          />
                        ) : (
                          <IconMusic size={20} className="text-secondary" />
                        )}
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => handleDeleteLink(e, index)}
                      className="flex-shrink-0 p-xs rounded-md text-secondary/50 hover:text-red-500 hover:bg-red-500/10 transition-all duration-base opacity-0 group-hover:opacity-100"
                      title="Delete"
                    >
                      <IconTrash size={16} />
                    </button>
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center text-secondary opacity-50 py-xl">
                No recent links
              </div>
            )}
          </div>
        ) : previewData.type && previewData.embedUrl ? (
          <div className="overflow-hidden rounded-lg">
            <iframe
              src={previewData.embedUrl}
              width="100%"
              height={
                previewData.type === "youtube"
                  ? "252"
                  : previewData.type === "appleMusic"
                  ? "200"
                  : previewData.type === "soundCloud"
                  ? "166"
                  : "360"
              }
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full"
              title={`${
                previewData.type === "youtube" ? "YouTube" : "Spotify"
              } player`}
            />
          </div>
        ) : (
          <div className="text-center text-secondary opacity-50 py-xl">
            Click "Change" to add YouTube, Spotify, Apple or SoundCloud
          </div>
        )}
      </div>
    </Popover>
  );
}

export default IframePopover;
