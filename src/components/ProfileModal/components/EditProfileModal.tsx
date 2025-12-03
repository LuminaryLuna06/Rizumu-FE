import axiosClient from "@rizumu/api/config/axiosClient";
import Modal from "@rizumu/components/Modal";
import TextInput from "@rizumu/components/TextInput";
import type { ModelUserProfile } from "@rizumu/models/userProfile";
import { IconCamera, IconNote, IconUser } from "@tabler/icons-react";
import { useRef, useState } from "react";

interface EditProfileModalProps {
  opened: boolean;
  onClose: () => void;
  user: ModelUserProfile;
}
function EditProfileModal({ opened, onClose, user }: EditProfileModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  console.log("Edit: ", user);

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

  const uploadFile = async (e: any) => {
    e.preventDefault();

    if (!selectedFile) return;
    console.log(selectedFile);
    let form_data = new FormData();
    form_data.append("avatar", selectedFile);

    try {
      const response = await axiosClient.post("/auth/avatar", form_data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
    } catch (e: any) {
      console.error(e.message);
    }
  };

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
              onChange={uploadFile}
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
          // value={user?.name || ""}
        />

        <TextInput
          label="Bio"
          leftSection={<IconNote />}
          placeholder="Enter bio"
        />

        <div className="flex flex-col gap-sm"></div>
        <hr />
        <div className="flex gap-sm">
          <button
            onClick={() => {
              onClose();
              setPreviewUrl(null);
            }}
            className="flex-1 px-6 py-3 border border-white rounded-lg font-medium cursor-pointer hover:bg-primary-hover"
          >
            Cancel
          </button>
          <button
            onClick={uploadFile}
            className="flex-1 px-6 py-3 bg-secondary text-primary rounded-lg font-medium cursor-pointer hover:bg-secondary-hover"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default EditProfileModal;
