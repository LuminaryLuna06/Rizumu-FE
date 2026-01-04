import { useState, useRef, useEffect } from "react";
import {
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconX,
  IconCheck,
} from "@tabler/icons-react";

interface DateInputProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  min?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  withTime?: boolean;
  timeValue?: string;
  onTimeChange?: (value: string) => void;
}

function DateInput({
  label,
  value,
  onChange,
  min,
  size = "sm",
  className = "",
  withTime = false,
  timeValue = "",
  onTimeChange,
}: DateInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const [viewDate, setViewDate] = useState(new Date());
  const [tempTime, setTempTime] = useState(timeValue || "");
  const containerRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    xs: "h-[30px] text-xs",
    sm: "h-[36px] text-sm",
    md: "h-[42px] text-base",
    lg: "h-[50px] text-lg",
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);

    // Check if date is before min
    if (min) {
      // Parse YYYY-MM-DD as local date instead of UTC
      const minStr = min.split("T")[0];
      const [y, m, d] = minStr.split("-").map(Number);
      const minDate = new Date(y, m - 1, d);
      if (newDate < minDate) return;
    }

    setSelectedDate(newDate);

    // If today is selected and tempTime is in the past, reset it
    const now = new Date();
    const isToday =
      newDate.getDate() === now.getDate() &&
      newDate.getMonth() === now.getMonth() &&
      newDate.getFullYear() === now.getFullYear();

    if (isToday && tempTime) {
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;
      if (tempTime < currentTime) {
        setTempTime("");
      }
    }

    if (!withTime) {
      if (onChange) {
        // Format as YYYY-MM-DD for datetime-local compatibility
        const year = newDate.getFullYear();
        const month = String(newDate.getMonth() + 1).padStart(2, "0");
        const dayStr = String(day).padStart(2, "0");
        onChange(`${year}-${month}-${dayStr}`);
      }
      setIsOpen(false);
    }
  };

  const handleConfirm = () => {
    if (!selectedDate) return;

    if (withTime && tempTime) {
      const now = new Date();
      const isTodayStr =
        selectedDate.getDate() === now.getDate() &&
        selectedDate.getMonth() === now.getMonth() &&
        selectedDate.getFullYear() === now.getFullYear();

      if (isTodayStr) {
        const currentTime = `${String(now.getHours()).padStart(
          2,
          "0"
        )}:${String(now.getMinutes()).padStart(2, "0")}`;
        if (tempTime < currentTime) {
          // You could show a toast here, but for now we just prevent confirm
          return;
        }
      }
    }

    if (onChange) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const dayStr = String(selectedDate.getDate()).padStart(2, "0");
      onChange(`${year}-${month}-${dayStr}`);
    }
    if (withTime && onTimeChange && tempTime) {
      onTimeChange(tempTime);
    }
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleClear = () => {
    setSelectedDate(null);
    if (onChange) onChange("");
    if (onTimeChange) onTimeChange("");
    setTempTime("");
  };

  const isDateDisabled = (day: number) => {
    if (!min) return false;
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    // Parse 'YYYY-MM-DD' as local date instead of UTC
    const minStr = min.split("T")[0];
    const [y, m, d] = minStr.split("-").map(Number);
    const minDate = new Date(y, m - 1, d);
    return date < minDate;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      viewDate.getMonth() === today.getMonth() &&
      viewDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      viewDate.getMonth() === selectedDate.getMonth() &&
      viewDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-secondary/80 mb-1.5">
          {label}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full ${sizeClasses[size]} px-3
            border border-white/20 bg-white/5 text-white
            rounded-md
            flex items-center justify-between
            hover:bg-white/8 hover:border-white/30
            focus:border-white/50 focus:bg-white/8
            transition-all
            ${isOpen ? "border-white/50 bg-white/8" : ""}
          `}
        >
          <div className="flex items-center gap-2">
            <IconCalendar size={16} className="text-white/60" />
            <span className={selectedDate ? "text-white" : "text-white/40"}>
              {selectedDate
                ? `${formatDate(selectedDate)}${
                    withTime && timeValue ? `  -  ${timeValue}` : ""
                  }`
                : withTime
                ? "dd/mm/yyyy   --:--"
                : "dd/mm/yyyy"}
            </span>
          </div>
          {selectedDate && (
            <IconX
              size={14}
              className="text-white/60 hover:text-white cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
            />
          )}
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 z-50 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl p-4 w-[280px] animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Month/Year Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <IconChevronLeft size={18} className="text-white/80" />
              </button>
              <span className="text-sm font-medium text-white">
                {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <IconChevronRight size={18} className="text-white/80" />
              </button>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-[10px] font-medium text-white/40 py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(viewDate).map((day, index) => {
                if (day === null) {
                  return (
                    <div key={`empty-${index}`} className="aspect-square" />
                  );
                }

                const disabled = isDateDisabled(day);
                const today = isToday(day);
                const selected = isSelected(day);

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => !disabled && handleDateSelect(day)}
                    disabled={disabled}
                    className={`
                      aspect-square rounded-md text-xs font-medium
                      transition-all
                      ${
                        disabled
                          ? "text-white/20 cursor-not-allowed"
                          : "text-white/80 hover:bg-white/10"
                      }
                      ${today && !selected ? "bg-white/5 text-white" : ""}
                      ${
                        selected
                          ? "bg-[#0ea5e9] text-white font-bold shadow-lg"
                          : ""
                      }
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Time Input */}
            {withTime && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    {/* Hour Selector */}
                    <div className="relative">
                      <div className="text-xs text-white/60 mb-1 text-center">
                        Hour
                      </div>
                      <div className="h-32 overflow-y-auto custom-scrollbar scrollbar-hidden bg-[#2a2a2a] border border-white/10 rounded-md">
                        {Array.from({ length: 24 }, (_, i) => {
                          const hour = String(i).padStart(2, "0");
                          const now = new Date();
                          const isToday =
                            selectedDate &&
                            selectedDate.getDate() === now.getDate() &&
                            selectedDate.getMonth() === now.getMonth() &&
                            selectedDate.getFullYear() === now.getFullYear();
                          const currentHour = now.getHours();
                          const isDisabled = isToday && i < currentHour;
                          const selectedHour = tempTime.split(":")[0];
                          const isSelected = selectedHour === hour;

                          return (
                            <button
                              key={i}
                              type="button"
                              disabled={!!isDisabled}
                              onClick={() => {
                                const minute = tempTime.split(":")[1] || "00";
                                const newTime = `${hour}:${minute}`;

                                // Check if minute is valid for this hour
                                if (isToday && i === currentHour) {
                                  const currentMinute = now.getMinutes();
                                  const selectedMinute = parseInt(minute);
                                  if (selectedMinute < currentMinute) {
                                    setTempTime(
                                      `${hour}:${String(currentMinute).padStart(
                                        2,
                                        "0"
                                      )}`
                                    );
                                    return;
                                  }
                                }
                                setTempTime(newTime);
                              }}
                              className={`w-full py-2 text-sm transition-colors ${
                                isDisabled
                                  ? "text-white/20 cursor-not-allowed"
                                  : isSelected
                                  ? "bg-[#0ea5e9] text-white font-bold"
                                  : "text-white/80 hover:bg-white/10"
                              }`}
                            >
                              {hour}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Minute Selector */}
                    <div className="relative">
                      <div className="text-xs text-white/60 mb-1 text-center">
                        Minute
                      </div>
                      <div className="h-32 overflow-y-auto custom-scrollbar scrollbar-hidden bg-[#2a2a2a] border border-white/10 rounded-md">
                        {Array.from({ length: 60 }, (_, i) => {
                          const minute = String(i).padStart(2, "0");
                          const now = new Date();
                          const isToday =
                            selectedDate &&
                            selectedDate.getDate() === now.getDate() &&
                            selectedDate.getMonth() === now.getMonth() &&
                            selectedDate.getFullYear() === now.getFullYear();
                          const selectedHour = parseInt(
                            tempTime.split(":")[0] || "0"
                          );
                          const currentHour = now.getHours();
                          const currentMinute = now.getMinutes();
                          const isDisabled =
                            isToday &&
                            selectedHour === currentHour &&
                            i < currentMinute;
                          const selectedMinute = tempTime.split(":")[1];
                          const isSelected = selectedMinute === minute;

                          return (
                            <button
                              key={i}
                              type="button"
                              disabled={!!isDisabled}
                              onClick={() => {
                                const hour = tempTime.split(":")[0] || "00";
                                setTempTime(`${hour}:${minute}`);
                              }}
                              className={`w-full py-2 text-sm transition-colors ${
                                isDisabled
                                  ? "text-white/20 cursor-not-allowed"
                                  : isSelected
                                  ? "bg-[#0ea5e9] text-white font-bold"
                                  : "text-white/80 hover:bg-white/10"
                              }`}
                            >
                              {minute}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleConfirm}
                  className="p-2 bg-[#0ea5e9] hover:bg-[#0ea5e9]/80 rounded-md transition-colors w-full"
                >
                  <IconCheck size={18} className="text-white mx-auto" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DateInput;
