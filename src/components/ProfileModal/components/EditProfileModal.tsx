import Modal from "@rizumu/components/Modal";
import { IconCopy } from "@tabler/icons-react";

interface EditProfileModalProps {
  opened: boolean;
  onClose: () => void;
}
function EditProfileModal({ opened, onClose }: EditProfileModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Edit Profile"
      className="w-[900px]"
    >
      <form className="space-y-lg p-4">
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
