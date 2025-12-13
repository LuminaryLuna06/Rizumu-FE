import axiosClient from "@rizumu/api/config/axiosClient";
import Popover from "@rizumu/components/Popover";
import ResponsiveButton from "@rizumu/components/ResponsiveButton";
import Switch from "@rizumu/components/Switch";
import TextInput from "@rizumu/components/TextInput";
import { useAuth } from "@rizumu/context/AuthContext";
import type { ModelRoom } from "@rizumu/models/room";
import { useToast } from "@rizumu/utils/toast/toast";
import {
  IconHome,
  IconShare2,
  IconUsers,
  IconUpload,
  IconX,
  IconUser,
  IconDoorExit,
} from "@tabler/icons-react";
import React, { useEffect, useState } from "react";

function RoomPopover() {
  const toast = useToast();
  const { user, isLoading, refreshUser } = useAuth();
  const [room, setRoom] = useState<ModelRoom>();
  const [roomOpened, setRoomOpened] = useState(false);
  const [roomLoading, setRoomLoading] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    chat_during_pomodoro: false,
    locked: false,
    is_public: false,
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setRoomLoading(true);
      const response = await axiosClient.patch(`/room/${room?._id}`, formData);
      toast.success("Room updated!", "Success");
      setRoom(response.data.room as ModelRoom);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Update error!", "Error");
    } finally {
      setRoomLoading(false);
    }
  };

  const getRoom = async () => {
    if (user && !isLoading) {
      try {
        setRoomLoading(true);
        const response = await axiosClient.get(
          `/room/id/${user?.current_room_id}`
        );
        setRoom(response.data as ModelRoom);
      } catch (e: any) {
        toast.error(e.message || "", "Error");
      } finally {
        setRoomLoading(false);
      }
    }
  };
  const fetchMembers = async () => {
    if (roomOpened && user?.current_room_id) {
      try {
        setMembersLoading(true);
        const response = await axiosClient.get(
          `/room/${user.current_room_id}/members`
        );
        setMembers(response.data || []);
        console.log("Room members:", response.data);
      } catch (e: any) {
        console.error("Failed to fetch members:", e);
        toast.error(
          e?.response?.data?.message || "Failed to fetch members",
          "Error"
        );
      } finally {
        setMembersLoading(false);
      }
    }
  };

  useEffect(() => {
    getRoom();
    fetchMembers();
  }, [user]);

  useEffect(() => {
    if (room) {
      setFormData({
        name: room.name,
        description: room.description,
        slug: room.slug,
        chat_during_pomodoro: room.chat_during_pomodoro,
        locked: room.locked,
        is_public: room.is_public,
      });
    }
  }, [room]);

  useEffect(() => {
    fetchMembers();
  }, [roomOpened, user?.current_room_id]);

  if (!user) {
    return null;
  }

  const isLoadingRoom = roomLoading || (!room && !isLoading);

  const isOwner = room?.owner_id === user?._id;

  const handleLeaveRoom = async () => {
    try {
      await axiosClient.post(`/room/${room?._id}/leave`);
      toast.success("Left room successfully!", "Success");
      // getRoom(); // Refresh room data
      await refreshUser();
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message || "Failed to leave room",
        "Error"
      );
    }
  };

  const handleShareRoom = async () => {
    try {
      const link = `${window.location.origin}/pomodoro?rid=${room?.slug}`;
      await navigator.clipboard.writeText(link);
      toast.success("Room link copied to clipboard!", "Success");
    } catch (e: any) {
      toast.error("Failed to copy link", "Error");
    }
  };

  return (
    <Popover
      trigger={
        <ResponsiveButton
          className="md:py-sm md:max-w-[150px] max-w-[120px]"
          disabled={isLoadingRoom || !room}
        >
          <p className="truncate">
            {isLoadingRoom ? "Loading..." : room?.name || "Room"}
          </p>
        </ResponsiveButton>
      }
      opened={roomOpened && !!room}
      onClose={() => setRoomOpened(!roomOpened)}
      position="top-right"
    >
      <div className="p-lg space-y-md">
        <div className="flex justify-between text-secondary items-center overflow-hidden">
          <div className="flex items-center gap-x-xs">
            {isOwner && showMembers ? (
              <>
                <IconUsers size={20} />
                <p>Active members</p>
              </>
            ) : (
              <>
                <IconHome size={20} />
                <p>{room?.name || `${user?.name || "User"}'s Room`}</p>
                {!isOwner && (
                  <IconDoorExit
                    size={20}
                    className="cursor-pointer hover:scale-110 transition-all text-red-500 hover:text-red-400"
                    onClick={handleLeaveRoom}
                  />
                )}
              </>
            )}
          </div>
          <div className="flex items-center gap-x-xs">
            {isOwner && !showMembers && (
              <ResponsiveButton
                className="bg-secondary/10 hover:bg-secondary/20 gap-x-xs text-sm md:p-xs rounded-sm"
                leftSection={<IconShare2 size={16} />}
                onClick={handleShareRoom}
              >
                Share
              </ResponsiveButton>
            )}
            {!isOwner && (
              <ResponsiveButton
                className="bg-secondary/10 hover:bg-secondary/20 gap-x-xs text-sm md:p-xs rounded-sm"
                leftSection={<IconShare2 size={16} />}
                onClick={handleShareRoom}
              >
                Share
              </ResponsiveButton>
            )}
            {isOwner && (
              <>
                {showMembers ? (
                  <IconX
                    size={20}
                    className="cursor-pointer hover:scale-110 transition-all"
                    onClick={() => setShowMembers(false)}
                  />
                ) : (
                  <IconUsers
                    size={20}
                    className="cursor-pointer hover:scale-110 transition-all"
                    onClick={() => setShowMembers(true)}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {showMembers ? (
          <>
            <div className="space-y-sm max-h-[400px] overflow-y-auto">
              {membersLoading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-x-sm p-sm rounded-lg"
                  >
                    <div className="w-10 h-10 rounded-full bg-secondary/20 animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-secondary/20 rounded animate-pulse w-3/4"></div>
                    </div>
                  </div>
                ))
              ) : members.length === 0 ? (
                <p className="text-secondary/60 text-center py-lg">
                  No members found
                </p>
              ) : (
                members.map((member: any, index: number) => (
                  <div
                    key={member._id || index}
                    className="flex items-center gap-x-sm p-sm hover:bg-secondary/5 rounded-lg transition-all  cursor-pointer"
                    onClick={() => null}
                  >
                    <div className="w-10 h-10 rounded-full bg-secondary text-primary flex items-center justify-center font-bold">
                      {member.avatar ? (
                        <img
                          src={`${member.avatar}`}
                          alt="Avatar"
                          className="w-11 border border-white rounded-full"
                        />
                      ) : (
                        <div className="flex justify-center items-center rounded-full border-1 p-sm border-secondary bg-primary-light hover:bg-primary-hover">
                          <IconUser className="text-secondary" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-secondary font-medium">
                        {member.name || "User"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : isOwner ? (
          <form className="space-y-md">
            <TextInput
              label="Name"
              placeholder="Room's name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
              }}
              disabled={roomLoading}
            />
            <TextInput
              label="About"
              placeholder="Describe your study room"
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
              }}
              disabled={roomLoading}
            />
            <TextInput
              label="Invitation code"
              description="Must be 4-16 characters long and unique."
              placeholder="Room's invite code"
              value={formData.slug}
              onChange={(e) => {
                setFormData({ ...formData, slug: e.target.value });
              }}
              disabled={roomLoading}
            />
            <Switch
              label="Enable chat during Pomodoro"
              labelPosition="right"
              checked={formData.chat_during_pomodoro}
              onChange={() =>
                setFormData({
                  ...formData,
                  chat_during_pomodoro: !formData.chat_during_pomodoro,
                })
              }
            />
            <Switch
              label="Lock room (No new members)"
              labelPosition="right"
              checked={formData.locked}
              onChange={() =>
                setFormData({ ...formData, locked: !formData.locked })
              }
            />
            <Switch
              label="Discoverable"
              description="Make your room public by others."
              labelPosition="right"
              checked={formData.is_public}
              onChange={() =>
                setFormData({ ...formData, is_public: !formData.is_public })
              }
            />
            <div className="flex justify-end">
              <ResponsiveButton
                leftSection={<IconUpload size={20} />}
                onClick={handleSubmit}
              >
                Save
              </ResponsiveButton>
            </div>
          </form>
        ) : (
          <div className="space-y-sm">
            <div className="space-y-sm max-h-[400px] overflow-y-auto">
              {membersLoading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-x-sm p-xs rounded-lg"
                  >
                    <div className="w-10 h-10 rounded-full bg-secondary/20 animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-secondary/20 rounded animate-pulse w-3/4"></div>
                    </div>
                  </div>
                ))
              ) : members.length === 0 ? (
                <p className="text-secondary/60 text-center py-lg">
                  No members found
                </p>
              ) : (
                members.map((member: any, index: number) => (
                  <div
                    key={member._id || index}
                    className="flex items-center gap-x-sm rounded-lg p-xs transition-all hover:bg-secondary/5"
                  >
                    <div className="w-10 h-10 rounded-full bg-secondary text-primary flex items-center justify-center font-bold">
                      {member.avatar ? (
                        <img
                          src={`${member.avatar}`}
                          alt="Avatar"
                          className="w-11 border border-white rounded-full"
                        />
                      ) : (
                        <div className="flex justify-center items-center rounded-full border-1 p-sm border-secondary bg-primary-light hover:bg-primary-hover cursor-pointer">
                          <IconUser className="text-secondary" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className="text-secondary font-medium cursor-pointer"
                        onClick={() => null} // mo profile
                      >
                        {member.name || "User"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </Popover>
  );
}

export default RoomPopover;
