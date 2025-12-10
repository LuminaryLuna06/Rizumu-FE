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
import { useEffect, useState } from "react";
import BoxAnalytics from "./components/BoxAnalytics";
import BoxReview from "./components/BoxReview";
import axiosClient from "@rizumu/api/config/axiosClient";
import { months, hourNames } from "./data/month";

interface ActivitiesModalProps {
  opened: boolean;
  onClose: () => void;
}
function ActivitiesModal({ opened, onClose }: ActivitiesModalProps) {
  const { user } = useAuth();
  const [existSession, setExistSession] = useState(true);
  const [hourStats, setHourStats] = useState<
    { hourName: string; duration: number }[]
  >([]);
  const [activeTab, setActiveTab] = useState<"Analytics" | "Review">(
    "Analytics"
  );
  const [analyticsButton, setAnalyticsButton] = useState<
    "Today" | "This week" | "This month"
  >("Today");

  const getHourStats = async () => {
    if (!user?._id || !hourStats) return;

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
        `/session/hourly?startTime=${startTime}&endTime=${endTime}&userId=${user?._id}`
      );
      const duration = response.data;
      const result = hourNames.map((name, index) => ({
        hourName: name,
        duration: Math.floor(duration[index]),
      }));

      setHourStats(result);
    } catch (error) {
      console.error("Error fetching heatmap data:", error);
    }
  };

  useEffect(() => {
    if (opened) {
      getHourStats();
    }
  }, [opened, user?._id]);

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
      return "#a7f3d0";
    } else if (duration <= 20) {
      return "#6ee7b7";
    } else if (duration <= 30) {
      return "#34d399";
    } else if (duration <= 40) {
      return "#10b981";
    } else {
      return "#059669";
    }
  };

  const getTotalTime = () => {
    let totalMinute = 0;
    hourStats.map((data) => {
      totalMinute += data.duration;
    });

    if (totalMinute > 60) {
      let totalHour = Math.floor(totalMinute / 60);
      return totalHour + "h " + (totalMinute - totalHour * 60) + "m";
    }
    return totalMinute + "m";
  };

  const getTotalSession = () => {
    let totalSession = 0;
    hourStats.map((data) => {
      if (data.duration > 0) totalSession += 1;
    });

    return totalSession;
  };

  const getBestTime = () => {
    if (hourStats.length === 0) return "0m";
    let Max = hourStats[0].duration;
    hourStats.map((data) => {
      if (data.duration > Max) {
        Max = data.duration;
      }
    });

    return Max + "m";
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
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
        <div className="flex justify-center gap-0 sm:gap-4 h-[30px] mb-md">
          <ResponsiveButton
            className={`flex justify-center w-1/3 bg-transparent hover:bg-transparent transition-all duration-base  ${
              analyticsButton === "Today"
                ? "bg-white/10 hover:bg-white/10 text-text-active"
                : "text-text-inactive"
            }`}
            onClick={() => setAnalyticsButton("Today")}
          >
            Today
          </ResponsiveButton>
          <ResponsiveButton
            className={`flex justify-center w-1/3 bg-transparent hover:bg-transparent transition-all duration-base  ${
              analyticsButton === "This week"
                ? "bg-white/10 hover:bg-white/10 text-text-active"
                : "text-text-inactive"
            }`}
            onClick={() => setAnalyticsButton("This week")}
          >
            This week
          </ResponsiveButton>
          <ResponsiveButton
            className={`flex justify-center w-1/3 bg-transparent hover:bg-transparent transition-all duration-base  ${
              analyticsButton === "This month"
                ? "bg-white/10 hover:bg-white/10 text-text-active"
                : "text-text-inactive"
            }`}
            onClick={() => setAnalyticsButton("This month")}
          >
            This month
          </ResponsiveButton>
        </div>

        <div className="flex flex-col bg-zinc-900 border border-white/20 rounded-lg mb-md">
          <div className="flex items-center gap-2 sm:gap-6 text-sm mb-6">
            <div className="flex justify-center items-center">
              <ResponsiveButton
                className="text-text-inactive hover:text-text-active bg-zinc-900 hover:bg-zinc-900"
                leftSection={<IconChevronLeft size={20} />}
              ></ResponsiveButton>
              <div className="flex justify-center text-sm font-medium">
                {months.map((month, index) => {
                  const day = new Date().getDate();
                  const monthNumber = new Date().getMonth();
                  if (index == monthNumber) {
                    if (day < 10) {
                      return (
                        <div className="flex justify-between">
                          <p>{month.name + " "}</p>
                          <p className="ml-[2px]">{"0" + day}</p>
                        </div>
                      );
                    }
                    return (
                      <div className="flex justify-between">
                        <p>{month.name + " "}</p>
                        <p className="ml-[2px]">{day}</p>
                      </div>
                    );
                  }
                })}
              </div>
              <ResponsiveButton
                className="text-text-inactive hover:text-text-active bg-zinc-900 hover:bg-zinc-900"
                leftSection={<IconChevronRight size={20} />}
              ></ResponsiveButton>
            </div>
            <div className="flex items-center text-base text-text-inactive text-sm md:text-base">
              <p>Total Time:</p>
              <p className="ml-4 text-text-active">{getTotalTime()}</p>
            </div>
          </div>

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
        </div>

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
          ></ResponsiveButton>
          <div className="text-sm font-medium">
            {months.map((month, index) => {
              const day = new Date().getDate();
              const monthNumber = new Date().getMonth();
              if (index == monthNumber) {
                if (day < 10) {
                  return <p>{month.name + " 0" + day}</p>;
                }
                return <p>{month.name + " " + day}</p>;
              }
            })}
          </div>
          <ResponsiveButton
            className="text-text-inactive hover:text-text-active bg-transparent hover:bg-transparent"
            leftSection={<IconChevronRight size={20} />}
          ></ResponsiveButton>

          <ResponsiveButton onClick={() => setExistSession(!existSession)}>
            Click to change
          </ResponsiveButton>
        </div>

        {existSession ? (
          <div className="relative">
            <div className="absolute left-14 sm:left-24 top-0 bottom-0 border-1 border-white/20 border-dashed"></div>
            <BoxReview time={"8h32"} duration={"3m 50s"} />
            <BoxReview time={"11h04"} duration={"16m 28s"} />
          </div>
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
