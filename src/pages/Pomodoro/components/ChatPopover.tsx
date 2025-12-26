import Popover from "@rizumu/components/Popover";
import ResponsiveButton from "@rizumu/components/ResponsiveButton";
import TextInput from "@rizumu/components/TextInput";
import { useAuth } from "@rizumu/context/AuthContext";
import { useSocket } from "@rizumu/context/SocketContext";
import { IconMessage, IconSend2, IconUsers } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useRoomMembers } from "@rizumu/tanstack/api/hooks";
import axiosClient from "@rizumu/tanstack/api/config/axiosClient";
import type { ModelRoomMessage } from "@rizumu/models/roomMessage";

function ChatPopover() {
  const { user } = useAuth();
  const [chatOpened, setChatOpened] = useState(false);
  const { socket } = useSocket();
  const [messages, setMessages] = useState<ModelRoomMessage[]>([]);
  const [input, setInput] = useState("");
  const { data: roomMembers = [] } = useRoomMembers(
    user?.current_room_id || "",
    !!user?.current_room_id
  );

  const [hasMoreMessage, setHasMoreMessage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const messagesRef = useRef<HTMLDivElement | null>(null);
  const isInitialLoadRef = useRef<boolean>(true);

  useEffect(() => {
    if (!user?._id || !user?.current_room_id || !socket) {
      return;
    }

    // Reset tất cả state khi đổi room
    setMessages([]);
    setHasMoreMessage(true);
    isInitialLoadRef.current = true;

    loadMessages();

    // Xử lý khi nhận tin nhắn mới
    const handleNewMessage = (msg: ModelRoomMessage) => {
      setMessages((prev) => [...prev, msg]);

      // If chat is closed and message is not from current user, show notification
      if (!chatOpened && msg.sender_id !== user?._id) {
        setHasNewMessage(true);
      }

      setTimeout(() => {
        if (isNearBottom()) {
          scrollToBottom();
        }
      }, 100);
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [user?._id, user?.current_room_id, socket]);

  // Cuộn xuống dưới chỉ khi lần đầu load messages
  useEffect(() => {
    if (messages.length > 0 && isInitialLoadRef.current) {
      scrollToBottom();
      isInitialLoadRef.current = false;
    }
  }, [messages]);

  // Clear notification when chat is opened
  useEffect(() => {
    if (chatOpened) {
      setHasNewMessage(false);
    }
  }, [chatOpened]);

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

  const mapSenderName = Object.fromEntries(
    roomMembers && roomMembers.map((e) => [e.user_id, e.name])
  );

  return (
    <Popover
      trigger={
        <ResponsiveButton ariaLabel="Open chat" title="Open chat">
          <div className="grid grid-cols-1 grid-rows-1">
            <div className="col-start-1 row-start-1">
              <IconMessage size={20} />
            </div>
            {hasNewMessage && (
              <div className="col-start-1 row-start-1 self-start justify-self-end -mt-1 -mr-1">
                <span className="flex h-2.5 w-2.5 rounded-full bg-white shadow-sm"></span>
              </div>
            )}
          </div>
        </ResponsiveButton>
      }
      opened={chatOpened}
      onClose={() => setChatOpened(!chatOpened)}
      position="bottom-right"
      className="w-80 md:w-90"
    >
      <div className="flex items-center justify-center  bg-primary/70 backdrop-blur-xl text-secondary rounded-3xl shadow-2xl p-md border border-primary font-poppins overflow-y-hidden overflow-x-hidden">
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
            className="flex flex-col items-start min-h-[30vh] max-h-[50vh] overflow-y-auto overflow-x-hidden custom-scrollbar scrollbar-hidden"
          >
            {messages.map((msg, idx) => {
              // System message styling
              if (msg.type === "system") {
                return (
                  <div
                    key={msg._id || idx}
                    className="w-full flex justify-center my-2"
                  >
                    <p className="text-xs italic text-text-inactive bg-secondary/10 px-3 py-1 rounded-full">
                      {msg.content}
                    </p>
                  </div>
                );
              }

              // Regular user message
              return (
                <div className="gap-1 mb-xl" key={msg._id || idx}>
                  <p className="text-secondary/80">
                    <span className="font-semibold text-md text-text-active">
                      {mapSenderName[msg.sender_id] || "Anonymous User"}:
                    </span>{" "}
                    {msg.content}
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
              ariaLabel="Send message"
              title="Gửi tin nhắn"
            ></ResponsiveButton>
          </div>
        </div>
      </div>
    </Popover>
  );
}

export default ChatPopover;
