import Modal from "@rizumu/components/Modal";
import { useAuth } from "@rizumu/context/AuthContext";
import { useToast } from "@rizumu/utils/toast/toast";
import { IconUserPlus, IconUser, IconLock } from "@tabler/icons-react";
import { useState } from "react";

interface SigninModalProps {
  opened: boolean;
  onClose: () => void;
}

const SigninModal: React.FC<SigninModalProps> = ({ opened, onClose }) => {
  const { register } = useAuth();
  const toast = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      toast.warning("Please fill in all fields!", "Warning");
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

    setIsLoading(true);
    try {
      await register(username, password);
      toast.success("Registration successful!");
      onClose();
      setUsername("");
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Registration failed!",
        "Registration Failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Register">
      <form onSubmit={handleSubmit} autoComplete="off" className="space-y-lg">
        {/* Username Field */}
        <div className="flex flex-col gap-sm">
          <label htmlFor="register-username" className="text-sm font-medium">
            Username
          </label>
          <div className="relative">
            <div className="absolute left-md top-1/2 -translate-y-1/2 text-text-inactive">
              <IconUser size={20} />
            </div>
            <input
              id="register-username"
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
          <label htmlFor="register-password" className="text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <div className="absolute left-md top-1/2 -translate-y-1/2 text-text-inactive">
              <IconLock size={20} />
            </div>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password (minimum 6 characters)"
              autoComplete="new-password"
              className="w-full pl-[48px] pr-lg py-md bg-primary-light text-secondary rounded-xl border border-gray-800 focus:border-secondary focus:outline-none transition-colors"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="flex flex-col gap-sm">
          <label
            htmlFor="register-confirm-password"
            className="text-sm font-medium"
          >
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute left-md top-1/2 -translate-y-1/2 text-text-inactive">
              <IconLock size={20} />
            </div>
            <input
              id="register-confirm-password"
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-sm bg-secondary text-primary py-md px-lg rounded-xl border border-gray-800 hover:bg-secondary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IconUserPlus size={20} />
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
    </Modal>
  );
};

export default SigninModal;
