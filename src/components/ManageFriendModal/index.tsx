import { useState } from "react";
import Modal from "../Modal";
import { IconSearch, IconCheck, IconX } from "@tabler/icons-react";
import TextInput from "../FormComponent/TextInput";
import { useToast } from "@rizumu/utils/toast/toast";
import { useAuth } from "@rizumu/context/AuthContext";
import ProfileModal from "../ProfileModal";
import { string } from "@rizumu/utils/validate";
import {
  useFriendRequests,
  useFriends,
  useSearchUsers,
  useAcceptFriendRequest,
  useDeleteFriend,
} from "@rizumu/tanstack/api/hooks";

type ManageFriendModalProps = {
  opened: boolean;
  onClose: () => void;
};

function ManageFriendModal({ opened, onClose }: ManageFriendModalProps) {
  const toast = useToast();
  const acceptRequest = useAcceptFriendRequest();
  const deleteFriend = useDeleteFriend();
  const { user: currentUser } = useAuth();
  const { data: friends, isLoading: friendsLoading } = useFriends(opened);
  const { data: requests, isLoading: requestsLoading } =
    useFriendRequests(opened);

  const [activeTab, setActiveTab] = useState<"activity" | "requests">(
    "activity"
  );
  const [profileModalOpened, setProfileModalOpened] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [emailError, setEmailError] = useState("");

  const emailValidator = string("Email").required().email();
  const isValidEmail =
    !!submittedQuery.trim() && !emailValidator.validate(submittedQuery);

  const { data: searchResults, isLoading: searchLoading } = useSearchUsers(
    submittedQuery,
    isValidEmail
  );

  const handleAcceptRequest = (friendshipId: string) => {
    acceptRequest.mutate(friendshipId, {
      onSuccess: () => {
        toast.success("Friend request accepted!", "Success");
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to accept request",
          "Error"
        );
      },
    });
  };

  const handleCancelRequest = (requestId: string) => {
    deleteFriend.mutate(requestId, {
      onSuccess: () => {
        toast.success("Friend request cancelled!", "Success");
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to cancel request",
          "Error"
        );
      },
    });
  };

  const handleRejectRequest = (requestId: string) => {
    deleteFriend.mutate(requestId, {
      onSuccess: () => {
        toast.success("Friend request rejected!", "Success");
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to reject request",
          "Error"
        );
      },
    });
  };

  const handleFriendClick = (userId: string) => {
    setSelectedUserId(userId);
    setProfileModalOpened(true);
  };

  const handleSearchQueryChange = (value: string) => {
    setSearchQuery(value);
    if (!value.trim()) {
      setEmailError("");
      setSubmittedQuery("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      const validationError = emailValidator.validate(searchQuery);
      if (validationError) {
        setEmailError(validationError);
        return;
      }
      setEmailError("");
      setSubmittedQuery(searchQuery);
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        title="Focus Friends"
        className="friends-modal"
        more={
          <div className="hidden md:block w-64">
            <TextInput
              placeholder="Search by email"
              radius="md"
              className="w-[300px]"
              value={searchQuery}
              onChange={(e) => handleSearchQueryChange(e.currentTarget.value)}
              onKeyDown={handleKeyDown}
              rightSection={<IconSearch size={16} />}
              error={emailError}
            />
          </div>
        }
      >
        {/* Container*/}
        <div className="flex flex-col h-[calc(90vh-90px)] max-h-[600px] overflow-hidden">
          <div className="block md:hidden mb-4 shrink-0 w-full">
            <TextInput
              placeholder="Search by email"
              radius="md"
              className="w-full"
              value={searchQuery}
              onChange={(e) => handleSearchQueryChange(e.currentTarget.value)}
              onKeyDown={handleKeyDown}
              rightSection={<IconSearch size={16} />}
              error={emailError}
            />
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div className="mb-4 shrink-0 max-h-48 overflow-y-auto scroll-smooth scrollbar-hidden">
              {searchLoading ? (
                <div className="text-center py-4 text-secondary">
                  Searching...
                </div>
              ) : searchResults && searchResults.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {searchResults.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => handleFriendClick(user._id)}
                      className="flex items-center gap-3 p-3 bg-secondary/5 hover:bg-secondary/10 rounded-lg border border-secondary/10 cursor-pointer transition-colors"
                    >
                      <div className="relative shrink-0">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border border-gray-700"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-sm font-bold">
                            {user.name?.[0]?.toUpperCase() || "U"}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col text-left flex-1 min-w-0">
                        <span className="text-secondary/90 font-medium text-sm truncate">
                          {user.name || "User"}
                        </span>
                        <span className="text-secondary/40 text-xs truncate">
                          {user.bio}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-secondary">
                  No users found
                </div>
              )}
            </div>
          )}

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
          <div className="flex flex-col justify-start text-center h-[calc(90vh-90px)] max-h-[600px] min-h-0 flex-1 overflow-y-auto scroll-smooth scrollbar-hidden pr-1">
            {activeTab === "activity" ? (
              <>
                {friendsLoading ? (
                  <div className="flex flex-col gap-2 pb-4">
                    {Array.from({ length: 8 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-lg"
                      >
                        <div className="w-10 h-10 rounded-full bg-secondary/20 animate-pulse" />
                        <div className="flex-1">
                          <div className="h-4 bg-secondary/20 rounded animate-pulse w-3/4 mb-2" />
                          <div className="h-3 bg-secondary/20 rounded animate-pulse w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : friends && friends.length > 0 ? (
                  <div className="flex flex-col gap-2 pb-4">
                    <div className="text-left text-xs text-secondary/40 font-medium mb-3 uppercase tracking-wider py-2 w-full">
                      Friends activities ({friends.length})
                    </div>
                    {friends.map((friend) => (
                      <div
                        key={friend._id}
                        onClick={() => handleFriendClick(friend._id)}
                        className="flex items-start gap-3 p-3 bg-secondary/5 hover:bg-secondary/10 rounded-lg border border-secondary/10 transition-colors cursor-pointer group"
                      >
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          {friend.avatar ? (
                            <img
                              src={friend.avatar}
                              alt={friend.name}
                              className="w-10 h-10 rounded-full object-cover border border-secondary/10"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-sm font-bold">
                              {friend.name?.[0]?.toUpperCase() || "U"}
                            </div>
                          )}
                          {friend.status === "online" && (
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#1e1e1e] rounded-full"></span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex flex-col text-left flex-1 min-w-0">
                          <span className="text-secondary/90 font-medium text-sm group-hover:text-white truncate">
                            {friend.name}
                          </span>
                          <span className="text-secondary/40 text-xs truncate">
                            Friend
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-8 h-full">
                    <p className="text-secondary/80 text-lg font-medium mb-2">
                      No friends yet!
                    </p>
                    <p className="text-secondary/40 text-sm mb-8 max-w-[80%] mx-auto">
                      Invite friends to focus and grow together!
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                {requestsLoading ? (
                  <div className="flex flex-col gap-2 pb-4">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-lg"
                      >
                        <div className="w-10 h-10 rounded-full bg-secondary/20 animate-pulse" />
                        <div className="flex-1">
                          <div className="h-4 bg-secondary/20 rounded animate-pulse w-3/4 mb-2" />
                          <div className="h-3 bg-secondary/20 rounded animate-pulse w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : requests && requests.length > 0 ? (
                  <div className="flex flex-col gap-2 pb-4">
                    <div className="text-left text-xs text-secondary/40 font-medium mb-3 uppercase tracking-wider py-2 w-full">
                      Friend requests ({requests.length})
                    </div>
                    {requests.map((request) => {
                      // Check if current user is the requester (sent request) or receiver (received request)
                      const isSentByMe =
                        request.requester._id === currentUser?._id;
                      const otherUser = isSentByMe
                        ? request.receiver
                        : request.requester;

                      return (
                        <div
                          key={request._id}
                          className="flex items-center gap-3 p-3 bg-secondary/5 rounded-lg border border-secondary/10"
                        >
                          {/* Avatar */}
                          <div className="relative shrink-0">
                            {otherUser.avatar ? (
                              <img
                                src={otherUser.avatar}
                                alt={otherUser.name}
                                className="w-10 h-10 rounded-full object-cover border border-secondary/10"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-sm font-bold">
                                {otherUser.name?.[0]?.toUpperCase() || "U"}
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex flex-col text-left flex-1 min-w-0">
                            <span className="text-secondary/90 font-medium text-sm truncate">
                              {otherUser.name}
                            </span>
                            <span className="text-secondary/40 text-xs truncate">
                              {isSentByMe
                                ? "Request sent"
                                : "Wants to be friends"}
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 shrink-0">
                            {isSentByMe ? (
                              // Show Cancel button if current user sent the request
                              <button
                                onClick={() => handleCancelRequest(request._id)}
                                className="p-2 bg-secondary/10 hover:bg-secondary/5 text-secondary/60 rounded-md transition-colors"
                                title="Cancel Request"
                              >
                                <IconX size={18} />
                              </button>
                            ) : (
                              // Show Accept/Reject buttons if current user received the request
                              <>
                                <button
                                  onClick={() =>
                                    handleAcceptRequest(request._id)
                                  }
                                  className="p-2 bg-secondary/90 hover:bg-secondary text-primary rounded-md transition-colors"
                                  title="Accept"
                                >
                                  <IconCheck size={18} />
                                </button>
                                <button
                                  onClick={() =>
                                    handleRejectRequest(request._id)
                                  }
                                  className="p-2 bg-secondary/10 hover:bg-secondary/5 text-secondary/60 rounded-md transition-colors"
                                  title="Reject"
                                >
                                  <IconX size={18} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-8 h-full">
                    <p className="text-secondary/80 text-lg font-medium mb-2">
                      No pending requests!
                    </p>
                    <p className="text-secondary/40 text-sm mb-8 max-w-[80%] mx-auto">
                      Your friend request list is empty.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Modal>

      <ProfileModal
        opened={profileModalOpened}
        onClose={() => setProfileModalOpened(false)}
        onOpenProfile={() => {}}
        userId={selectedUserId || undefined}
      />
    </>
  );
}

export default ManageFriendModal;
