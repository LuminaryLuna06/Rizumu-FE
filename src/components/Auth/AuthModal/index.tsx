import Modal from "@rizumu/components/Modal";
import TextInput from "@rizumu/components/FormComponent/TextInput";
import { useAuth } from "@rizumu/context/AuthContext";
import { useToast } from "@rizumu/utils/toast/toast";
import {
  IconLogin,
  IconUserPlus,
  IconLock,
  IconMail,
} from "@tabler/icons-react";
import { useState } from "react";
import { string, object } from "@rizumu/utils/validate";
import { useDriverTour } from "@rizumu/hooks/useDriverTour";

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
  const { startTimerTour } = useDriverTour();
  const [mode, setMode] = useState<"login" | "register">(defaultMode);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loginSchema = object().shape({
    username: string("Email").required().email(),
    password: string("Password")
      .required()
      .min(6, "Password must be at least 6 characters"),
  });

  const registerSchema = object().shape({
    username: string("Username")
      .required()
      .min(3, "Username must be at least 3 characters"),
    password: string("Password")
      .required()
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: string("Confirm Password").required(),
  });
  const handleReset = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };
  const handleErrorReset = () => {
    setUsernameError("");
    setPasswordError("");
    setConfirmPasswordError("");
  };
  const switchMode = (newMode: "login" | "register") => {
    setMode(newMode);
    // handleReset();
    handleErrorReset();
  };

  const handleValidate = (): boolean => {
    handleErrorReset();
    const schema = mode === "login" ? loginSchema : registerSchema;
    const formData = {
      username,
      password,
      ...(mode === "register" && { confirmPassword }),
    };

    const { isValid, errors } = schema.validate(formData);

    if (!isValid) {
      if (errors.username) setUsernameError(errors.username);
      if (errors.password) setPasswordError(errors.password);
      if (errors.confirmPassword)
        setConfirmPasswordError(errors.confirmPassword);

      toast.warning("Please fix the errors!", "Validation Error");
      return false;
    }
    if (mode === "register" && password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match!");
      toast.error("Passwords do not match!", "Error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!handleValidate()) {
      return;
    }
    setIsLoading(true);
    try {
      if (mode === "login") {
        await login(username, password);
        toast.success("Login successful!", "Success");
      } else {
        await register(username, password);
        toast.success("Registration successful!", "Success");
        setTimeout(() => {
          startTimerTour();
        }, 1000);
      }
      onClose();
      handleReset();
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
          label="Email"
          placeholder="Enter email"
          leftSection={<IconMail size={20} />}
          onChange={(e) => {
            setUsername(e.target.value);
            if (usernameError) setUsernameError("");
          }}
          disabled={isLoading}
          error={usernameError}
        />
        <TextInput
          required
          label="Password"
          placeholder="Enter password"
          leftSection={<IconLock size={20} />}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordError) setPasswordError("");
          }}
          disabled={isLoading}
          type="password"
          error={passwordError}
        />

        {mode === "register" && (
          <TextInput
            required
            label="Confirm Password"
            placeholder="Confirm password"
            leftSection={<IconLock size={20} />}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (confirmPasswordError) setConfirmPasswordError("");
            }}
            disabled={isLoading}
            type="password"
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
