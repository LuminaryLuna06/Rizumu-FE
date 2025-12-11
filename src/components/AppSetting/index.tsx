import React, { useState } from "react";
import Modal from "../Modal";
import Switch from "../Switch";

function AppSetting() {
  const [opened, setOpened] = useState(false);
  const [activeTab, setActiveTab] = useState<"Allow List" | "Block List">(
    "Allow List"
  );
  return (
    <div>
      <button
        onClick={() => setOpened(true)}
        className="bg-primary/10 text-white px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors"
      >
        Open App Setting
      </button>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Settings"
        className="!max-w-[700px] text-white overflow-y-auto [&::-webkit-scrollbar]:hidden"
      >
        {/* Timer */}
        <div className="text-left">Timer</div>
        <hr className="h-[1px] bg-gray mb-4 mt-1" />

        <div className="flex justify-between items-center mt-3">
          <p>Auto Start Break</p>
          <Switch labelPosition="right" />
        </div>
        <div className="flex justify-between items-center mt-5">
          <p>Auto Start Pomodoro</p>
          <Switch labelPosition="right" />
        </div>
        <div className="flex justify-between items-center mt-5">
          <p>Long Break Interval</p>
        </div>
        <div className="flex justify-between items-center mt-5">
          <div className="flex flex-col">
            <p>Auto mini timer</p>
            <p className="text-xs">
              Show the mini timer when you switch away from StudyFoc.us.
            </p>
          </div>
          <Switch labelPosition="right" />
        </div>
        <div className="flex justify-between items-center mt-5">
          <div className="flex flex-col">
            <p>24-Hour Clock</p>
            <p className="text-xs">
              Switches the click between 12-hour and 24-hour format
            </p>
          </div>
          <Switch labelPosition="right" />
        </div>

        {/* Sound */}
        <div className="text-left mt-10">Sound</div>
        <hr className="h-[1px] bg-gray mt-1 mb-4" />

        <div className="flex justify-between items-center mt-5">
          <p>Ticking sound</p>
          <Switch labelPosition="right" />
        </div>

        <div className="flex justify-between items-center mt-5">
          <p>Volume</p>
        </div>

        <div className="flex justify-between items-center mt-5">
          <p>Ticking speed</p>
        </div>

        {/* Alarm sound */}
        <div className="text-left mt-10">Alarm Sound</div>
        <hr className="h-[1px] bg-gray mt-1 mb-4" />

        <div className="flex justify-between items-center mt-5">
          <p>Alarm enabled</p>
          <Switch labelPosition="right" />
        </div>

        <div className="flex justify-between items-center mt-5">
          <p>Alarm Sounds</p>
        </div>

        <div className="flex justify-between items-center mt-5">
          <p>Volume</p>
        </div>

        <div className="flex justify-between items-center mt-5">
          <p>Repeat</p>
        </div>

        {/* Motivation */}
        <div className="text-left mt-10">Motivation</div>
        <hr className="h-[1px] bg-gray mt-1 mb-4" />

        <div className="flex justify-between items-center mt-5">
          <p>Show Widget</p>
          <Switch labelPosition="right" />
        </div>
      </Modal>
    </div>
  );
}

export default AppSetting;
