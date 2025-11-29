import Modal from "@rizumu/components/Modal";
import { useAuth } from "@rizumu/context/AuthContext";
import { useToast } from "@rizumu/utils/toast/toast";
import { IconLogin, IconUser, IconLock } from "@tabler/icons-react";
import { useState } from "react";

interface LoginModalProps {
  opened: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ opened, onClose }) => {
  const { login } = useAuth();
  const toast = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.warning("Please fill in all fields!", "Warning");
      return;
    }

    setIsLoading(true);
    try {
      await login(username, password);
      toast.success("Login successful!");
      onClose();
      setUsername("");
      setPassword("");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Login failed!",
        "Login Failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Login">
      <form onSubmit={handleSubmit} autoComplete="off" className="space-y-lg">
        {/* Username Field */}
        <div className="flex flex-col gap-sm">
          <label htmlFor="login-username" className="text-sm font-medium">
            Username
          </label>
          <div className="relative">
            <div className="absolute left-md top-1/2 -translate-y-1/2 text-text-inactive">
              <IconUser size={20} />
            </div>
            <input
              id="login-username"
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
          <label htmlFor="login-password" className="text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <div className="absolute left-md top-1/2 -translate-y-1/2 text-text-inactive">
              <IconLock size={20} />
            </div>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="new-password"
              className="w-full pl-[48px] pr-lg py-md bg-primary-light text-secondary rounded-xl border border-gray-800 focus:border-secondary focus:outline-none transition-colors"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-sm bg-secondary text-primary py-md px-lg rounded-xl border border-gray-800 hover:bg-secondary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IconLogin size={20} />
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </Modal>
  );
};

export default LoginModal;
