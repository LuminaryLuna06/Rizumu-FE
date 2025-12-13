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
  const isInitialLoadRef = useRef<boolean>(true);

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

      // Chỉ tự động cuộn xuống nếu user đang ở gần cuối
      setTimeout(() => {
        if (isNearBottom()) {
          scrollToBottom();
        }
      }, 100);
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

  // Cuộn xuống dưới chỉ khi lần đầu load messages
  useEffect(() => {
    if (messages.length > 0 && isInitialLoadRef.current) {
      // Chỉ tự động cuộn khi là lần đầu load
      scrollToBottom();
      isInitialLoadRef.current = false;
    }
  }, [messages]);

  const loadMessages = async (before: string | null = null) => {
    if (isLoading) return;

    // Check hasMoreMessage khi load tin nhắn cũ
    if (before && !hasMoreMessage) return;

    setIsLoading(true);

    // Lưu lại vị trí scroll hiện tại trước khi load tin nhắn cũ
    let previousScrollHeight = 0;
    let previousScrollTop = 0;

    if (before && messagesRef.current) {
      previousScrollHeight = messagesRef.current.scrollHeight;
      previousScrollTop = messagesRef.current.scrollTop;
    }

    try {
      if (before) {
        // Load tin nhắn cũ
        const res = await axiosClient.get(
          `/${user?.current_room_id}/messages?before=${before}`
        );
        const data = res.data.message2 || [];

        if (data.length > 0) {
          setMessages((prev: any) => [...data, ...prev]);
        }
        setHasMoreMessage(res.data?.hasMore ?? false);

        // Khôi phục vị trí scroll sau khi load tin nhắn cũ
        setTimeout(() => {
          if (messagesRef.current) {
            const newScrollHeight = messagesRef.current.scrollHeight;
            const heightDiff = newScrollHeight - previousScrollHeight;
            // Giữ nguyên vị trí bằng cách cộng thêm chiều cao mới
            messagesRef.current.scrollTop = previousScrollTop + heightDiff;
          }
        }, 50);
      } else {
        // Load tin nhắn ban đầu
        const res = await axiosClient.get(`/${user?.current_room_id}/messages`);
        const data = res.data.message2 || [];

        setMessages(data);
        setHasMoreMessage(res.data?.hasMore ?? false);
      }
    } catch (err) {
      console.error("Lỗi load tin nhắn", err);
    }

    setIsLoading(false);
  };

  const sendMessage = () => {
    if (!input.trim() || !socket || !user?.current_room_id) return;
    socket.emit("send_message", input.trim());
    setInput("");
  };

  const isNearBottom = () => {
    if (!messagesRef.current) return false;

    const { scrollTop, scrollHeight, clientHeight } = messagesRef.current;
    // Kiểm tra nếu user đang ở trong vòng 150px từ đáy
    return scrollHeight - scrollTop - clientHeight < 150;
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
    } catch (err) {
      console.error("Lỗi load members:", err);
    }
  };

  // const getMemberName = (userId: string) => {
  //   if (!userId) return "Unknown";

  //   if (roomMembers && roomMembers.length > 0) {
  //     const member = roomMembers.find(
  //       (member: any) => member.user_id === userId
  //     );

  //     if (member) {
  //       return member?.name || "Unknown";
  //     }
  //   }

  //   return "Not found";
  // };

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
  const mapSenderName = Object.fromEntries(
    roomMembers && roomMembers.map((e) => [e.user_id, e.name])
  );

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
              {messages &&
                messages.map((msg: any, idx: number) => {
                  return (
                    <div
                      className="flex flex-col h-[50px] mb-sm"
                      key={msg._id || idx}
                    >
                      <div className="flex items-center gap-1">
                        <h2 className="text-lg font-bold">
                          {mapSenderName[msg.sender_id] || "Anonymous User"}:
                        </h2>
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
