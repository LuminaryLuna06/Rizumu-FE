import Modal from "@rizumu/components/Modal";
import ResponsiveButton from "@rizumu/components/ResponsiveButton";
import SelectInput from "@rizumu/components/FormComponent/SelectInput";
import TextArea from "@rizumu/components/FormComponent/TextArea";
import TextInput from "@rizumu/components/FormComponent/TextInput";
import type { ModelUserProfile } from "@rizumu/models/userProfile";
import { useToast } from "@rizumu/utils/toast/toast";
import { IconCamera, IconUser, IconX } from "@tabler/icons-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { countries } from "../../../constants/countries";
import { useAuth } from "@rizumu/context/AuthContext";
import { useUploadAvatar, useUpdateProfile } from "@rizumu/tanstack/api/hooks";

interface EditProfileModalProps {
  opened: boolean;
  onClose: () => void;
  user: ModelUserProfile;
  onOpenProfile: () => void;
}
function EditProfileModal({
  opened,
  onClose,
  user,
  onOpenProfile,
}: EditProfileModalProps) {
  const toast = useToast();
  const { refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", bio: "", country: "" });

  const updateAvatar = useUploadAvatar();
  const updateProfile = useUpdateProfile();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        bio: user.bio,
        country: user.country,
      });
    }
  }, [user]);

  // Check if form data changed
  const hasChanges = useMemo(() => {
    if (!user) return false;
    if (selectedFile) return true;

    const nameChanged = formData.name !== user.name;
    const bioChanged = formData.bio !== user.bio;
    const countryChanged = formData.country !== user.country;

    return nameChanged || bioChanged || countryChanged;
  }, [user, formData, selectedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async (e: any) => {
    e.preventDefault();

    try {
      if (selectedFile) {
        await updateAvatar.mutateAsync(selectedFile);
      }
      await updateProfile.mutateAsync(formData);

      toast.success("Update profile successful!", "Success");
      refreshUser();
      onOpenProfile();
      setPreviewUrl(null);
    } catch (e: any) {
      toast.error("Update profile failed!", "Error");
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Edit Profile"
      more={
        <ResponsiveButton
          className="bg-white/10 hover:bg-white/20 h-11 md:h-5 gap-x-xs text-sm"
          onClick={() => {
            onOpenProfile();
          }}
          leftSection={<IconUser size={16} />}
        >
          View Profile
        </ResponsiveButton>
      }
      className="w-[900px] overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      <form className="space-y-lg">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-4xl font-bold shadow-2xl relative">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Avatar preview"
                className="w-24 h-24 rounded-full"
              />
            ) : user?.avatar ? (
              <img
                src={user.avatar}
                alt="User avatar"
                className="w-24 h-24 rounded-full"
              />
            ) : (
              <p>U</p>
            )}
            <div
              onClick={handleCameraClick}
              className="flex items-center justify-center rounded-full bg-blue-500 text-xl h-8 w-8 absolute bottom-0 right-0 cursor-pointer"
            >
              <IconCamera />
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
        <TextInput
          label="Name"
          leftSection={<IconUser />}
          placeholder="Enter name"
          value={formData.name}
          onChange={(e: any) =>
            setFormData({ ...formData, name: e.target.value })
          }
          disabled={updateAvatar.isPending || updateProfile.isPending}
        />

        <TextArea
          label="Bio"
          placeholder="Enter bio"
          rows={4}
          autosize={true}
          value={formData.bio}
          onChange={(e: any) =>
            setFormData({ ...formData, bio: e.target.value })
          }
          disabled={updateAvatar.isPending || updateProfile.isPending}
        />

        <div className="flex items-center gap-1">
          <SelectInput
            label="Country"
            data={countries.map((c) => ({ value: c.code, label: c.name }))}
            placeholder="Select country"
            value={formData.country}
            onChange={(value) =>
              setFormData({ ...formData, country: value || "" })
            }
            disabled={updateAvatar.isPending || updateProfile.isPending}
            searchable
            maxDropdownHeight={180}
            className="w-1/2 sm:w-1/3"
          />
          {formData.country && (
            <ResponsiveButton
              leftSection={<IconX size={20} />}
              className="bg-transparent hover:bg-transparent text-text-inactive hover:text-text-active mt-6"
              onClick={(e) => {
                e.preventDefault();
                setFormData({ ...formData, country: "" });
              }}
            ></ResponsiveButton>
          )}
        </div>

        <div className="flex flex-col gap-sm"></div>
        <hr />
        <div className="flex gap-sm">
          <ResponsiveButton
            onClick={() => {
              onOpenProfile();
              setPreviewUrl(null);
            }}
            className="flex-1 flex justify-center px-6 py-3 border border-white rounded-lg font-semibold"
            disabled={updateAvatar.isPending || updateProfile.isPending}
          >
            Cancel
          </ResponsiveButton>
          <ResponsiveButton
            onClick={handleSave}
            className="flex-1 flex justify-center px-6 py-3 bg-secondary hover:bg-secondary !text-primary rounded-lg font-semibold"
            disabled={
              updateAvatar.isPending || updateProfile.isPending || !hasChanges
            }
          >
            {updateAvatar.isPending || updateProfile.isPending
              ? "Saving..."
              : "Save"}
          </ResponsiveButton>
        </div>
      </form>
    </Modal>
  );
}

export default EditProfileModal;
