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
  IconSparkles,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import Popover from "@rizumu/components/Popover";
import ResponsiveButton from "@rizumu/components/ResponsiveButton";

const STORAGE_KEY_CURRENT = "iframe_current_link";
const STORAGE_KEY_HISTORY = "iframe_link_history";
const MAX_HISTORY_ITEMS = 12;

interface LinkData {
  url: string;
  type: "youtube" | "spotify" | "appleMusic" | "soundCloud";
  embedUrl: string;
  timestamp: number;
  title?: string;
  thumbnail?: string;
}

const FEATURED_PRESETS: LinkData[] = [
  {
    url: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
    type: "youtube",
    embedUrl: "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1",
    timestamp: 0,
    title: "Lofi Girl - Relax / Study Beats 🎧",
    thumbnail: "https://img.youtube.com/vi/jfKfPfyJRdk/hqdefault.jpg",
  },
  {
    url: "https://www.youtube.com/watch?v=4xDzrJKXOOY",
    type: "youtube",
    embedUrl: "https://www.youtube.com/embed/4xDzrJKXOOY?autoplay=1",
    timestamp: 0,
    title: "Synthwave / Chill Radio 🌌",
    thumbnail: "https://img.youtube.com/vi/4xDzrJKXOOY/hqdefault.jpg",
  },
  {
    url: "https://www.youtube.com/watch?v=5qap5aO4i9A",
    type: "youtube",
    embedUrl: "https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1",
    timestamp: 0,
    title: "Lofi Hip Hop / Chillhop Cafe ☕",
    thumbnail: "https://img.youtube.com/vi/5qap5aO4i9A/hqdefault.jpg",
  },
  {
    url: "https://open.spotify.com/playlist/37i9dQZF1DX8Uebhn9wzrS",
    type: "spotify",
    embedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS",
    timestamp: 0,
    title: "Spotify - Chill Lofi Study",
  },
  {
    url: "https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO",
    type: "spotify",
    embedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO",
    timestamp: 0,
    title: "Spotify - Peaceful Piano",
  },
  {
    url: "https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ",
    type: "spotify",
    embedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ",
    timestamp: 0,
    title: "Spotify - Deep Focus",
  },
];

/**
 * Parses user input URL and returns embed URL + detected platform type
 */
function parseMediaUrl(url: string): {
  type: LinkData["type"] | null;
  embedUrl: string;
} {
  const trimmed = url.trim();
  if (!trimmed) return { type: null, embedUrl: "" };

  // 1. YouTube (Supports watch?v=, youtu.be, shorts/, live/, embed/, playlist list=)
  if (
    trimmed.includes("youtube.com") ||
    trimmed.includes("youtu.be") ||
    trimmed.includes("youtube-nocookie.com")
  ) {
    let videoId = "";
    let playlistId = "";

    if (trimmed.includes("list=")) {
      playlistId = trimmed.split("list=")[1]?.split("&")[0];
    }

    if (trimmed.includes("youtube.com/watch?v=")) {
      videoId = trimmed.split("v=")[1]?.split("&")[0];
    } else if (trimmed.includes("youtu.be/")) {
      videoId = trimmed.split("youtu.be/")[1]?.split("?")[0];
    } else if (trimmed.includes("youtube.com/shorts/")) {
      videoId = trimmed.split("shorts/")[1]?.split("?")[0];
    } else if (trimmed.includes("youtube.com/live/")) {
      videoId = trimmed.split("live/")[1]?.split("?")[0];
    } else if (trimmed.includes("youtube.com/embed/")) {
      videoId = trimmed.split("embed/")[1]?.split("?")[0];
    }

    if (playlistId && !videoId) {
      return {
        type: "youtube",
        embedUrl: `https://www.youtube.com/embed/videoseries?list=${playlistId}&autoplay=1`,
      };
    } else if (videoId) {
      const extra = playlistId ? `?list=${playlistId}&autoplay=1` : "?autoplay=1";
      return {
        type: "youtube",
        embedUrl: `https://www.youtube.com/embed/${videoId}${extra}`,
      };
    }
  }

  // 2. Spotify (Supports track, playlist, album, artist, episode)
  if (trimmed.includes("spotify.com")) {
    let embedUrl = trimmed;
    if (trimmed.includes("open.spotify.com") && !trimmed.includes("/embed")) {
      embedUrl = trimmed.replace("open.spotify.com", "open.spotify.com/embed");
    }
    return {
      type: "spotify",
      embedUrl,
    };
  }

  // 3. Apple Music
  if (trimmed.includes("music.apple.com")) {
    let embedUrl = trimmed;
    if (!trimmed.includes("embed.music.apple.com")) {
      embedUrl = trimmed.replace("music.apple.com", "embed.music.apple.com");
    }
    return {
      type: "appleMusic",
      embedUrl,
    };
  }

  // 4. SoundCloud
  if (trimmed.includes("soundcloud.com")) {
    const encodedUrl = encodeURIComponent(trimmed);
    return {
      type: "soundCloud",
      embedUrl: `https://w.soundcloud.com/player/?url=${encodedUrl}&color=%23f59e0b&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`,
    };
  }

  return { type: null, embedUrl: "" };
}

function IframePopover() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"player" | "featured" | "recent" | "custom">("player");
  const [inputUrl, setInputUrl] = useState("");
  const [linkHistory, setLinkHistory] = useState<LinkData[]>([]);
  const [currentMedia, setCurrentMedia] = useState<LinkData | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedCurrent = localStorage.getItem(STORAGE_KEY_CURRENT);
      if (savedCurrent) {
        setCurrentMedia(JSON.parse(savedCurrent));
      }
      const savedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (savedHistory) {
        setLinkHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error("Failed to load music player state:", e);
    }
  }, []);

  const parsedInput = useMemo(() => parseMediaUrl(inputUrl), [inputUrl]);

  const handleSelectMedia = useCallback((media: LinkData) => {
    setCurrentMedia(media);
    setActiveTab("player");
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(media));

      setLinkHistory((prev) => {
        const filtered = prev.filter((item) => item.url !== media.url);
        const updated = [media, ...filtered].slice(0, MAX_HISTORY_ITEMS);
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      console.error("Failed to save media link:", e);
    }
  }, []);

  const handleApplyCustomUrl = async () => {
    if (!parsedInput.type || !parsedInput.embedUrl) return;

    let title = "Custom Music Stream";
    let thumbnail: string | undefined;

    // Fast oEmbed / metadata fetch for YouTube & SoundCloud
    if (parsedInput.type === "youtube") {
      try {
        const res = await fetch(
          `https://www.youtube.com/oembed?url=${encodeURIComponent(inputUrl)}&format=json`
        );
        if (res.ok) {
          const data = await res.json();
          title = data.title || "YouTube Video";
          thumbnail = data.thumbnail_url;
        }
      } catch {
        title = "YouTube Stream";
      }
    } else if (parsedInput.type === "spotify") {
      title = "Spotify Music";
    } else if (parsedInput.type === "appleMusic") {
      title = "Apple Music";
    } else if (parsedInput.type === "soundCloud") {
      title = "SoundCloud Track";
    }

    const newMedia: LinkData = {
      url: inputUrl,
      type: parsedInput.type,
      embedUrl: parsedInput.embedUrl,
      timestamp: Date.now(),
      title,
      thumbnail,
    };

    handleSelectMedia(newMedia);
    setInputUrl("");
  };

  const handleDeleteHistory = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setLinkHistory((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearCurrent = () => {
    setCurrentMedia(null);
    localStorage.removeItem(STORAGE_KEY_CURRENT);
    setActiveTab("featured");
  };

  const renderPlatformIcon = (type: LinkData["type"]) => {
    switch (type) {
      case "youtube":
        return <IconBrandYoutube size={18} className="text-red-500 shrink-0" />;
      case "spotify":
        return <IconBrandSpotify size={18} className="text-green-500 shrink-0" />;
      case "appleMusic":
        return <IconBrandApple size={18} className="text-pink-400 shrink-0" />;
      case "soundCloud":
        return <IconBrandSoundcloud size={18} className="text-amber-500 shrink-0" />;
      default:
        return <IconMusic size={18} className="text-white/60 shrink-0" />;
    }
  };

  return (
    <Popover
      opened={isPopoverOpen}
      onClose={() => setIsPopoverOpen((prev) => !prev)}
      trigger={
        <ResponsiveButton
          title="Music & Lofi Player"
          ariaLabel="Music Player"
          className={currentMedia ? "text-yellow-400 border-yellow-400/40" : ""}
        >
          <IconMusic size={20} />
        </ResponsiveButton>
      }
      position="bottom-left"
      className="iframe-popover w-[calc(100vw-2rem)] sm:w-[440px] max-w-[480px] z-50 shadow-2xl"
    >
      <div className="flex flex-col max-h-[80vh] overflow-hidden bg-primary/95 backdrop-blur-2xl border border-white/10 rounded-2xl">
        {/* Navigation Tabs Header */}
        <div className="flex items-center justify-between p-3 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-1">
            {currentMedia && (
              <button
                type="button"
                onClick={() => setActiveTab("player")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "player"
                    ? "bg-white/15 text-white shadow-sm"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                Now Playing
              </button>
            )}
            <button
              type="button"
              onClick={() => setActiveTab("featured")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "featured"
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <IconSparkles size={14} className="text-yellow-400" />
              <span>Featured</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("recent")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "recent"
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <IconClock size={14} />
              <span>Recent ({linkHistory.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("custom")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "custom"
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              + URL
            </button>
          </div>

          {currentMedia && (
            <button
              type="button"
              onClick={handleClearCurrent}
              title="Stop and clear media"
              className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <IconTrash size={16} />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-3 overflow-y-auto custom-scrollbar overscroll-contain">
          {/* TAB 1: NOW PLAYING */}
          {activeTab === "player" && currentMedia && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 min-w-0">
                  {renderPlatformIcon(currentMedia.type)}
                  <span className="text-xs font-medium text-white/80 truncate">
                    {currentMedia.title || currentMedia.url}
                  </span>
                </div>
              </div>

              <div className="relative w-full rounded-xl overflow-hidden bg-black/60 shadow-lg border border-white/10">
                <iframe
                  src={currentMedia.embedUrl}
                  width="100%"
                  height={
                    currentMedia.type === "youtube"
                      ? "240"
                      : currentMedia.type === "spotify"
                      ? "352"
                      : currentMedia.type === "appleMusic"
                      ? "220"
                      : "166"
                  }
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full border-none block"
                  title="Music Stream Player"
                />
              </div>
            </div>
          )}

          {/* TAB 2: FEATURED / QUICK LOFI PRESETS */}
          {(activeTab === "featured" || (!currentMedia && activeTab === "player")) && (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-white/50 px-1 mb-1 font-medium">
                Curated Focus & Lofi Streams (1-Click Play ⚡)
              </p>
              <div className="grid grid-cols-1 gap-2">
                {FEATURED_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectMedia(preset)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left group cursor-pointer ${
                      currentMedia?.url === preset.url
                        ? "bg-yellow-500/10 border-yellow-500/40 text-yellow-400"
                        : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 text-white"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center shrink-0 border border-white/10 overflow-hidden group-hover:scale-105 transition-transform">
                      {preset.thumbnail ? (
                        <img
                          src={preset.thumbnail}
                          alt={preset.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <IconPlayerPlay size={18} className="text-yellow-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate group-hover:text-yellow-400 transition-colors">
                        {preset.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {renderPlatformIcon(preset.type)}
                        <span className="text-[10px] text-white/50 uppercase tracking-wider">
                          {preset.type}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: RECENT HISTORY */}
          {activeTab === "recent" && (
            <div className="flex flex-col gap-2">
              {linkHistory.length > 0 ? (
                linkHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className="group flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                    onClick={() => handleSelectMedia(item)}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                      <div className="w-9 h-9 rounded-lg bg-black/40 flex items-center justify-center shrink-0 border border-white/10 overflow-hidden">
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          renderPlatformIcon(item.type)
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-white truncate group-hover:text-yellow-400 transition-colors">
                          {item.title || item.url}
                        </p>
                        <span className="text-[10px] text-white/40 uppercase">
                          {item.type}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleDeleteHistory(e, idx)}
                      className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Remove from history"
                    >
                      <IconTrash size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-white/40">
                  No playback history yet.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CUSTOM URL INPUT */}
          {activeTab === "custom" && (
            <div className="flex flex-col gap-3 p-1">
              <p className="text-xs text-white/60">
                Paste any link from <b>YouTube (Video/Live/Shorts/List)</b>, <b>Spotify</b>, <b>Apple Music</b>, or <b>SoundCloud</b>:
              </p>

              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1.5 px-3 focus-within:border-yellow-400/60 transition-colors">
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-transparent text-xs text-white placeholder-white/30 outline-none py-1.5"
                  autoFocus
                />
                {inputUrl && (
                  <button
                    type="button"
                    onClick={() => setInputUrl("")}
                    className="text-white/40 hover:text-white p-1"
                  >
                    <IconX size={14} />
                  </button>
                )}
              </div>

              {parsedInput.type && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs">
                  <IconCheck size={16} className="shrink-0" />
                  <span>Detected valid <b>{parsedInput.type}</b> media!</span>
                </div>
              )}

              <button
                type="button"
                disabled={!parsedInput.type}
                onClick={handleApplyCustomUrl}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                  parsedInput.type
                    ? "bg-yellow-400 text-black hover:brightness-110 shadow-lg shadow-yellow-500/20 cursor-pointer"
                    : "bg-white/5 text-white/30 cursor-not-allowed"
                }`}
              >
                <IconPlayerPlay size={16} />
                <span>Play Stream Now</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </Popover>
  );
}

export default IframePopover;
