import axiosClient from "@rizumu/api/config/axiosClient";
import Modal from "@rizumu/components/Modal";
import { IconCopy } from "@tabler/icons-react";
import { useState } from "react";

interface EditProfileModalProps {
  opened: boolean;
  onClose: () => void;
}
function EditProfileModal({ opened, onClose }: EditProfileModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return;
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
      className="w-[900px]"
    >
      <form className="space-y-lg p-4">
        <div>
          <input type="file" onChange={handleFileChange} />
          <button onClick={uploadFile} disabled={!selectedFile}>
            Upload
          </button>
        </div>
        <div className="flex flex-col gap-sm">
          <label htmlFor="" className="text-sm font-medium">
            Name
          </label>
          <input
            type="text"
            placeholder="Enter username"
            autoComplete="off"
            className="w-full pl-[48px] pr-lg py-md bg-primary-light text-secondary rounded-xl border border-gray-800 focus:border-secondary focus:outline-none transition-colors"
          />
        </div>

        <div className="flex flex-col gap-sm">
          <label htmlFor="" className="text-sm font-medium">
            Bio
          </label>
          <textarea
            placeholder="Enter username"
            autoComplete="off"
            className="w-full pl-[48px] pr-lg py-md bg-primary-light text-secondary rounded-xl border border-gray-800 focus:border-secondary focus:outline-none transition-colors"
            rows={4}
            style={{ resize: "none" }}
          ></textarea>
        </div>

        <div className="flex flex-col gap-sm">
          <div className="text-sm font-medium">
            <p>Crew code</p>
          </div>
          <div className="flex items-center text-md">
            <p className="mr-sm">5Dg90zTpjGt6QrBODVUW4E</p>
            <IconCopy size={18} className="cursor-pointer" />
          </div>
        </div>
        <hr />
        <div className="flex gap-sm">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-white rounded-lg font-medium cursor-pointer hover:bg-primary-hover"
          >
            Cancel
          </button>
          <button className="flex-1 px-6 py-3 bg-secondary text-primary rounded-lg font-medium cursor-pointer hover:bg-secondary-hover">
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default EditProfileModal;
