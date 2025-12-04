// import { useAuth } from "@rizumu/context/AuthContext";
import Modal from "../Modal";
import ResponsiveButton from "../ResponsiveButton";
import { IconChartBar, IconList } from "@tabler/icons-react";
import { useState } from "react";

interface ActivitiesModalProps {
  opened: boolean;
  onClose: () => void;
}
function ActivitiesModal({ opened, onClose }: ActivitiesModalProps) {
  // const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"Analytics" | "Review">(
    "Analytics"
  );
  const [analyticsButton, setAnalyticsButton] = useState<
    "Today" | "This week" | "This month"
  >("Today");
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Activities summary"
      className="w-full max-w-[1000px] max-h-[70vh] overflow-y-auto overflow-x-hidden custom-scrollbar scrollbar-hidden"
    >
      <div className="flex w-full mb-xl">
        <ResponsiveButton
          leftSection={<IconChartBar />}
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
        <div className="flex gap-4">
          <ResponsiveButton className={`flex justify-center w-1/3 bg-transparent hover:bg-transparent ${analyticsButton === "Today" ? "bg-white/10 hover:bg-white/10" : ""}`}>Today</ResponsiveButton>
          <ResponsiveButton className={`flex justify-center w-1/3 bg-transparent hover:bg-transparent ${analyticsButton === "This week" ? "bg-white/10 hover:bg-white/10" : ""}`}>This week</ResponsiveButton>
          <ResponsiveButton className={`flex justify-center w-1/3 bg-transparent hover:bg-transparent ${analyticsButton === "This month" ? "bg-white/10 hover:bg-white/10" : ""}`}>This month</ResponsiveButton>
        </div>
      </div>

      {/* Review div */}
      <div className={`${activeTab === "Review" ? "flex" : "hidden"}`}>
        Review
      </div>
    </Modal>
  );
}

export default ActivitiesModal;
