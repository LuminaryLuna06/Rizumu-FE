import { useEffect } from "react";
import { useAuth } from "@rizumu/context/AuthContext";
import AuthModal from "../AuthModal";
import { IconSparkles, IconLogin } from "@tabler/icons-react";

const AuthPrompt = () => {
  const {
    isAuthenticated,
    isLoading,
    authModalOpened,
    openAuthModal,
    closeAuthModal,
  } = useAuth();

  useEffect(() => {
    // Open auth modal on initial page load if not authenticated
    if (!isLoading && !isAuthenticated) {
      openAuthModal();
    }
  }, [isAuthenticated, isLoading]);

  return (
    <>
      {/* Floating prompt bar when unauthenticated and modal is closed */}
      {!isAuthenticated && !authModalOpened && !isLoading && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-sticky animate-fadeIn pointer-events-auto">
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#121316]/80 backdrop-blur-xl border border-white/20 text-white shadow-2xl shadow-black/80">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-white/90">
              <IconSparkles size={16} className="text-amber-300 animate-pulse shrink-0" />
              <span>Sign in to unlock study rooms & sync stats</span>
            </div>
            <button
              onClick={openAuthModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 active:scale-95 transition-all shadow-md shrink-0 cursor-pointer"
            >
              <IconLogin size={14} />
              Sign In
            </button>
          </div>
        </div>
      )}

      <AuthModal
        opened={authModalOpened}
        onClose={closeAuthModal}
        defaultMode="login"
      />
    </>
  );
};

export default AuthPrompt;
