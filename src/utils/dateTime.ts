import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Extend dayjs với timezone plugin
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Lấy thời gian hiện tại theo local timezone dưới dạng ISO string
 * Giải quyết vấn đề `new Date().toISOString()` luôn trả về UTC
 * @returns ISO string theo local timezone (ví dụ: "2025-12-08T19:12:06+07:00")
 */
export const getLocalISOString = (): string => {
  return dayjs().format();
};

/**
 * Chuyển đổi Date object sang ISO string theo local timezone
 * @param date - Date object cần chuyển đổi
 * @returns ISO string theo local timezone
 */
export const toLocalISOString = (date: Date): string => {
  return dayjs(date).format();
};
