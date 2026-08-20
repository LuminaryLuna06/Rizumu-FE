import { useState } from "react";
import Modal from "../Modal";
import ResponsiveButton from "../ResponsiveButton";
import { useAuth } from "@rizumu/context/AuthContext";
import { useUpdateRoomBackground } from "@rizumu/tanstack/api/hooks";
import { useToast } from "@rizumu/utils/toast/toast";

const STATIC_IMAGES = [
  { name: "/image/aurora-2k.webp", alt: "Aurora" },
  { name: "/image/autumn-road-2k.webp", alt: "Autumn road" },
  { name: "/image/autumn-leaves-2k.webp", alt: "Autumn leaves" },
  { name: "/image/city-2k.webp", alt: "City" },
  { name: "/image/forest-2k.webp", alt: "Forest" },
  { name: "/image/fuji.webp", alt: "Fuji" },
  { name: "/image/lego-2k.webp", alt: "Lego" },
  { name: "/image/light-2k.webp", alt: "Light" },
  { name: "/image/shop-2k.webp", alt: "Shop" },
  { name: "/image/snow-forest-2k.webp", alt: "Snow forest" },
  { name: "/image/star-2k.webp", alt: "Star" },
  { name: "/image/sunset-city-2k.webp", alt: "Sunset city" },
  { name: "/image/wolf-moon-2k.webp", alt: "Wolf moon" },
];

const MOTION_VIDEOS = [
  "/video/Vid_BG_1.mp4",
  "/video/Goose.mp4",
  "/video/cozy-room.mp4",
  "/video/lazy-cat.mp4",
  "/video/sunset.mp4",
  "/video/Chisa.mp4",
];

interface MotionVideoCardProps {
  src: string;
  onSelect: () => void;
}

const MotionVideoCard: React.FC<MotionVideoCardProps> = ({ src, onSelect }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div
      onClick={onSelect}
      onMouseEnter={(e) => {
        const video = e.currentTarget.querySelector("video");
        if (video) {
          video.play().catch(() => {});
          setIsPlaying(true);
        }
      }}
      onMouseLeave={(e) => {
        const video = e.currentTarget.querySelector("video");
        if (video) {
          video.pause();
          video.currentTime = 0;
          setIsPlaying(false);
        }
      }}
      className="group relative flex items-center justify-center cursor-pointer overflow-hidden rounded-2xl border border-white/10 hover:border-white/40 hover:shadow-xl hover:shadow-black/50 transition-all active:scale-[0.98] bg-black/40"
    >
      <video
        src={src}
        muted
        playsInline
        loop
        preload="metadata"
        className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-transparent transition-colors pointer-events-none">
          <div className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/80 group-hover:opacity-0 transition-opacity">
            <svg className="w-4 h-4 translate-x-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

interface BackgroundModalProps {
  opened: boolean;
  onClose: () => void;
  onChange: (bg: { name: string; type: string }) => void;
}

function BackgroundModal({ opened, onClose, onChange }: BackgroundModalProps) {
  const { user } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<"Motion" | "Still">("Motion");
  const updateBackground = useUpdateRoomBackground();

  const changeBackGround = async ({
    name,
    type,
  }: {
    name: string;
    type: string;
  }) => {
    const formData = {
      name: name,
      type: type,
    };
    onChange(formData);
    updateBackground.mutate(
      {
        roomId: user?.current_room_id || "",
        background: formData,
      },
      {
        onSuccess: () => {
          toast.success("Changed room background", "Success");
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || "Failed to change background",
            "Error"
          );
        },
      }
    );
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Set your focus screen"
      className="background-modal"
    >
      {/* Sticky Tabs */}
      <div className="sticky top-0 z-10 bg-modal-overlay/95 backdrop-blur-md flex w-full pb-3 mb-4 pt-1 border-b border-white/10">
        <ResponsiveButton
          className={`flex justify-center w-1/2 border-b-2 rounded-none bg-transparent hover:bg-transparent font-semibold text-sm sm:text-base transition-all ${
            activeTab === "Motion"
              ? "text-white border-white"
              : "text-white/50 border-transparent hover:text-white"
          }`}
          onClick={() => setActiveTab("Motion")}
        >
          Motion Videos
        </ResponsiveButton>
        <ResponsiveButton
          className={`flex justify-center w-1/2 border-b-2 rounded-none bg-transparent hover:bg-transparent font-semibold text-sm sm:text-base transition-all ${
            activeTab === "Still"
              ? "text-white border-white"
              : "text-white/50 border-transparent hover:text-white"
          }`}
          onClick={() => setActiveTab("Still")}
        >
          Still Images
        </ResponsiveButton>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pb-2">
        {activeTab === "Motion"
          ? MOTION_VIDEOS.map((src, index) => (
              <MotionVideoCard
                key={index}
                src={src}
                onSelect={() =>
                  changeBackGround({ name: src, type: "animated" })
                }
              />
            ))
          : STATIC_IMAGES.map((img, index) => (
              <div
                key={index}
                onClick={() =>
                  changeBackGround({ name: img.name, type: "static" })
                }
                className="group flex items-center justify-center cursor-pointer overflow-hidden rounded-2xl border border-white/10 hover:border-white/40 hover:shadow-xl hover:shadow-black/50 transition-all active:scale-[0.98] bg-black/40"
              >
                <img
                  src={img.name}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
      </div>
    </Modal>
  );
}

export default BackgroundModal;
