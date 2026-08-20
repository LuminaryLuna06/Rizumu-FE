import React, { useState, useEffect, useRef } from "react";

export interface BackgroundData {
  name: string;
  type: string; // "static" | "animated"
}

interface BackgroundViewProps {
  background: BackgroundData;
}

export const BackgroundView: React.FC<BackgroundViewProps> = ({ background }) => {
  const [currentBg, setCurrentBg] = useState<BackgroundData>(background);
  const [incomingBg, setIncomingBg] = useState<BackgroundData | null>(null);
  const [isIncomingReady, setIsIncomingReady] = useState(false);

  const activeVideoRef = useRef<HTMLVideoElement | null>(null);
  const incomingVideoRef = useRef<HTMLVideoElement | null>(null);

  // Power & Battery saver: Auto-pause video when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        activeVideoRef.current?.pause();
        incomingVideoRef.current?.pause();
      } else {
        activeVideoRef.current?.play().catch(() => {});
        if (isIncomingReady) {
          incomingVideoRef.current?.play().catch(() => {});
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isIncomingReady]);

  // Handle incoming background loading and smooth cross-fade transition
  useEffect(() => {
    if (background.name === currentBg.name && background.type === currentBg.type) {
      return;
    }

    setIncomingBg(background);
    setIsIncomingReady(false);

    if (background.type === "static") {
      let isCancelled = false;
      const img = new Image();
      img.onload = () => {
        if (!isCancelled) {
          setIsIncomingReady(true);
        }
      };
      img.onerror = () => {
        if (!isCancelled) {
          setIsIncomingReady(true);
        }
      };
      img.src = background.name;

      return () => {
        isCancelled = true;
        img.onload = null;
        img.onerror = null;
      };
    }
  }, [background, currentBg]);

  // Once incoming is ready and faded in, swap currentBg to incomingBg
  useEffect(() => {
    if (!incomingBg || !isIncomingReady) return;

    const timer = setTimeout(() => {
      setCurrentBg(incomingBg);
      setIncomingBg(null);
      setIsIncomingReady(false);
    }, 600); // match transition duration

    return () => clearTimeout(timer);
  }, [incomingBg, isIncomingReady]);

  return (
    <div className="fixed inset-0 w-screen h-[100dvh] -z-10 overflow-hidden pointer-events-none bg-black">
      {/* Layer 1: Current Background (Always Visible, Never flashes black) */}
      {currentBg.type === "static" ? (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-600 ease-out"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${currentBg.name})`,
            transform: "translateZ(0)",
            willChange: "opacity",
          }}
        />
      ) : (
        <video
          ref={activeVideoRef}
          src={currentBg.name}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-600 ease-out"
          style={{
            transform: "translateZ(0)",
            willChange: "opacity",
          }}
        />
      )}

      {/* Layer 2: Incoming Background (Smooth Cross-fade Overlay) */}
      {incomingBg && (
        <>
          {incomingBg.type === "static" ? (
            <div
              className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-600 ease-out ${
                isIncomingReady ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${incomingBg.name})`,
                transform: "translateZ(0)",
                willChange: "opacity",
              }}
            />
          ) : (
            <video
              ref={incomingVideoRef}
              src={incomingBg.name}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onCanPlay={() => setIsIncomingReady(true)}
              onLoadedData={() => setIsIncomingReady(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-600 ease-out ${
                isIncomingReady ? "opacity-100" : "opacity-0"
              }`}
              style={{
                transform: "translateZ(0)",
                willChange: "opacity",
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default BackgroundView;
