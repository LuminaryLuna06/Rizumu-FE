import { useAuth } from "@rizumu/context/AuthContext";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Modal from "../Modal";
import ResponsiveButton from "../ResponsiveButton";
import {
  IconCalendarWeek,
  IconChartColumn,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconFlame,
  IconList,
} from "@tabler/icons-react";
import { useState, useMemo } from "react";
import BoxAnalytics from "./components/BoxAnalytics";
import BoxReview from "./components/BoxReview";
import { months, hourNames } from "./data/month";
import { useHourlyData, useDailyData } from "@rizumu/tanstack/api/hooks";
import { useTags } from "@rizumu/tanstack/api/hooks/useTag";

interface ActivitiesModalProps {
  opened: boolean;
  onClose: () => void;
}
function ActivitiesModal({ opened, onClose }: ActivitiesModalProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"Analytics" | "Review">(
    "Analytics"
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { data: tags } = useTags(!!user);

  const { startTime, endTime } = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const date = selectedDate.getDate();

    return {
      startTime: new Date(year, month, date, 0, 0, 0, 0).toISOString(),
      endTime: new Date(year, month, date, 23, 59, 59, 999).toISOString(),
    };
  }, [selectedDate]);

  const { data: hourlyDurations, isLoading: hourlyLoading } = useHourlyData(
    startTime,
    endTime,
    user?._id || "",
    !!user?._id
  );

  const { data: dailySession, isLoading: dailyLoading } = useDailyData(
    startTime,
    endTime,
    user?._id || "",
    !!user?._id
  );

  const hourStats = useMemo(() => {
    if (!hourlyDurations) return [];
    return hourNames.map((name, index) => ({
      hourName: name,
      duration: Math.floor(hourlyDurations[index] || 0),
    }));
  }, [hourlyDurations]);

  const isLoading = hourlyLoading || dailyLoading;

  const getTotalSession = () => {
    return dailySession?.length || 0;
  };

  const getBestTime = () => {
    if (!dailySession || dailySession.length === 0) return "0m";
    let Max = dailySession[0].duration;
    dailySession.forEach((session) => {
      if (session.duration > Max) {
        Max = session.duration;
      }
    });

    if (Max < 60) {
      return Max.toString().padStart(2, "0") + "s";
    }
    if (Max < 3600) {
      return (
        Math.floor(Max / 60)
          .toString()
          .padStart(2, "0") +
        "m " +
        Math.floor(Max - Math.floor(Max / 60) * 60)
          .toString()
          .padStart(2, "0") +
        "s"
      );
    }
    return (
      Math.floor(Max / 3600)
        .toString()
        .padStart(2, "0") +
      "h " +
      Math.floor((Max - Math.floor(Max / 3600) * 3600) / 60)
        .toString()
        .padStart(2, "0") +
      "m"
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold mb-1">{label}</p>
          <p className="text-green-400">Duration: {payload[0].value} minutes</p>
        </div>
      );
    }
    return null;
  };

  const getBarColor = (duration: number) => {
    if (duration <= 10) {
      return "#6ee7b7";
    } else if (duration <= 20) {
      return "#34d399";
    } else if (duration <= 30) {
      return "#10b981";
    } else if (duration <= 40) {
      return "#047857";
    } else {
      return "#065f46";
    }
  };

  const getTotalTime = () => {
    let totalMinute = 0;
    hourStats.map((data) => {
      totalMinute += data.duration;
    });

    if (totalMinute > 60) {
      const hours = Math.floor(totalMinute / 60);
      const mins = totalMinute - hours * 60;
      return hours + "h " + mins + "m";
    }
    return totalMinute + "m";
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {
        onClose();
        setSelectedDate(new Date());
      }}
      title="Activities summary"
      className="w-full max-w-[800px] max-h-[70vh] overflow-y-auto overflow-x-hidden custom-scrollbar scrollbar-hidden"
    >
      <div className="flex w-full mb-md">
        <ResponsiveButton
          leftSection={<IconChartColumn />}
          className={`flex justify-center w-1/2 border-b-1 rounded-none bg-transparent hover:bg-transparent font-semibold ${
            activeTab === "Analytics"
              ? "text-text-active"
              : "text-text-inactive hover:text-text-active hover:border-text-inactive transition-all duration-300"
          }`}
          onClick={() => {
            setActiveTab("Analytics");
          }}
        >
          Analytics
        </ResponsiveButton>
        <ResponsiveButton
          leftSection={<IconList />}
          className={`flex justify-center w-1/2 border-b-1 rounded-none bg-transparent hover:bg-transparent font-semibold ${
            activeTab === "Review"
              ? "text-text-active"
              : "text-text-inactive hover:text-text-active hover:border-text-inactive transition-all duration-300"
          }`}
          onClick={() => {
            setActiveTab("Review");
          }}
        >
          Review Sessions
        </ResponsiveButton>
      </div>

      {/* Analytis div */}
      <div
        className={`${activeTab === "Analytics" ? "flex flex-col" : "hidden"}`}
      >
        <div className="flex flex-col bg-zinc-900 border border-white/20 rounded-lg mb-md">
          <div className="flex items-center gap-2 sm:gap-6 text-sm mb-6">
            <div className="flex justify-center items-center">
              <ResponsiveButton
                className="text-text-inactive hover:text-text-active bg-zinc-900 hover:bg-zinc-900"
                leftSection={<IconChevronLeft size={20} />}
                onClick={(e) => {
                  e.preventDefault();
                  const newDate = new Date(selectedDate);
                  newDate.setDate(newDate.getDate() - 1);
                  setSelectedDate(newDate);
                }}
              ></ResponsiveButton>
              <div className="flex justify-center text-sm font-medium">
                {months.map((month, index) => {
                  const monthNumber = selectedDate.getMonth();
                  const date = selectedDate.getDate();
                  if (index == monthNumber) {
                    if (date < 10) {
                      return (
                        <div key={index} className="flex justify-between">
                          <p>{month.name + " "}</p>
                          <p className="ml-[2px]">{"0" + date}</p>
                        </div>
                      );
                    }
                    return (
                      <div key={index} className="flex justify-between">
                        <p>{month.name + " "}</p>
                        <p className="ml-[2px]">{date}</p>
                      </div>
                    );
                  }
                })}
              </div>
              <ResponsiveButton
                className="text-text-inactive hover:text-text-active bg-zinc-900 hover:bg-zinc-900"
                leftSection={<IconChevronRight size={20} />}
                onClick={(e) => {
                  e.preventDefault();
                  const newDate = new Date(selectedDate);
                  newDate.setDate(newDate.getDate() + 1);

                  if (newDate < new Date()) {
                    setSelectedDate(newDate);
                  }
                }}
              ></ResponsiveButton>
            </div>
            <div className="flex items-center text-base text-text-inactive text-sm md:text-base">
              <p>Total Time:</p>
              {isLoading ? (
                <div className="w-12 h-4 bg-zinc-700 rounded ml-1"></div>
              ) : (
                <p className="ml-1 text-text-active">{getTotalTime()}</p>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-end justify-around h-[230px] gap-1 px-4">
              {[...Array(24)].map((_, i) => (
                <div
                  key={i}
                  className="bg-zinc-800 rounded-t w-full"
                  style={{
                    height: `${Math.random() * 60 + 20}%`,
                    animation: `pulse 1.5s ease-in-out ${i * 0.05}s infinite`,
                  }}
                ></div>
              ))}
            </div>
          ) : (
            <div className="flex mb-xl -ml-md sm:ml-0">
              <ResponsiveContainer height={230}>
                <BarChart data={hourStats}>
                  <XAxis
                    style={{ fontSize: "12px" }}
                    dataKey="hourName"
                    tick={{ dy: 5 }}
                    tickLine={false}
                    ticks={["12AM", "4AM", "8AM", "12PM", "4PM", "8PM"]}
                    axisLine={false}
                  />
                  <YAxis
                    style={{ fontSize: "12px" }}
                    tick={{ dx: -5 }}
                    tickFormatter={(value) => `${value}m`}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="duration">
                    {hourStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getBarColor(entry.duration)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-md">
            <div className="flex flex-col bg-zinc-900 border border-white/20 rounded-lg p-4 animate-pulse">
              <div className="w-10 h-10 bg-zinc-800 rounded-full mb-sm"></div>
              <div className="w-24 h-4 bg-zinc-800 rounded mb-md"></div>
              <div className="w-10 h-4 bg-zinc-700 rounded"></div>
            </div>
            <div className="flex flex-col bg-zinc-900 border border-white/20 rounded-lg p-4 animate-pulse">
              <div className="w-10 h-10 bg-zinc-800 rounded-full mb-sm"></div>
              <div className="w-24 h-4 bg-zinc-800 rounded mb-md"></div>
              <div className="w-10 h-4 bg-zinc-700 rounded"></div>
            </div>
            <div className="flex flex-col bg-zinc-900 border border-white/20 rounded-lg p-4 animate-pulse">
              <div className="w-10 h-10 bg-zinc-800 rounded-full mb-sm"></div>
              <div className="w-24 h-4 bg-zinc-800 rounded mb-md"></div>
              <div className="w-10 h-4 bg-zinc-700 rounded"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-md">
            <BoxAnalytics
              icon={<IconChartColumn size={30} />}
              text="Total Sessions"
              stat={getTotalSession()}
            />
            <BoxAnalytics
              icon={<IconClock size={30} />}
              text="Focused Time"
              stat={getTotalTime()}
            />
            <BoxAnalytics
              icon={<IconFlame size={30} />}
              text="Best Sessions"
              stat={getBestTime()}
            />
          </div>
        )}
      </div>

      {/* Review div */}
      <div
        className={`${
          activeTab === "Review" ? "flex flex-col min-h-[500px]" : "hidden"
        }`}
      >
        <div className="flex items-center ">
          <ResponsiveButton
            className="text-text-inactive hover:text-text-active bg-transparent hover:bg-transparent"
            leftSection={<IconChevronLeft size={20} />}
            onClick={(e) => {
              e.preventDefault();
              const newDate = new Date(selectedDate);
              newDate.setDate(newDate.getDate() - 1);
              setSelectedDate(newDate);
            }}
          ></ResponsiveButton>
          <div className="text-sm font-medium">
            {months.map((month, index) => {
              const monthNumber = selectedDate.getMonth();
              const date = selectedDate.getDate();
              if (index == monthNumber) {
                if (date < 10) {
                  return <p key={index}>{month.name + " 0" + date}</p>;
                }
                return <p key={index}>{month.name + " " + date}</p>;
              }
            })}
          </div>
          <ResponsiveButton
            className="text-text-inactive hover:text-text-active bg-transparent hover:bg-transparent"
            leftSection={<IconChevronRight size={20} />}
            onClick={(e) => {
              e.preventDefault();
              const newDate = new Date(selectedDate);
              newDate.setDate(newDate.getDate() + 1);

              if (newDate < new Date()) {
                setSelectedDate(newDate);
              }
            }}
          ></ResponsiveButton>
        </div>

        {isLoading ? (
          <div className="relative">
            <div className="absolute left-14 sm:left-24 top-0 bottom-0 border-1 border-white/20 border-dashed"></div>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex items-center relative p-0 sm:pl-6 sm:pb-4 w-full text-base animate-pulse"
              >
                <div className="w-[40px] h-4 bg-zinc-800 rounded"></div>
                <div className="absolute left-14 sm:left-24 ml-[1px] w-3 h-3 bg-zinc-700 rounded-full border-2 border-black/30 z-10 transform -translate-x-1/2"></div>
                <div className="flex-1 ml-10 sm:ml-20 mb-4 sm:mb-0 p-4 bg-black/10 rounded-xl border border-white/20 min-h-[100px]">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 bg-zinc-800 rounded"></div>
                    <div className="w-16 h-5 bg-zinc-800 rounded"></div>
                    <div className="w-12 h-6 bg-zinc-700 rounded-full"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-zinc-800 rounded"></div>
                    <div className="w-32 h-4 bg-zinc-800 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : dailySession && dailySession.length > 0 ? (
          dailySession.map((session, index) => (
            <div key={session.id || `session-${index}`} className="relative">
              <div className="absolute left-14 sm:left-24 top-0 bottom-0 border-1 border-white/20 border-dashed"></div>
              <BoxReview data={session} tags={tags || []} />
            </div>
          ))
        ) : (
          <div className="flex flex-col justify-center items-center h-[200px] bg-zinc-900 border border-white/20 rounded-lg mb-md text-xl text-text-inactive">
            <IconCalendarWeek size={60} />
            <p className="mt-md">No sessions found</p>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default ActivitiesModal;
