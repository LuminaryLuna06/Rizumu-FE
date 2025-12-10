import { useState, useEffect } from "react";
import { useAuth } from "@rizumu/context/AuthContext";
import AuthModal from "../AuthModal";

const AuthPrompt = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [showOverlay, setShowOverlay] = useState(false);
  const [authModalOpened, setAuthModalOpened] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowOverlay(true);
    } else {
      setShowOverlay(false);
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    const handleOpenAuthModal = () => {
      setAuthModalOpened(true);
      setShowOverlay(true);
    };

    window.addEventListener("open-auth-modal", handleOpenAuthModal);
    return () =>
      window.removeEventListener("open-auth-modal", handleOpenAuthModal);
  }, []);

  const handleOverlayClick = () => {
    setAuthModalOpened(true);
  };

  const handleModalClose = () => {
    // Only close modal if user is authenticated
    if (isAuthenticated) {
      setAuthModalOpened(false);
      setShowOverlay(false);
    } else {
      // If not authenticated, keep modal open
      setAuthModalOpened(true);
    }
  };

  if (!showOverlay) return null;

  return (
    <>
      {!authModalOpened && (
        <div
          className="fixed inset-0 z-40 bg-black/10 backdrop-blur-xs animate-fadeIn cursor-pointer group"
          onClick={handleOverlayClick}
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center space-y-md animate-slideUp">
              <h2 className="text-4xl font-bold text-secondary drop-shadow-lg group-hover:scale-105 transition-transform">
                Welcome to Rizumu! 🎵
              </h2>
              <p className="text-lg text-secondary/80 drop-shadow">
                Click anywhere to sign in or create an account
              </p>
              <p className="text-sm text-secondary/60">
                (Login required to continue)
              </p>
            </div>
          </div>
        </div>
      )}

      <AuthModal
        opened={authModalOpened}
        onClose={handleModalClose}
        defaultMode="login"
      />
    </>
  );
};

export default AuthPrompt;
