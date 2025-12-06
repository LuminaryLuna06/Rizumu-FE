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
} from "@tabler/icons-react";
import React, { useEffect, useState } from "react";

function RoomPopover() {
  const toast = useToast();
  const { user, isLoading } = useAuth();
  const [room, setRoom] = useState<ModelRoom>();
  const [roomOpened, setRoomOpened] = useState(false);
  const [roomLoading, setRoomLoading] = useState(false);
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

  useEffect(() => {
    getRoom();
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

  // Don't show button if user is not logged in
  if (!user) {
    return null;
  }

  // Determine if we should show loading state
  const isLoadingRoom = roomLoading || (!room && !isLoading);

  return (
    <Popover
      trigger={
        <ResponsiveButton
          className="md:py-sm truncate"
          disabled={isLoadingRoom || !room}
        >
          {isLoadingRoom ? "Loading..." : room?.name || "Room"}
        </ResponsiveButton>
      }
      opened={roomOpened && !!room}
      onClose={() => setRoomOpened(!roomOpened)}
      position="top-right"
    >
      <div className="p-lg space-y-md">
        <div className="flex justify-between text-secondary items-center overflow-hidden">
          <div className="flex items-center gap-x-xs">
            <IconHome size={20} />
            <p>{room?.name || `${user?.name || "User"}'s Room`}</p>
            <ResponsiveButton
              className="bg-secondary/10 hover:bg-secondary/20 gap-x-xs text-sm md:p-xs"
              leftSection={<IconShare2 size={16} />}
            >
              Copy link
            </ResponsiveButton>
          </div>
          <IconUsers size={20} />
        </div>

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
            label="Invitation slug"
            description="Must be 4-16 characters long and unique"
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
      </div>
    </Popover>
  );
}

export default RoomPopover;
