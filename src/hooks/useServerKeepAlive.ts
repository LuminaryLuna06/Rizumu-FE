import { useEffect, useRef } from "react";
import axiosClient from "@rizumu/tanstack/api/config/axiosClient";
import API_URLS from "@rizumu/tanstack/endpoint";

/**
 * Custom hook để tự động ping server mỗi 14 phút
 * Ngăn server free-tier không bị sleep do inactivity
 * @param enabled - Bật/tắt keep-alive (mặc định: true)
 * @param intervalMinutes - Số phút giữa mỗi lần ping (mặc định: 14)
 */
export const useServerKeepAlive = (
  enabled: boolean = true,
  intervalMinutes: number = 14
) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const pingServer = async () => {
      try {
        const url = API_URLS.HEALTH.PING;
        const method = "GET";
        await axiosClient({
          method,
          url,
        });
        console.log(
          `[Keep-Alive] Server pinged successfully at ${new Date().toLocaleTimeString()}`
        );
      } catch (error) {
        console.warn("[Keep-Alive] Failed to ping server:", error);
      }
    };

    pingServer();

    const intervalMs = intervalMinutes * 60 * 1000;
    intervalRef.current = setInterval(pingServer, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, intervalMinutes]);
};
