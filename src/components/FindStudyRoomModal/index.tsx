import Modal from "../Modal";
import { IconLibrary, IconLogin2 } from "@tabler/icons-react";
import ResponsiveButton from "../ResponsiveButton";
import { useJoinRoom, usePublicRooms } from "@rizumu/tanstack/api/hooks";
import { useToast } from "@rizumu/utils/toast/toast";
import { useAuth } from "@rizumu/context/AuthContext";

function FindStudyRoomModal({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) {
  const toast = useToast();
  const { user } = useAuth();
  const { data: rooms, isLoading } = usePublicRooms(opened);
  const join = useJoinRoom();

  const joinRoom = async (id: string) => {
    join.mutate(id, {
      onSuccess: () => {
        toast.success("Joined room successfully!", "Success");
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to join!",
          "Error"
        );
      },
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Public study rooms"
      more={<IconLibrary />}
    >
      {/* --- Content --- */}
      <div className="grid grid-cols-12 gap-2 text-secondary/80 font-semibold text-sm mb-3 px-3">
        <div className="col-span-5 md:col-span-3">Name</div>
        <div className="hidden md:block md:col-span-3">About</div>
        <div className="col-span-4 md:col-span-2">Members</div>
        <div className="hidden md:block md:col-span-2">Host</div>
        <div className="col-span-3 md:col-span-2"></div>
      </div>

      <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar scrollbar-hidden px-1">
        {isLoading
          ? Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-secondary/5 grid grid-cols-12 gap-2 items-center p-3 rounded-xl border border-transparent"
              >
                <div className="col-span-5 md:col-span-3">
                  <div className="h-5 bg-secondary/20 rounded animate-pulse w-3/4"></div>
                </div>
                <div className="hidden md:block md:col-span-3">
                  <div className="h-4 bg-secondary/20 rounded animate-pulse w-full"></div>
                </div>
                <div className="col-span-4 md:col-span-2 flex items-center">
                  <div className="flex items-center pl-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-secondary/20 animate-pulse -ml-3 first:ml-0"
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="hidden md:block md:col-span-2">
                  <div className="h-4 bg-secondary/20 rounded animate-pulse w-2/3"></div>
                </div>
                <div className="col-span-3 md:col-span-2 flex justify-end">
                  <div className="h-9 bg-secondary/20 rounded-lg animate-pulse w-20"></div>
                </div>
              </div>
            ))
          : rooms &&
            rooms.map((room) => (
              <div
                key={room.id}
                className="group bg-secondary/5 hover:bg-secondary/10 grid grid-cols-12 gap-2 items-center p-3 rounded-xl hover:bg-primary/5 transition-colors border border-transparent hover:border-white/5"
              >
                <div className="col-span-5 md:col-span-3 font-semibold truncate pr-2">
                  {room.name}
                </div>
                <div className="hidden md:block md:col-span-3 text-secondary/60 text-xs truncate pr-2">
                  {room.description}
                </div>
                <div className="col-span-4 md:col-span-2 flex items-center">
                  <div className="flex items-center pl-2">
                    {room.members.slice(0, 3).map((member, idx) =>
                      member.avatar ? (
                        <img
                          key={idx}
                          src={member.avatar}
                          alt="member"
                          className="w-8 h-8 rounded-full border-1 -ml-3 first:ml-0 object-cover"
                        />
                      ) : (
                        <div
                          key={idx}
                          className="w-8 h-8 rounded-full border-1 -ml-3 first:ml-0 bg-secondary/20 flex items-center justify-center text-xs font-semibold"
                        >
                          U
                        </div>
                      )
                    )}
                    {room.members.length > 3 && (
                      <div className="w-8 h-8 rounded-full border-1 -ml-3 bg-gray-800 flex items-center justify-center text-xs">
                        +{room.members.length - 3}
                      </div>
                    )}
                  </div>
                </div>
                <div className="hidden md:block md:col-span-2 text-secondary/60 text-sm truncate">
                  {room.host_name}
                </div>
                <div className="col-span-3 md:col-span-2 flex justify-end">
                  {user?.current_room_id === room.id ? null : (
                    <ResponsiveButton
                      rightSection={<IconLogin2 size={18} />}
                      className="font-semibold bg-secondary/10 hover:bg-secondary/20"
                      onClick={() => {
                        joinRoom(room.id);
                      }}
                      disabled={join.isPending}
                    >
                      Join
                    </ResponsiveButton>
                  )}
                </div>
              </div>
            ))}
      </div>
    </Modal>
  );
}

export default FindStudyRoomModal;
