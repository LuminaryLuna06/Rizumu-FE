import { useState } from "react";
import Modal from "../Modal";
import ResponsiveButton from "../ResponsiveButton";

interface BackgroundModalProps {
  opened: boolean;
  onClose: () => void;
}
function BackgroundModal({ opened, onClose }: BackgroundModalProps) {
  const [activeTab, setActiveTab] = useState<"Motion" | "Still">("Motion");
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
                console.log("Test click vid");
              }}
              className="rounded-xl"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-center cursor-pointer">
            <img
              src="/image/fuji.webp"
              alt="fuji"
              onClick={() => {
                console.log("Fuji");
              }}
              className="rounded-xl"
            />
          </div>
          <div className="flex items-center justify-center cursor-pointer">
            <img
              src="/image/snow-forest-2k.webp"
              alt="snow forest"
              onClick={() => {
                console.log("Snow forest");
              }}
              className="rounded-xl"
            />
          </div>
        </div>
      )}
    </Modal>
  );
}

export default BackgroundModal;
