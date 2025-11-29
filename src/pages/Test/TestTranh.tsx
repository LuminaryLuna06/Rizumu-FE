import LoginModal from "@rizumu/components/Auth/LoginModal";
import SigninModal from "@rizumu/components/Auth/SigninModal";
import ResponsiveButton from "@rizumu/components/ResponsiveButton";
import { useAuth } from "@rizumu/context/AuthContext";
import { useToast } from "@rizumu/utils/toast/toast";
import { useState } from "react";

function TestTranh() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const toast = useToast();
  const [loginOpened, setLoginOpened] = useState(false);
  const [signinOpened, setSigninOpened] = useState(false);

  const handleLogout = () => {
    logout();
    toast.info("Loged out");
  };

  if (isLoading) {
    return <div className="p-xl">Loading...</div>;
  }

  return (
    <div
      className="p-xl"
      style={{
        backgroundImage:
          "url(https://cdn-media.sforum.vn/storage/app/media/ctv_seo3/mau-background-dep-5.jpg)",
        height: "100vh",
      }}
    >
      {isAuthenticated ? (
        <div className="flex flex-col gap-lg">
          <p className="text-xl text-secondary">
            Hello, {user?.name || "User"}!
          </p>
          <ResponsiveButton onClick={handleLogout}>Logout</ResponsiveButton>
        </div>
      ) : (
        <div className="flex gap-lg">
          <ResponsiveButton onClick={() => setSigninOpened(true)}>
            Register
          </ResponsiveButton>
          <ResponsiveButton onClick={() => setLoginOpened(true)}>
            Login
          </ResponsiveButton>
        </div>
      )}

      {/* Modals */}
      <LoginModal opened={loginOpened} onClose={() => setLoginOpened(false)} />
      <SigninModal
        opened={signinOpened}
        onClose={() => setSigninOpened(false)}
      />
    </div>
  );
}

export default TestTranh;
