import React, { useState } from "react";
import Modal from "../Modal";
import { IconCopy, IconSearch, IconShare } from "@tabler/icons-react";
import TextInput from "../TextInput";

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

function ManageFriendModal() {
  const [opened, setOpened] = useState(false);
  const [activeTab, setActiveTab] = useState<"activity" | "requests">(
    "activity"
  );
  const [friends, setFriends] = useState(DEMO_FRIENDS);

  return (
    <div>
      <button
        onClick={() => setOpened(true)}
        className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
      >
        Open Friends Modal
      </button>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Focus Friends"
        className="!w-[95vw] !h-[85vh] md:!w-[900px] md:!h-[650px] flex flex-col max-w-full"
        more={
          <div className="hidden md:block w-64">
            <TextInput
              placeholder="Email or friends code"
              variant="filled"
              radius="xl"
              size="md"
              className="w-full"
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
              variant="filled"
              radius="xl"
              size="md"
              className="w-full"
              rightSection={<IconSearch size={16} />}
            />
          </div>

          {/* Tab */}
          <div className="flex bg-[#1e1e1e] p-1 rounded-xl mb-4 md:mb-8 border border-gray-800 shrink-0">
            <button
              onClick={() => setActiveTab("activity")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                activeTab === "activity"
                  ? "bg-[#333333] text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Friends activity
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                activeTab === "requests"
                  ? "bg-[#333333] text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Manage requests
            </button>
          </div>

          {/* Main Content */}
          <div className="flex flex-col justify-start text-center min-h-0 flex-1 overflow-y-auto custom-scrollbar pr-1">
            {friends.length > 0 && activeTab === "activity" && (
              <div className="text-left text-xs text-gray-500 font-medium mb-3 uppercase tracking-wider sticky top-0 py-2 z-10 w-full">
                Friends activities ({friends.length})
              </div>
            )}

            {friends.length > 0 ? (
              <div className="flex flex-col gap-2 pb-4">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-start gap-3 p-3 bg-[#25262b] hover:bg-secondary/5 rounded-2xl border border-gray-800/50 transition-colors cursor-pointer group"
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
                  Your friends list is empty!
                </p>
                <p className="text-gray-500 text-sm mb-8 max-w-[80%] mx-auto">
                  Invite friends by email or friends code to focus and grow
                  together!
                </p>

                <div className="flex gap-4 w-full justify-center">
                  <button className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-all text-sm font-medium">
                    <IconCopy size={18} />
                    Copy
                  </button>
                  <button className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-all text-sm font-medium">
                    <IconShare size={18} />
                    Share
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ManageFriendModal;
