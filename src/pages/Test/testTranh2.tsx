import Popover from "@rizumu/components/Popover";
import ResponsiveButton from "@rizumu/components/ResponsiveButton";

import { useEffect, useState } from "react";
import bg from "@rizumu/assets/image/fuji2.jpg";
import {
  IconHome,
  IconShare2,
  IconUpload,
  IconUsers,
} from "@tabler/icons-react";
import TextInput from "@rizumu/components/TextInput";
import Switch from "@rizumu/components/Switch";
import { useAuth } from "@rizumu/context/AuthContext";
import axiosClient from "@rizumu/api/config/axiosClient";
import { useToast } from "@rizumu/utils/toast/toast";
import type { ModelRoom } from "@rizumu/models/room";
function testTranh2() {
  const toast = useToast();
  const { user, isLoading } = useAuth();
  const [room, setRoom] = useState<ModelRoom>();
  const [roomOpened, setRoomOpened] = useState(true);
  const [roomLoading, setRoomLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    chat_during_pomodoro: false,
    locked: false,
    is_public: false,
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    try {
      setRoomLoading(true);
      axiosClient.patch(`/room/${room?._id}`, formData);
      toast.success("Room updated!", "Success");
    } catch (e) {
      toast.error("Update error!", "Error");
    }
    setRoomLoading(false);
  };

  const getRoom = async () => {
    if (user && !isLoading) {
      try {
        const response = await axiosClient.get(
          `/room/id/${user?.current_room_id}`
        );
        setRoom(response.data as ModelRoom);
      } catch (e: any) {
        toast.error(e.message || "", "Error");
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
        chat_during_pomodoro: formData.chat_during_pomodoro,
        locked: formData.locked,
        is_public: formData.is_public,
      });
    }
  }, [room]);

  return (
    <div className="h-screen" style={{ backgroundImage: `url(${bg})` }}>
      <Popover
        trigger={
          <ResponsiveButton className="md:py-sm truncate">
            Leaving room
          </ResponsiveButton>
        }
        opened={roomOpened}
        onClose={() => setRoomOpened(!roomOpened)}
        position="right"
      >
        <div className="p-lg space-y-md">
          <div className="flex justify-between text-secondary items-center">
            <div className="flex items-center gap-x-xs">
              <IconHome size={20} />
              <p>{room?.name || `${user?.name || "User"}'s Room`}</p>
              <ResponsiveButton
                className="bg-white/10 hover:bg-white/20 gap-x-xs text-sm md:p-xs"
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
    </div>
  );
}

export default testTranh2;
