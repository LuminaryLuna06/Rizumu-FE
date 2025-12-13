import axiosClient from "@rizumu/api/config/axiosClient";
import ActivitiesModal from "@rizumu/components/ActivitiesModal";
import Modal from "@rizumu/components/Modal";
import Popover from "@rizumu/components/Popover";
import ProfileModal from "@rizumu/components/ProfileModal";
import ResponsiveButton from "@rizumu/components/ResponsiveButton";
import TextInput from "@rizumu/components/TextInput";
import { useAuth } from "@rizumu/context/AuthContext";
import { IconMessage, IconSend2, IconUsers } from "@tabler/icons-react";
import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

function TestHieu() {
  const { user, refreshUser } = useAuth();
  const [opened, setOpened] = useState(false);
  const [profileOpened, setProfileOpened] = useState(false);
  const [activitiesOpened, setActivitiesOpened] = useState(false);
  const [chatOpened, setChatOpened] = useState(false);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<any>([]);
  const [input, setInput] = useState("");
  const [roomMembers, setRoomMembers] = useState<any[]>([]);

  const [hasMoreMessage, setHasMoreMessage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const messagesRef = useRef<HTMLDivElement | null>(null);
  const limit = 20;

  const connectSocket = () => {
    if (!user?._id || !user.current_room_id || socket) return;

    const newSocket = io("https://backend-school-pj-1.onrender.com", {
      auth: {
        userId: user._id,
      },
      query: {
        roomId: user.current_room_id,
      },
      transports: ["websocket"],
    });

    setSocket(newSocket);
    console.log("Test: ", newSocket);
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      console.log("Đã kết nối socket!");
      loadMessages();
    });

    socket.on("new_message", (msg) => {
      setMessages((prev: any) => [...prev, msg]);
      scrollToBottom();
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    connectSocket();
    if (user?.current_room_id) {
      fetchRoomMembers();
    }
  }, [user?.current_room_id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async (before: string | null = null) => {
    if (isLoading || !hasMoreMessage || !user?.current_room_id) return;

    setIsLoading(true);

    try {
      const params: any = { limit };
      if (before) params.before = before;

      const res = await axiosClient.get(`/${user?.current_room_id}/messages`, {
        params,
      });

      const data = res.data.messages || [];

      setMessages((prev: any) => [...data, ...prev]);
      setHasMoreMessage(res.data?.hasMore ?? false);
    } catch (err) {
      console.error("Lỗi load tin nhắn", err);
    }

    setIsLoading(false);
  };

  const sendMessage = () => {
    if (!input.trim() || !socket || !user?.current_room_id) return;

    console.log("Emit send_message:", input.trim());

    socket.emit("send_message", input.trim());
    setInput("");
  };

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  const handleScroll = () => {
    if (!messagesRef.current) return;
    if (messagesRef.current.scrollTop === 0 && !isLoading) {
      const earliest = messages[0];
      loadMessages(earliest?.createdAt || null);
    }
  };

  const fetchRoomMembers = async () => {
    if (!user?.current_room_id) return;

    try {
      const response = await axiosClient.get(
        `/room/${user.current_room_id}/members`
      );
      setRoomMembers(response.data || []);
      console.log("Room members:", response.data);
    } catch (err) {
      console.error("Lỗi load members:", err);
    }
  };

  const getMemberName = (userId: string) => {
    if (!userId) return "Unknown";

    if (roomMembers && roomMembers.length > 0) {
      const member = roomMembers.find(
        (member: any) => member.user_id === userId
      );

      if (member) {
        return member?.name || "Unknown";
      }
    }

    return "Not found";
  };

  const formatTime = (time?: string) => {
    if (!time) return "";
    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getHourStats = async () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const date = new Date().getDate();

    const startTime = new Date(year, month, date, 0, 0, 0, 0).toISOString();
    const endTime = new Date(year, month, date, 23, 59, 59, 999).toISOString();

    const response = await axiosClient.get(
      `/session/hourly?startTime=${startTime}&endTime=${endTime}&userId=${user?._id}`
    );
    console.log(response.data);
  };

  return (
    <div>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => setOpened(true)}
      >
        Open Modal
      </button>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Demo Modal"
      >
        <p>This is a basic modal content.</p>
      </Modal>

      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => {
          setProfileOpened(true);
          refreshUser();
        }}
      >
        Test Profile
      </button>

      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => {
          setActivitiesOpened(true);
          refreshUser();
        }}
      >
        Test Activity
      </button>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => getHourStats()}
      >
        Test
      </button>
      <Popover
        trigger={
          <ResponsiveButton leftSection={<IconMessage />}></ResponsiveButton>
        }
        opened={chatOpened}
        onClose={() => setChatOpened(!chatOpened)}
        position="bottom-left"
      >
        <div className="flex items-center justify-center bg-black/70 backdrop-blur-xl text-secondary rounded-3xl shadow-2xl p-md border border-gray-800 font-poppins overflow-y-hidden overflow-x-hidden">
          <div className="flex flex-col w-full">
            <div className="flex justify-between mb-2 w-full">
              <h2 className="text-lg font-semibold">Chat</h2>
              <div className="flex items-center gap-2 text-text-inactive">
                <IconUsers size={14} />
                <p className="text-sm">{roomMembers.length} members</p>
              </div>
            </div>
            <div
              ref={messagesRef}
              onScroll={handleScroll}
              className="flex flex-col items-start max-h-[350px] min-h-[250px] overflow-y-auto overflow-x-hidden custom-scrollbar scrollbar-hidden"
            >
              {messages.map((msg: any, idx: number) => {
                const senderName = getMemberName(msg?.sender_id?._id);

                return (
                  <div
                    className="flex flex-col h-[50px] mb-sm"
                    key={msg._id || idx}
                  >
                    <div className="flex items-center gap-1">
                      <h2 className="text-lg font-bold">{senderName}:</h2>
                      <p className="text-white/80">{msg.content}</p>
                    </div>
                    <p className="text-text-inactive text-sm">
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center">
              <TextInput
                placeholder="Type a message"
                className="w-9/10"
                value={input}
                onChange={(e: any) => {
                  setInput(e.target.value);
                }}
                onKeyDown={(e: any) => {
                  if (e.key === "Enter") sendMessage();
                }}
              />
              <ResponsiveButton
                leftSection={<IconSend2 size={25} />}
                disabled={input.trim().length === 0}
                onClick={sendMessage}
              ></ResponsiveButton>
            </div>
          </div>
        </div>
      </Popover>

      <ProfileModal
        opened={profileOpened}
        onClose={() => setProfileOpened(false)}
        onOpenProfile={() => setProfileOpened(true)}
      />
      <ActivitiesModal
        opened={activitiesOpened}
        onClose={() => setActivitiesOpened(false)}
      />
    </div>
  );
}

export default TestHieu;
