import Modal from "@rizumu/components/Modal";
import { useAuth } from "@rizumu/context/AuthContext";
import { useToast } from "@rizumu/utils/toast/toast";
import {
  IconLogin,
  IconUserPlus,
  IconUser,
  IconLock,
} from "@tabler/icons-react";
import { useState } from "react";

interface AuthModalProps {
  opened: boolean;
  onClose: () => void;
  defaultMode?: "login" | "register";
}

const AuthModal: React.FC<AuthModalProps> = ({
  opened,
  onClose,
  defaultMode = "login",
}) => {
  const { login, register } = useAuth();
  const toast = useToast();
  const [mode, setMode] = useState<"login" | "register">(defaultMode);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when switching modes
  const switchMode = (newMode: "login" | "register") => {
    setMode(newMode);
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.warning("Please fill in all fields!", "Warning");
      return;
    }

    if (mode === "register") {
      if (!confirmPassword.trim()) {
        toast.warning("Please confirm your password!", "Warning");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match!", "Error");
        return;
      }

      if (password.length < 6) {
        toast.warning("Password must be at least 6 characters!", "Warning");
        return;
      }
    }

    setIsLoading(true);
    try {
      if (mode === "login") {
        await login(username, password);
        toast.success("Login successful!", "Success");
      } else {
        await register(username, password);
        toast.success("Registration successful!", "Success");
      }
      onClose();
      setUsername("");
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        `${mode === "login" ? "Login" : "Registration"} failed!`;
      toast.error(
        message,
        mode === "login" ? "Login Failed" : "Registration Failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={mode === "login" ? "Login" : "Create Account"}
    >
      <form onSubmit={handleSubmit} autoComplete="off" className="space-y-lg">
        {/* Username Field */}
        <div className="flex flex-col gap-sm">
          <label htmlFor="auth-username" className="text-sm font-medium">
            Username
          </label>
          <div className="relative">
            <div className="absolute left-md top-1/2 -translate-y-1/2 text-text-inactive">
              <IconUser size={20} />
            </div>
            <input
              id="auth-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoComplete="off"
              className="w-full pl-[48px] pr-lg py-md bg-primary-light text-secondary rounded-xl border border-gray-800 focus:border-secondary focus:outline-none transition-colors"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-sm">
          <label htmlFor="auth-password" className="text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <div className="absolute left-md top-1/2 -translate-y-1/2 text-text-inactive">
              <IconLock size={20} />
            </div>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={
                mode === "register"
                  ? "Enter password (minimum 6 characters)"
                  : "Enter password"
              }
              autoComplete="new-password"
              className="w-full pl-[48px] pr-lg py-md bg-primary-light text-secondary rounded-xl border border-gray-800 focus:border-secondary focus:outline-none transition-colors"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Confirm Password Field - Only for Register */}
        {mode === "register" && (
          <div className="flex flex-col gap-sm">
            <label
              htmlFor="auth-confirm-password"
              className="text-sm font-medium"
            >
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute left-md top-1/2 -translate-y-1/2 text-text-inactive">
                <IconLock size={20} />
              </div>
              <input
                id="auth-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                autoComplete="new-password"
                className="w-full pl-[48px] pr-lg py-md bg-primary-light text-secondary rounded-xl border border-gray-800 focus:border-secondary focus:outline-none transition-colors"
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-sm bg-secondary text-primary py-md px-lg rounded-xl border border-gray-800 hover:bg-secondary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mode === "login" ? (
            <IconLogin size={20} />
          ) : (
            <IconUserPlus size={20} />
          )}
          {isLoading
            ? mode === "login"
              ? "Logging in..."
              : "Registering..."
            : mode === "login"
            ? "Login"
            : "Register"}
        </button>

        {/* Toggle Mode */}
        <div className="text-center pt-sm border-t border-gray-800">
          <p className="text-sm text-text-inactive">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() =>
                switchMode(mode === "login" ? "register" : "login")
              }
              className="text-secondary hover:underline transition-colors font-medium"
              disabled={isLoading}
            >
              {mode === "login" ? "Create one" : "Login"}
            </button>
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default AuthModal;
