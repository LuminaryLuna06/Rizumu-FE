import Modal from "@rizumu/components/Modal";
import TextInput from "@rizumu/components/FormComponent/TextInput";
import { useAuth } from "@rizumu/context/AuthContext";
import { useToast } from "@rizumu/utils/toast/toast";
import {
  IconLogin,
  IconUserPlus,
  IconLock,
  IconLockCheck,
  IconMail,
  IconEye,
  IconEyeOff,
  IconLoader2,
  IconMusicCode,
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
  const { login, register, loginWithGoogle } = useAuth();
  const { startTimerTour } = useDriverTour();
  const [mode, setMode] = useState<"login" | "register">(defaultMode);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [usernameError, setUsernameError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loginSchema = object().shape({
    username: string("Email / Username")
      .required()
      .min(3, "Username / Email must be at least 3 characters"),
    password: string("Password")
      .required()
      .min(6, "Password must be at least 6 characters"),
  });

  const registerSchema = object().shape({
    username: string("Email / Username")
      .required()
      .min(3, "Username / Email must be at least 3 characters"),
    password: string("Password")
      .required()
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: string("Confirm Password").required(),
  });

  const handleReset = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    handleErrorReset();
  };

  const handleErrorReset = () => {
    setUsernameError("");
    setPasswordError("");
    setConfirmPasswordError("");
  };

  const switchMode = (newMode: "login" | "register") => {
    setMode(newMode);
    handleErrorReset();
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Signed in with Google successfully!", "Success");
      onClose();
      handleReset();
    } catch (error: any) {
      console.error("Google sign in error:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Google sign in failed. Please check your Firebase configuration or try again.";
      toast.error(message, "Google Sign In");
    } finally {
      setIsLoading(false);
    }
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

      toast.warning("Please check the fields and try again.", "Validation Error");
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
        await login(username.trim(), password);
        toast.success("Welcome back to Rizumu!", "Success");
      } else {
        await register(username.trim(), password);
        toast.success("Account created successfully!", "Success");
        setTimeout(() => {
          startTimerTour();
        }, 1000);
      }
      onClose();
      handleReset();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        `${mode === "login" ? "Login" : "Registration"} failed. Please check your credentials.`;
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
      hideHeader={true}
      className="!max-w-[460px] !p-6 sm:!p-8 !bg-[#101114]/90 !backdrop-blur-2xl !border-white/10 !rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-white/10 blur-3xl pointer-events-none rounded-full" />

      {/* Header Branding */}
      <div className="flex flex-col items-center text-center mb-6 relative">
        <div className="w-13 h-13 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-center mb-3 shadow-inner text-white">
          <IconMusicCode size={28} />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          {mode === "login" ? "Welcome to Rizumu" : "Join Rizumu"}
        </h2>
        <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-[320px]">
          {mode === "login"
            ? "Sign in to sync your focus sessions, tasks & rooms"
            : "Create your free account and start your deep focus flow"}
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-2 p-1 bg-white/5 border border-white/10 rounded-2xl mb-4">
        <button
          type="button"
          onClick={() => switchMode("login")}
          disabled={isLoading}
          className={`flex items-center justify-center gap-2 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer ${
            mode === "login"
              ? "bg-white text-black shadow-md font-semibold"
              : "text-white/60 hover:text-white"
          }`}
        >
          <IconLogin size={16} />
          Sign In
        </button>
        <button
          type="button"
          onClick={() => switchMode("register")}
          disabled={isLoading}
          className={`flex items-center justify-center gap-2 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer ${
            mode === "register"
              ? "bg-white text-black shadow-md font-semibold"
              : "text-white/60 hover:text-white"
          }`}
        >
          <IconUserPlus size={16} />
          Create Account
        </button>
      </div>

      {/* Google Sign-In */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full h-11 flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-medium rounded-xl transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm mb-4 text-xs sm:text-sm"
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
          />
          <path
            fill="#4285F4"
            d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
          />
          <path
            fill="#FBBC05"
            d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.5 1.9 7.9l3.7-2.9z"
          />
          <path
            fill="#34A853"
            d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">
          or continue with credentials
        </span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} autoComplete="on" className="space-y-4">
        <TextInput
          required
          label="Email or Username"
          placeholder="Enter email or username"
          leftSection={<IconMail size={18} className="text-white/50" />}
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (usernameError) setUsernameError("");
          }}
          disabled={isLoading}
          error={usernameError}
          autoComplete="username"
        />

        <TextInput
          required
          label="Password"
          placeholder="Enter password"
          leftSection={<IconLock size={18} className="text-white/50" />}
          rightSection={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-white/50 hover:text-white transition-colors cursor-pointer p-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
            </button>
          }
          rightSectionPointerEvents="auto"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordError) setPasswordError("");
          }}
          disabled={isLoading}
          type={showPassword ? "text" : "password"}
          error={passwordError}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
        />

        {mode === "register" && (
          <TextInput
            required
            label="Confirm Password"
            placeholder="Re-enter your password"
            leftSection={<IconLockCheck size={18} className="text-white/50" />}
            rightSection={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-white/50 hover:text-white transition-colors cursor-pointer p-1"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <IconEyeOff size={18} />
                ) : (
                  <IconEye size={18} />
                )}
              </button>
            }
            rightSectionPointerEvents="auto"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (confirmPasswordError) setConfirmPasswordError("");
            }}
            disabled={isLoading}
            type={showConfirmPassword ? "text" : "password"}
            error={confirmPasswordError}
            autoComplete="new-password"
          />
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 h-11 flex items-center justify-center gap-2 bg-white text-black font-semibold rounded-xl hover:bg-white/90 active:scale-[0.99] transition-all shadow-lg shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <IconLoader2 size={18} className="animate-spin text-black" />
              <span>{mode === "login" ? "Signing in..." : "Creating account..."}</span>
            </>
          ) : (
            <>
              {mode === "login" ? <IconLogin size={18} /> : <IconUserPlus size={18} />}
              <span>{mode === "login" ? "Sign In" : "Create Account"}</span>
            </>
          )}
        </button>

        {/* Footer info & switch prompt */}
        <div className="text-center pt-3 border-t border-white/10">
          <p className="text-xs text-white/50">
            {mode === "login"
              ? "Don't have an account yet?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() =>
                switchMode(mode === "login" ? "register" : "login")
              }
              className="text-white font-medium hover:underline transition-colors cursor-pointer ml-1"
              disabled={isLoading}
            >
              {mode === "login" ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default AuthModal;
