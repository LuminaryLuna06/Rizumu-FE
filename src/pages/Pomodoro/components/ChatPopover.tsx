import axiosClient from "@rizumu/tanstack/api/config/axiosClient";
import Popover from "@rizumu/components/Popover";
import ResponsiveButton from "@rizumu/components/ResponsiveButton";
import TextInput from "@rizumu/components/TextInput";
import { useAuth } from "@rizumu/context/AuthContext";
import { IconMessage, IconSend2, IconUsers } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

function ChatPopover() {
  const { user } = useAuth();
  const [chatOpened, setChatOpened] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<any>([]);
  const [input, setInput] = useState("");
  const [roomMembers, setRoomMembers] = useState<any[]>([]);

  const [hasMoreMessage, setHasMoreMessage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const messagesRef = useRef<HTMLDivElement | null>(null);
  const isInitialLoadRef = useRef<boolean>(true);

  useEffect(() => {
    if (!user?._id || !user?.current_room_id) {
      return;
    }

    // Reset tất cả state khi đổi room
    setMessages([]);
    setRoomMembers([]);
    setHasMoreMessage(true);
    isInitialLoadRef.current = true;

    // Tạo socket connection mới
    const newSocket = io("https://backend-school-pj-1.onrender.com", {
      auth: {
        userId: user._id,
      },
      query: {
        roomId: user.current_room_id,
      },
      transports: ["websocket"],
    });

    // Xử lý khi socket kết nối thành công
    newSocket.on("connect", () => {
      console.log("Socket connected to room:", user.current_room_id);

      loadMessages();
    });

    // Xử lý khi nhận tin nhắn mới
    newSocket.on("new_message", (msg) => {
      setMessages((prev: any) => [...prev, msg]);

      setTimeout(() => {
        if (isNearBottom()) {
          scrollToBottom();
        }
      }, 100);
    });

    setSocket(newSocket);

    fetchRoomMembers();

    return () => {
      console.log("Disconnecting socket from room:", user.current_room_id);
      newSocket.disconnect();
    };
  }, [user?._id, user?.current_room_id]);

  // Cuộn xuống dưới chỉ khi lần đầu load messages
  useEffect(() => {
    if (messages.length > 0 && isInitialLoadRef.current) {
      scrollToBottom();
      isInitialLoadRef.current = false;
    }
  }, [messages]);

  const loadMessages = async (before: string | null = null) => {
    if (isLoading) return;

    if (before && !hasMoreMessage) return;

    setIsLoading(true);

    let previousScrollHeight = 0;
    let previousScrollTop = 0;

    if (before && messagesRef.current) {
      previousScrollHeight = messagesRef.current.scrollHeight;
      previousScrollTop = messagesRef.current.scrollTop;
    }

    try {
      if (before) {
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
            messagesRef.current.scrollTop = previousScrollTop + heightDiff;
          }
        }, 50);
      } else {
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

  const formatTime = (time?: string) => {
    if (!time) return "";
    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const mapSenderName = Object.fromEntries(
    roomMembers && roomMembers.map((e) => [e.user_id, e.name])
  );

  return (
    <Popover
      trigger={
        <ResponsiveButton leftSection={<IconMessage />}></ResponsiveButton>
      }
      opened={chatOpened}
      onClose={() => setChatOpened(!chatOpened)}
      position="bottom-right"
    >
      <div className="flex items-center justify-center bg-primary/70 backdrop-blur-xl text-secondary rounded-3xl shadow-2xl p-md border border-primary font-poppins overflow-y-hidden overflow-x-hidden">
        <div className="flex flex-col w-full">
          <div className="flex justify-between mb-2 w-full">
            <h2 className="text-lg font-semibold">Chat</h2>
            <div className="flex items-center gap-2 text-text-inactive">
              <IconUsers size={14} />
              <p className="text-sm">{roomMembers.length || 1} members</p>
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
                    className="flex flex-col h-[40px] mb-sm"
                    key={msg._id || idx}
                  >
                    <div className="flex items-center gap-1">
                      <h2 className="font-semibold">
                        {mapSenderName[msg.sender_id] || "Anonymous User"}:
                      </h2>
                      <p className="text-secondary/80">{msg.content}</p>
                    </div>
                    <p className="text-text-inactive text-xs">
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                );
              })}
          </div>

          <div className="flex items-center">
            <TextInput
              placeholder="Type a message"
              className="w-full"
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
  );
}

export default ChatPopover;
