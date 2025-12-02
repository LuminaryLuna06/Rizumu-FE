import Modal from "@rizumu/components/Modal";
import TextInput from "@rizumu/components/TextInput";
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
  const toast = useToast();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">(defaultMode);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [usernameError, setUsernameError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

  const switchMode = (newMode: "login" | "register") => {
    setMode(newMode);
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setUsernameError("");
    setPasswordError("");
    setConfirmPasswordError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    if (!username.trim()) {
      setUsernameError("Username is required");
      hasError = true;
    }
    if (!password.trim()) {
      setPasswordError("Password is required");
      hasError = true;
    }
    if (hasError) {
      toast.warning("Please fill in all fields!", "Warning");
      return;
    }

    if (mode === "register") {
      if (!confirmPassword.trim()) {
        setConfirmPasswordError("Confirm is required");
        toast.warning("Please confirm your password!", "Warning");
        return;
      }

      if (password !== confirmPassword) {
        setConfirmPasswordError("Passwords do not match!");
        toast.error("Passwords do not match!", "Error");
        return;
      }

      if (password.length < 6) {
        setPasswordError("Password must be at least 6 characters!");
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
        <TextInput
          required
          size="md"
          label="Username"
          placeholder="Enter username"
          leftSection={<IconUser size={20} />}
          onChange={(e) => {
            setUsername(e.target.value);
            if (usernameError) setUsernameError("");
          }}
          disabled={isLoading}
          autoComplete="false"
          error={usernameError}
        />
        <TextInput
          required
          size="md"
          label="Password"
          placeholder="Enter password"
          leftSection={<IconLock size={20} />}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordError) setPasswordError("");
          }}
          disabled={isLoading}
          type="password"
          autoComplete="false"
          error={passwordError}
        />

        {mode === "register" && (
          <TextInput
            required
            size="md"
            label="Confirm Password"
            placeholder="Confirm password"
            leftSection={<IconLock size={20} />}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (confirmPasswordError) setConfirmPasswordError("");
            }}
            disabled={isLoading}
            type="password"
            autoComplete="false"
            error={confirmPasswordError}
          />
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-sm bg-secondary text-primary py-md px-lg rounded-md border border-gray-800 hover:bg-secondary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              {mode === "login" ? "Create one" : "Login now"}
            </button>
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default AuthModal;
