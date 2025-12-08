import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getLocalISOString = (): string => {
  return dayjs().tz("Asia/Ho_Chi_Minh").utc().format();
};

export const toLocalISOString = (date: Date): string => {
  return dayjs(date).tz("Asia/Ho_Chi_Minh").utc().format();
};
