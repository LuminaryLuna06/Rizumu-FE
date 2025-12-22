import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axiosClient from "../config/axiosClient";
import { queryKeys } from "../query/queryKeys";

// Types
interface ProgressStats {
  total_hours: number;
  daily_average: number;
  // Thêm các field khác theo backend
}

// GET: Lấy thống kê progress
export const useGetProgress = () => {
  return useQuery<ProgressStats, AxiosError>({
    queryKey: queryKeys.progress.stats(),
    queryFn: async () => {
      const { data } = await axiosClient.get("/progress");
      return data;
    },
    // Refetch interval nếu muốn auto-update
    refetchInterval: 5 * 60 * 1000, // 5 phút
  });
};
