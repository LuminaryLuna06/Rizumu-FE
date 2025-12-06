import React, { useState } from "react";
import Modal from "../Modal";
import { IconCopy, IconSearch, IconShare } from "@tabler/icons-react";
import TextInput from "../TextInput";
import ResponsiveButton from "../ResponsiveButton";

type ManageFriendModalProps = {
  opened: boolean;
  onClose: () => void;
};

const DEMO_FRIENDS = [
  {
    id: 1,
    name: "Tôi",
    status: "Online",
    avatar:
      "https://ui-avatars.com/api/?name=Wazzup&background=orange&color=fff",
  },
  {
    id: 2,
    name: "Muốn",
    status: "Online",
    avatar:
      "https://ui-avatars.com/api/?name=Minh+An&background=0D8ABC&color=fff",
  },
  {
    id: 3,
    name: "Ôn Toeic",
    status: "Online",
    avatar:
      "https://ui-avatars.com/api/?name=Sarah+Chen&background=6d28d9&color=fff",
  },
];

function ManageFriendModal({ opened, onClose }: ManageFriendModalProps) {
  const [activeTab, setActiveTab] = useState<"activity" | "requests">(
    "activity"
  );
  const [friends, setFriends] = useState(DEMO_FRIENDS);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Focus Friends"
      more={
        <div className="hidden md:block w-64">
          <TextInput
            placeholder="Email or friends code"
            radius="xl"
            className="w-[300px]"
            rightSection={<IconSearch size={16} />}
          />
        </div>
      }
    >
      {/* Container*/}
      <div className="flex flex-col h-full overflow-hidden">
        <div className="block md:hidden mb-4 shrink-0 w-full">
          <TextInput
            placeholder="Email or friends code"
            radius="xl"
            className="w-full"
            rightSection={<IconSearch size={16} />}
          />
        </div>

        {/* Tab */}
        <div className="flex gap-1 bg-secondary/5 p-1 rounded-md mb-4 md:mb-8 text-white">
          <button
            onClick={() => setActiveTab("activity")}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer ${
              activeTab === "activity"
                ? "bg-secondary/10"
                : "text-secondary/50 hover:text-secondary/80 hover:bg-secondary/5"
            }`}
          >
            Friends activity
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer ${
              activeTab === "requests"
                ? "bg-secondary/10"
                : "text-secondary/50 hover:text-secondary/80 hover:bg-secondary/5"
            }`}
          >
            Manage requests
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-col justify-start text-center min-h-0 flex-1 overflow-y-auto custom-scrollbar pr-1">
          {friends.length > 0 && activeTab === "activity" ? (
            <div className="flex flex-col gap-2 pb-4">
              <div className="text-left text-xs text-secondary/40 font-medium mb-3 uppercase tracking-wider sticky top-0 py-2 z-10 w-full">
                Friends activities ({friends.length})
              </div>
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-start gap-3 p-3 bg-secondary/5 hover:bg-secondary/10 rounded-lg border border-gray-800/50 transition-colors cursor-pointer group"
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-700"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#1e1e1e] rounded-full"></span>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col text-left flex-1 min-w-0">
                    <span className="text-gray-200 font-medium text-sm group-hover:text-white truncate">
                      {friend.name}
                    </span>
                    <span className="text-gray-500 text-xs truncate">
                      {friend.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-8 h-full">
              <p className="text-gray-300 text-lg font-medium mb-2">
                Your request list is empty!
              </p>
              <p className="text-gray-500 text-sm mb-8 max-w-[80%] mx-auto">
                Invite friends by email or friends code to focus and grow
                together!
              </p>

              <div className="flex gap-4 w-full justify-center">
                <ResponsiveButton
                  leftSection={<IconCopy size={18} />}
                  className="border border-secondary/40 hover:bg-secondary/10 transition-all !px-xl font-medium"
                >
                  Copy
                </ResponsiveButton>
                <ResponsiveButton
                  leftSection={<IconShare size={18} />}
                  className="border border-secondary/40 hover:bg-secondary/10 transition-all !px-xl font-medium"
                >
                  Share
                </ResponsiveButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default ManageFriendModal;
