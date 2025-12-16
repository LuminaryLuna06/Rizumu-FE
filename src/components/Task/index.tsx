import React, { useState } from "react";
import Modal from "../Modal";
import EditTask from "../EditTask";
import {
  IconMenu2,
  IconSquare,
  IconPencil,
  IconPlus,
} from "@tabler/icons-react";

const TasksModal = () => {
  const [opened, setOpened] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleOpenEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditOpen(true);
  };

  const HeaderTabs = (
    <div className="flex items-center gap-6 ml-6 text-lg font-semibold">
      <span className="text-gray-500 cursor-pointer hover:text-gray-300 transition-colors">
        Events
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-primary/5 p-4">
      <button
        onClick={() => setOpened(true)}
        className="px-4 py-2 bg-white text-black rounded font-bold"
      >
        Open Tasks List
      </button>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Tasks"
        more={HeaderTabs}
        className="bg-[#121212] !text-white !max-w-[600px] border-none"
      >
        <div className="flex flex-col gap-4 font-sans">
          {/* Item Task */}
          <div className="group relative flex items-center bg-[#1c1c1e] p-4 rounded-xl border border-transparent hover:border-gray-700 transition-all cursor-pointer">
            <IconMenu2 size={20} className="text-gray-500 mr-4 cursor-move" />

            <div className="mr-4 text-gray-500 hover:text-white transition-colors">
              <IconSquare size={24} stroke={1.5} />
            </div>

            <div className="flex-1">
              <span className="text-white text-base">hhh</span>
            </div>

            {/* --- Enter this icon to open EditTask --- */}
            <IconPencil
              size={18}
              onClick={handleOpenEdit}
              className="text-gray-500 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-white"
            />
          </div>

          <button className="w-full py-4 border border-dashed border-gray-700 hover:bg-gray-800/50 hover:border-gray-500 text-white rounded-xl flex items-center justify-center gap-2 transition-all mt-2">
            <IconPlus size={20} />
            <span className="font-medium">New task</span>
          </button>

          <div className="mt-4 text-center">
            <p className="text-gray-500 text-sm">
              Add up to 3 tasks.{" "}
              <span className="hover:underline cursor-pointer">
                Upgrade to Plus to add more.
              </span>
            </p>
          </div>
        </div>
      </Modal>
      <EditTask opened={isEditOpen} onClose={() => setIsEditOpen(false)} />
    </div>
  );
};

export default TasksModal;
