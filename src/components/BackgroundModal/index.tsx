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
];

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
      className="overflow-y-auto overflow-x-hidden custom-scrollbar scrollbar-hidden"
    >
      <div className="flex w-full mb-xl">
        <ResponsiveButton
          className={`flex justify-center w-1/2 border-b-1 rounded-none bg-transparent hover:bg-transparent font-semibold text-base ${
            activeTab === "Motion"
              ? "text-text-active border-b-2 border-text-active"
              : "text-text-inactive hover:text-text-active transition-all duration-300"
          }`}
          onClick={() => setActiveTab("Motion")}
        >
          Motion
        </ResponsiveButton>
        <ResponsiveButton
          className={`flex justify-center w-1/2 border-b-1 rounded-none bg-transparent hover:bg-transparent font-semibold text-base ${
            activeTab === "Still"
              ? "text-text-active border-b-2 border-text-active"
              : "text-text-inactive hover:text-text-active transition-all duration-300"
          }`}
          onClick={() => setActiveTab("Still")}
        >
          Stills
        </ResponsiveButton>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {activeTab === "Motion"
          ? MOTION_VIDEOS.map((src, index) => (
              <div
                key={index}
                className="flex items-center justify-center cursor-pointer overflow-hidden rounded-xl hover:ring-2 hover:ring-primary transition-all"
              >
                <video
                  src={src}
                  muted
                  playsInline
                  loop
                  autoPlay
                  onClick={() =>
                    changeBackGround({ name: src, type: "animated" })
                  }
                  className="w-full aspect-video object-cover"
                />
              </div>
            ))
          : STATIC_IMAGES.map((img, index) => (
              <div
                key={index}
                className="flex items-center justify-center cursor-pointer overflow-hidden rounded-xl hover:ring-2 hover:ring-primary transition-all"
              >
                <img
                  src={img.name}
                  alt={img.alt}
                  onClick={() =>
                    changeBackGround({ name: img.name, type: "static" })
                  }
                  className="w-full aspect-video object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
      </div>
    </Modal>
  );
}

export default BackgroundModal;
