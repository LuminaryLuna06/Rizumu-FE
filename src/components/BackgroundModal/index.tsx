import { useState } from "react";
import Modal from "../Modal";
import ResponsiveButton from "../ResponsiveButton";
import axiosClient from "@rizumu/api/config/axiosClient";
import { useAuth } from "@rizumu/context/AuthContext";

interface BackgroundModalProps {
  opened: boolean;
  onClose: () => void;
  onChange: (bg: { name: string; type: string }) => void;
}
function BackgroundModal({ opened, onClose, onChange }: BackgroundModalProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"Motion" | "Still">("Motion");

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
    try {
      await axiosClient.patch(
        `/room/${user?.current_room_id}/background`,
        formData
      );
    } catch (error) {
      console.error(error);
    }
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
              ? "text-text-active"
              : "text-text-inactive hover:text-text-active hover:border-text-inactive transition-all duration-300"
          }`}
          onClick={() => setActiveTab("Motion")}
        >
          Motion
        </ResponsiveButton>
        <ResponsiveButton
          className={`flex justify-center w-1/2 border-b-1 rounded-none bg-transparent hover:bg-transparent font-semibold text-base ${
            activeTab === "Still"
              ? "text-text-active"
              : "text-text-inactive hover:text-text-active hover:border-text-inactive transition-all duration-300"
          }`}
          onClick={() => setActiveTab("Still")}
        >
          Stills
        </ResponsiveButton>
      </div>

      {activeTab === "Motion" ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-center cursor-pointer">
            <video
              src="/video/Vid_BG_1.mp4"
              muted
              playsInline
              loop
              autoPlay
              onClick={() => {
                changeBackGround({
                  name: "/video/Vid_BG_1.mp4",
                  type: "animated",
                });
              }}
              className="rounded-xl"
            />
          </div>
          <div className="flex items-center justify-center cursor-pointer">
            <video
              src="/video/Goose.mp4"
              muted
              playsInline
              loop
              autoPlay
              onClick={() => {
                changeBackGround({
                  name: "/video/Goose.mp4",
                  type: "animated",
                });
              }}
              className="rounded-xl"
            />
          </div>
          <div className="flex items-center justify-center cursor-pointer">
            <video
              src="/video/cozy-room.mp4"
              muted
              playsInline
              loop
              autoPlay
              onClick={() => {
                changeBackGround({
                  name: "/video/cozy-room.mp4",
                  type: "animated",
                });
              }}
              className="rounded-xl"
            />
          </div>
          <div className="flex items-center justify-center cursor-pointer">
            <video
              src="/video/lazy-cat.mp4"
              muted
              playsInline
              loop
              autoPlay
              onClick={() => {
                changeBackGround({
                  name: "/video/lazy-cat.mp4",
                  type: "animated",
                });
              }}
              className="rounded-xl"
            />
          </div>
          <div className="flex items-center justify-center cursor-pointer">
            <video
              src="/video/sunset.mp4"
              muted
              playsInline
              loop
              autoPlay
              onClick={() => {
                changeBackGround({
                  name: "/video/sunset.mp4",
                  type: "animated",
                });
              }}
              className="rounded-xl"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-center cursor-pointer">
            <img
              src="/image/aurora-2k.webp"
              alt="aurora"
              onClick={() => {
                changeBackGround({
                  name: "/image/aurora-2k.webp",
                  type: "static",
                });
              }}
              className="rounded-xl h-[250px]"
            />
          </div>
          <div className="flex items-center justify-center cursor-pointer">
            <img
              src="/image/autumn-road-2k.webp"
              alt="Autumm road"
              onClick={() => {
                changeBackGround({
                  name: "/image/autumn-road-2k.webp",
                  type: "static",
                });
              }}
              className="rounded-xl h-[250px]"
            />
          </div>
          <div className="flex items-center justify-center cursor-pointer">
            <img
              src="/image/autumn-leaves-2k.webp"
              alt="Autumm leave"
              onClick={() => {
                changeBackGround({
                  name: "/image/autumn-leaves-2k.webp",
                  type: "static",
                });
              }}
              className="rounded-xl h-[250px]"
            />
          </div>
          <div className="flex items-center justify-center cursor-pointer">
            <img
              src="/image/city-2k.webp"
              alt="City"
              onClick={() => {
                changeBackGround({
                  name: "/image/city-2k.webp",
                  type: "static",
                });
              }}
              className="rounded-xl h-[250px]"
            />
          </div>
          <div className="flex items-center justify-center cursor-pointer">
            <img
              src="/image/forest-2k.webp"
              alt="Forest"
              onClick={() => {
                changeBackGround({
                  name: "/image/forest-2k.webp",
                  type: "static",
                });
              }}
              className="rounded-xl h-[250px]"
            />
          </div>
          <div className="flex items-center justify-center cursor-pointer">
            <img
              src="/image/fuji.webp"
              alt="Fuji"
              onClick={() => {
                changeBackGround({
                  name: "/image/fuji.webp",
                  type: "static",
                });
              }}
              className="rounded-xl h-[250px]"
            />
          </div>
          <div className="flex items-center justify-center cursor-pointer">
            <img
              src="/image/lego-2k.webp"
              alt="Lego"
              onClick={() => {
                changeBackGround({
                  name: "/image/lego-2k.webp",
                  type: "static",
                });
              }}
              className="rounded-xl h-[250px]"
            />
          </div>
          <div className="flex items-center justify-center cursor-pointer">
            <img
              src="/image/light-2k.webp"
              alt="Light"
              onClick={() => {
                changeBackGround({
                  name: "/image/light-2k.webp",
                  type: "static",
                });
              }}
              className="rounded-xl h-[250px]"
            />
          </div>
          <div className="flex items-center justify-center cursor-pointer">
            <img
              src="/image/shop-2k.webp"
              alt="Shop"
              onClick={() => {
                changeBackGround({
                  name: "/image/shop-2k.webp",
                  type: "static",
                });
              }}
              className="rounded-xl h-[250px]"
            />
          </div>
          <div className="flex items-center justify-center cursor-pointer">
            <img
              src="/image/snow-forest-2k.webp"
              alt="Snow forest"
              onClick={() => {
                changeBackGround({
                  name: "/image/snow-forest-2k.webp",
                  type: "static",
                });
              }}
              className="rounded-xl h-[250px]"
            />
          </div>
          <div className="flex items-center justify-center cursor-pointer">
            <img
              src="/image/star-2k.webp"
              alt="Star"
              onClick={() => {
                changeBackGround({
                  name: "/image/star-2k.webp",
                  type: "static",
                });
              }}
              className="rounded-xl h-[250px]"
            />
          </div>
          <div className="flex items-center justify-center cursor-pointer">
            <img
              src="/image/sunset-city-2k.webp"
              alt="Sunset city"
              onClick={() => {
                changeBackGround({
                  name: "/image/sunset-city-2k.webp",
                  type: "static",
                });
              }}
              className="rounded-xl h-[250px]"
            />
          </div>
          <div className="flex items-center justify-center cursor-pointer">
            <img
              src="/image/wolf-moon-2k.webp"
              alt="Wolf moon"
              onClick={() => {
                changeBackGround({
                  name: "/image/wolf-moon-2k.webp",
                  type: "static",
                });
              }}
              className="rounded-xl h-[250px]"
            />
          </div>
        </div>
      )}
    </Modal>
  );
}

export default BackgroundModal;
