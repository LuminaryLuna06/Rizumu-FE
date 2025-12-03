import axiosClient from "@rizumu/api/config/axiosClient";
import Modal from "@rizumu/components/Modal";
import SelectInput from "@rizumu/components/SelectInput";
import TextArea from "@rizumu/components/TextArea";
import TextInput from "@rizumu/components/TextInput";
// import { useAuth } from "@rizumu/context/AuthContext";
import type { ModelUserProfile } from "@rizumu/models/userProfile";
import { useToast } from "@rizumu/utils/toast/toast";
import { IconCamera, IconUser } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

interface EditProfileModalProps {
  opened: boolean;
  onClose: () => void;
  user: ModelUserProfile;
}
function EditProfileModal({ opened, onClose, user }: EditProfileModalProps) {
  // const { refreshUser } = useAuth();
  const toast = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({ name: "", bio: "", country: "" });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        bio: user.bio,
        country: user.country,
      });
    }
  }, [user]);

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

    setIsLoading(true);
    try {
      if (selectedFile) {
        let form_data = new FormData();
        form_data.append("avatar", selectedFile);
        await axiosClient.post("/auth/avatar", form_data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      await axiosClient.patch(`/auth/profile`, formData);
      toast.success("Update profile successful!");
      // refreshUser();
    } catch (e: any) {
      toast.error("Update profile failed!");
    }

    setIsLoading(false);
  };

  const countryData = [
    { value: "VN", label: "Vietnam" },
    { value: "US", label: "United States" },
    { value: "GB", label: "United Kingdom" },
    { value: "CA", label: "Canada" },
    { value: "AU", label: "Australia" },
    { value: "JP", label: "Japan" },
    { value: "KR", label: "South Korea" },
    { value: "CN", label: "China" },
    { value: "TW", label: "Taiwan" },
    { value: "SG", label: "Singapore" },
    { value: "MY", label: "Malaysia" },
    { value: "TH", label: "Thailand" },
    { value: "ID", label: "Indonesia" },
    { value: "PH", label: "Philippines" },
    { value: "IN", label: "India" },
    { value: "FR", label: "France" },
    { value: "DE", label: "Germany" },
    { value: "IT", label: "Italy" },
    { value: "ES", label: "Spain" },
    { value: "NL", label: "Netherlands" },
    { value: "SE", label: "Sweden" },
    { value: "NO", label: "Norway" },
    { value: "DK", label: "Denmark" },
    { value: "FI", label: "Finland" },
    { value: "BR", label: "Brazil" },
    { value: "MX", label: "Mexico" },
    { value: "AR", label: "Argentina" },
    { value: "CL", label: "Chile" },
    { value: "NZ", label: "New Zealand" },
    { value: "RU", label: "Russia" },
  ];
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Edit Profile"
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
          placeholder="Enter username"
          value={formData.name}
          onChange={(e: any) =>
            setFormData({ ...formData, name: e.target.value })
          }
          disabled={isLoading}
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
          disabled={isLoading}
        />

        {/* <SelectInput
          label="Country"
          data={countryData}
          value={formData.country}
          onChange={(e: any) =>
            setFormData({ ...formData, country: e })
          }
          searchable
          clearable
          disabled={isLoading}
        /> */}
        <div className="flex flex-col gap-sm"></div>
        <hr />
        <div className="flex gap-sm">
          <button
            onClick={() => {
              onClose();
              setPreviewUrl(null);
            }}
            className="flex-1 px-6 py-3 border border-white rounded-lg font-medium cursor-pointer hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-secondary text-primary rounded-lg font-medium cursor-pointer hover:bg-secondary-hover disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default EditProfileModal;
