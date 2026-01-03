import axiosClient from "@rizumu/tanstack/api/config/axiosClient";
import ActivitiesModal from "@rizumu/components/ActivitiesModal";
import BackgroundModal from "@rizumu/components/BackgroundModal";
import Modal from "@rizumu/components/Modal";
import Popover from "@rizumu/components/Popover";
import ProfileModal from "@rizumu/components/ProfileModal";
import ResponsiveButton from "@rizumu/components/ResponsiveButton";
import TextInput from "@rizumu/components/TextInput";
import { useAuth } from "@rizumu/context/AuthContext";
import { IconMessage, IconSend2, IconUsers } from "@tabler/icons-react";
import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useDeleteCompletedTasks,
} from "@rizumu/tanstack/api/hooks/useTask";

interface Message {
  _id: string;
  sender_id: string;
  content: string;
  createdAt: string;
}

interface RoomMember {
  user_id: string;
  name: string;
}

function TestHieu() {
  const { user, refreshUser } = useAuth();
  const [opened, setOpened] = useState(false);
  const [profileOpened, setProfileOpened] = useState(false);
  const [activitiesOpened, setActivitiesOpened] = useState(false);
  const [chatOpened, setChatOpened] = useState(false);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [roomMembers, setRoomMembers] = useState<RoomMember[]>([]);

  // Task API Hooks
  const {
    data: tasks,
    refetch: refetchTasks,
    isLoading: isTasksLoading,
  } = useTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const deleteCompleted = useDeleteCompletedTasks();

  const [hasMoreMessage, setHasMoreMessage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const messagesRef = useRef<HTMLDivElement | null>(null);
  const isInitialLoadRef = useRef<boolean>(true);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
  };

  const playDing = () => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const t = ctx.currentTime;

    // Âm chính
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Vang nhẹ
    const delay = ctx.createDelay();
    const feedback = ctx.createGain();
    const lowpass = ctx.createBiquadFilter();

    // Nén → to mà không vỡ
    const comp = ctx.createDynamicsCompressor();

    // ===== CẤU HÌNH =====
    osc.type = "sine"; // giữ đúng chất "ting"
    osc.frequency.setValueAtTime(1400, t);

    gain.gain.setValueAtTime(20, t); // Giảm bớt chút vì 50 là quá to, dễ gây rè
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    delay.delayTime.value = 0.08; // vang ngắn
    feedback.gain.value = 0.4; // Tăng feedback để vang lâu hơn
    lowpass.type = "lowpass";
    lowpass.frequency.value = 900;

    comp.threshold.value = -24;
    comp.ratio.value = 6;

    // ===== KẾT NỐI =====
    osc.connect(gain);
    gain.connect(comp);
    comp.connect(ctx.destination);

    // Echo
    comp.connect(delay);
    delay.connect(feedback);
    lowpass.connect(feedback);
    feedback.connect(delay);
    lowpass.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 1.5);
  };

  const startTimer = () => {
    initAudio();
    playDing();
  };

  useEffect(() => {
    if (!user?._id || !user.current_room_id) return;

    // Reset state when room changes
    setMessages([]);
    setHasMoreMessage(true);
    isInitialLoadRef.current = true;

    const newSocket = io("https://backend-school-pj-1.onrender.com", {
      auth: {
        userId: user._id,
      },
      query: {
        roomId: user.current_room_id,
      },
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("Socket connected to room:", user.current_room_id);
      loadMessages();
    });

    newSocket.on("new_message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
      setTimeout(() => {
        if (isNearBottom()) {
          scrollToBottom();
        }
      }, 100);
    });

    setSocket(newSocket);
    fetchRoomMembers();

    return () => {
      newSocket.disconnect();
      setSocket(null);
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
    if (isLoading || !user?.current_room_id) return;
    if (before && !hasMoreMessage) return;

    setIsLoading(true);

    let previousScrollHeight = 0;
    let previousScrollTop = 0;

    if (before && messagesRef.current) {
      previousScrollHeight = messagesRef.current.scrollHeight;
      previousScrollTop = messagesRef.current.scrollTop;
    }

    try {
      const url = before
        ? `/${user.current_room_id}/messages?before=${before}`
        : `/${user.current_room_id}/messages`;

      const res = await axiosClient.get(url);
      const data = res.data.message2 || [];

      if (before) {
        if (data.length > 0) {
          setMessages((prev) => [...data, ...prev]);
        }
        // Khôi phục vị trí scroll sau khi load tin nhắn cũ
        setTimeout(() => {
          if (messagesRef.current) {
            const newScrollHeight = messagesRef.current.scrollHeight;
            const heightDiff = newScrollHeight - previousScrollHeight;
            messagesRef.current.scrollTop = previousScrollTop + heightDiff;
          }
        }, 50);
      } else {
        setMessages(data);
      }

      setHasMoreMessage(res.data?.hasMore ?? false);
    } catch (err) {
      console.error("Lỗi load tin nhắn", err);
    } finally {
      setIsLoading(false);
    }
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
    if (!messagesRef.current || isLoading) return;
    if (messagesRef.current.scrollTop === 0) {
      const earliest = messages[0];
      if (earliest) {
        loadMessages(earliest.createdAt);
      }
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

  const getHourStats = async () => {
    if (!user?._id) return;
    try {
      const year = new Date().getFullYear();
      const month = new Date().getMonth();
      const date = new Date().getDate();

      const startTime = new Date(year, month, date, 0, 0, 0, 0).toISOString();
      const endTime = new Date(
        year,
        month,
        date,
        23,
        59,
        59,
        999
      ).toISOString();

      const response = await axiosClient.get(
        `/session/hourly?startTime=${startTime}&endTime=${endTime}&userId=${user._id}`
      );
      console.log(response.data);
    } catch (err) {
      console.error("Lỗi getHourStats:", err);
    }
  };

  const mapSenderName = Object.fromEntries(
    roomMembers?.map((e) => [e.user_id, e.name]) || []
  );

  const getProgress = async () => {
    if (!user?._id) return;
    try {
      const response = await axiosClient.get(`/progress/${user._id}`);
      console.log(response.data);
    } catch (err) {
      console.error("Lỗi getProgress:", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full overflow-hidden px-md md:px-xl text-secondary font-light text-sm z-base">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src="/video/Vid_BG_1.mp4" type="video/mp4" />
      </video>
      <div className="absolute flex gap-1 z-10 flex-wrap p-md">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => setOpened(true)}
        >
          Open Modal
        </button>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => {
            setProfileOpened(true);
            refreshUser();
          }}
        >
          Test Profile
        </button>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => {
            setActivitiesOpened(true);
            refreshUser();
          }}
        >
          Test Activity
        </button>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => getProgress()}
        >
          Test Progress
        </button>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => startTimer()}
        >
          Sound
        </button>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => getHourStats()}
        >
          Test Hourly Stats
        </button>

        {/* Task API Test Section */}
        <div className="flex flex-col gap-2 border-l pl-4 ml-2 bg-black/40 p-4 rounded-xl w-[300px]">
          <h3 className="text-white font-bold text-sm border-b border-white/10 pb-2 mb-2">
            Task API Test
          </h3>

          <div className="flex gap-2 mb-2">
            <button
              className="flex-1 px-3 py-1 bg-green-600/80 text-white rounded hover:bg-green-700 transition text-[10px]"
              onClick={() => {
                const title = prompt(
                  "Enter task title",
                  "New Task " + new Date().toLocaleTimeString()
                );
                if (title) createTask.mutate({ title });
              }}
              disabled={createTask.isPending}
            >
              {createTask.isPending ? "Adding..." : "Add Task"}
            </button>
            <button
              className="px-3 py-1 bg-red-600/80 text-white rounded hover:bg-red-700 transition text-[10px]"
              onClick={() => {
                if (confirm("Clear all completed tasks?"))
                  deleteCompleted.mutate();
              }}
              disabled={deleteCompleted.isPending}
            >
              Clear Done
            </button>
          </div>

          <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
            {isTasksLoading && (
              <p className="text-text-inactive text-[10px]">Loading tasks...</p>
            )}
            {tasks?.map((task) => (
              <div
                key={task._id}
                className={`flex items-center justify-between p-2 rounded border ${
                  task.is_complete
                    ? "bg-green-900/10 border-green-800/30"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={task.is_complete}
                    onChange={() =>
                      updateTask.mutate({
                        taskId: task._id,
                        data: { is_complete: !task.is_complete },
                      })
                    }
                    className="w-3 h-3 cursor-pointer"
                  />
                  <span
                    className={`truncate text-[11px] ${
                      task.is_complete
                        ? "line-through text-text-inactive"
                        : "text-white/90"
                    }`}
                  >
                    {task.title}
                  </span>
                </div>
                <div className="flex gap-1 ml-2">
                  <button
                    className="text-blue-400/60 hover:text-blue-500 transition px-1"
                    onClick={() => {
                      const newTitle = prompt("Edit task title", task.title);
                      if (newTitle && newTitle !== task.title) {
                        updateTask.mutate({
                          taskId: task._id,
                          data: { title: newTitle },
                        });
                      }
                    }}
                  >
                    <span className="text-[9px]">Edit</span>
                  </button>
                  <button
                    className="text-red-400/60 hover:text-red-500 transition px-1"
                    onClick={() => {
                      if (confirm("Delete this task?"))
                        deleteTask.mutate(task._id);
                    }}
                  >
                    <span className="text-[9px]">Del</span>
                  </button>
                </div>
              </div>
            ))}
            {!isTasksLoading && tasks?.length === 0 && (
              <p className="text-text-inactive text-[10px] italic py-2">
                No tasks available.
              </p>
            )}
          </div>

          <button
            className="mt-2 text-[10px] text-blue-400 hover:underline text-left"
            onClick={() => refetchTasks()}
          >
            ↻ Refresh List
          </button>
        </div>

        <Popover
          trigger={
            <ResponsiveButton leftSection={<IconMessage />}></ResponsiveButton>
          }
          opened={chatOpened}
          onClose={() => setChatOpened(!chatOpened)}
          position="bottom-left"
        >
          <div className="flex items-center justify-center bg-black/70 backdrop-blur-xl text-secondary rounded-3xl shadow-2xl p-md border border-gray-800 font-poppins overflow-hidden w-[350px]">
            <div className="flex flex-col w-full">
              <div className="flex justify-between items-center mb-4 w-full">
                <h2 className="text-lg font-semibold">Chat</h2>
                <div className="flex items-center gap-2 text-text-inactive">
                  <IconUsers size={16} />
                  <p className="text-sm">{roomMembers.length} members</p>
                </div>
              </div>
              <div
                ref={messagesRef}
                onScroll={handleScroll}
                className="flex flex-col gap-3 max-h-[350px] min-h-[300px] overflow-y-auto overflow-x-hidden custom-scrollbar pr-2 mb-4"
              >
                {messages &&
                  messages.map((msg, idx) => {
                    return (
                      <div className="flex flex-col" key={msg._id || idx}>
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-blue-400">
                            {mapSenderName[msg.sender_id] || "Anonymous"}:
                          </span>
                          <span className="text-white/90 break-words flex-1">
                            {msg.content}
                          </span>
                        </div>
                        <span className="text-text-inactive text-[10px]">
                          {formatTime(msg.createdAt)}
                        </span>
                      </div>
                    );
                  })}
                {isLoading && (
                  <div className="text-center text-xs text-text-inactive">
                    Loading...
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 border-t border-white/10 pt-4">
                <TextInput
                  placeholder="Type a message"
                  className="flex-1"
                  value={input}
                  onChange={(e: any) => {
                    setInput(e.target.value);
                  }}
                  onKeyDown={(e: any) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                />
                <ResponsiveButton
                  leftSection={<IconSend2 size={20} />}
                  disabled={input.trim().length === 0}
                  onClick={sendMessage}
                ></ResponsiveButton>
              </div>
            </div>
          </div>
        </Popover>

        <Modal
          opened={opened}
          onClose={() => setOpened(false)}
          title="Demo Modal"
        >
          <p>This is a basic modal content.</p>
        </Modal>
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
    </div>
  );
}

export default TestHieu;
