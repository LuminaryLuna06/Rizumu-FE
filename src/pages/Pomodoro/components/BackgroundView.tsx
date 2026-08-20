import React, { useEffect, useRef } from "react";

export interface BackgroundData {
  name: string;
  type: string; // "static" | "animated"
}

interface BackgroundViewProps {
  background: BackgroundData;
}

export const BackgroundView: React.FC<BackgroundViewProps> = ({ background }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Power & Battery saver: Auto-pause video when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!videoRef.current || background.type !== "animated") return;

      if (document.hidden) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [background.type]);

  return (
    <div className="fixed inset-0 w-screen h-[100dvh] -z-10 overflow-hidden pointer-events-none bg-black">
      {background.type === "static" ? (
        <div
          key={background.name}
          className="absolute inset-0 w-full h-full bg-cover bg-center animate-fadeIn"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${background.name})`,
            transform: "translateZ(0)",
            willChange: "opacity",
          }}
        />
      ) : (
        <video
          key={background.name}
          ref={videoRef}
          src={background.name}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover animate-fadeIn"
          style={{
            transform: "translateZ(0)",
            willChange: "opacity",
          }}
        />
      )}
    </div>
  );
};

export default BackgroundView;
