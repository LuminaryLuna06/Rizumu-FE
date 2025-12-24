import { createContext, useContext, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Only connect if user is logged in and in a room
    if (!user?._id || !user?.current_room_id) {
      // Disconnect if no user or no room
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Create new socket connection
    const newSocket = io(import.meta.env.VITE_SOCKET_URL_RIZUMU, {
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
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    setSocket(newSocket);

    // Cleanup on unmount or when dependencies change
    return () => {
      console.log("Disconnecting socket");
      newSocket.disconnect();
    };
  }, [user?._id, user?.current_room_id]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
