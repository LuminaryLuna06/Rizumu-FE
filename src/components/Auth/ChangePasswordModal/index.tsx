import Modal from "@rizumu/components/Modal";
import TextInput from "@rizumu/components/FormComponent/TextInput";
import { useAuth } from "@rizumu/context/AuthContext";
import { useToast } from "@rizumu/utils/toast/toast";
import {
  IconLock,
  IconLockCheck,
  IconKey,
  IconEye,
  IconEyeOff,
  IconLoader2,
} from "@tabler/icons-react";
import { useState } from "react";
import { string, object } from "@rizumu/utils/validate";

interface ChangePasswordModalProps {
  opened: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  opened,
  onClose,
}) => {
  const toast = useToast();
  const { changePassword } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const schema = object().shape({
    oldPassword: string("Current Password").required(),
    newPassword: string("New Password")
      .required()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: string("Confirm New Password").required(),
  });

  const handleReset = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowOldPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setOldPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleValidate = (): boolean => {
    setOldPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");

    const { isValid, errors } = schema.validate({
      oldPassword,
      newPassword,
      confirmPassword,
    });

    if (!isValid) {
      if (errors.oldPassword) setOldPasswordError(errors.oldPassword);
      if (errors.newPassword) setNewPasswordError(errors.newPassword);
      if (errors.confirmPassword)
        setConfirmPasswordError(errors.confirmPassword);
      return false;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("New passwords do not match!");
      return false;
    }

    if (oldPassword === newPassword) {
      setNewPasswordError("New password must be different from current password");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!handleValidate()) return;

    setIsLoading(true);
    try {
      await changePassword(oldPassword, newPassword);
      toast.success("Password changed successfully!", "Success");
      handleClose();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to change password. Please check your current password.";
      toast.error(message, "Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Change Password"
      more={<IconKey size={22} className="text-secondary ml-1" />}
      className="!max-w-[460px] !bg-[#101114]/95 !backdrop-blur-2xl !border-white/10 !rounded-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <TextInput
          required
          label="Current Password"
          placeholder="Enter current password"
          leftSection={<IconLock size={18} className="text-white/50" />}
          rightSection={
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="text-white/50 hover:text-white transition-colors cursor-pointer p-1"
              aria-label={showOldPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showOldPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
            </button>
          }
          rightSectionPointerEvents="auto"
          value={oldPassword}
          onChange={(e) => {
            setOldPassword(e.target.value);
            if (oldPasswordError) setOldPasswordError("");
          }}
          disabled={isLoading}
          type={showOldPassword ? "text" : "password"}
          error={oldPasswordError}
          autoComplete="current-password"
        />

        <TextInput
          required
          label="New Password"
          placeholder="Enter new password (min. 6 characters)"
          leftSection={<IconLock size={18} className="text-white/50" />}
          rightSection={
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="text-white/50 hover:text-white transition-colors cursor-pointer p-1"
              aria-label={showNewPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showNewPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
            </button>
          }
          rightSectionPointerEvents="auto"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            if (newPasswordError) setNewPasswordError("");
          }}
          disabled={isLoading}
          type={showNewPassword ? "text" : "password"}
          error={newPasswordError}
          autoComplete="new-password"
        />

        <TextInput
          required
          label="Confirm New Password"
          placeholder="Re-enter new password"
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

        <div className="flex gap-3 pt-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 h-11 border border-white/20 text-white font-medium rounded-xl hover:bg-white/10 active:scale-[0.99] transition-all cursor-pointer text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 h-11 flex items-center justify-center gap-2 bg-white text-black font-semibold rounded-xl hover:bg-white/90 active:scale-[0.99] transition-all shadow-md shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
          >
            {isLoading ? (
              <>
                <IconLoader2 size={18} className="animate-spin text-black" />
                <span>Updating...</span>
              </>
            ) : (
              "Save Password"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ChangePasswordModal;
