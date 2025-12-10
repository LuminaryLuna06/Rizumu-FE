import React, { useState } from "react";
import Modal from "../Modal";
import {
  IconTag,
  IconClock,
  IconList,
  IconLink,
  IconCalculator,
  IconNotes,
  IconPlus,
  IconMinus,
  IconChevronDown,
} from "@tabler/icons-react";

function EditTask() {
  const [opened, setOpened] = useState(false);
  const [counterValue, setCounterValue] = useState(0);
  const [counterTotal, setCounterTotal] = useState(0);

  return (
    <div className="p-10 min-h-screen">
      <button
        onClick={() => setOpened(true)}
        className="bg-primary/10 text-white px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors"
      >
        Open Edit Task
      </button>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title=""
        className="!max-w-[700px] text-white overflow-y-auto [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex flex-col gap-6 font-sans">
          {/* --- Checkbox & Title --- */}
          <div className="flex items-center gap-3 -mt-2">
            <div className="relative flex items-center justify-center w-6 h-6 border border-gray-600 rounded hover:border-gray-400 cursor-pointer transition">
              <input
                type="checkbox"
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
              />
            </div>
            <h1 className="text-2xl font-bold text-white">hhh</h1>
          </div>

          {/* --- Tag & Deadline --- */}
          <div className="grid grid-cols-2 gap-4">
            {/* Tag */}
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <IconTag size={14} /> Tag
              </div>
              <button className="flex items-center justify-between w-full px-4 py-3 bg-[#111] border border-gray-800 rounded-xl hover:bg-[#1a1a1a] transition text-sm text-gray-300">
                <span className="flex items-center gap-2">
                  <IconTag size={16} /> Edit
                </span>
                <IconChevronDown size={16} className="text-gray-500" />
              </button>
            </div>

            {/* Deadline */}
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <IconClock size={14} /> Deadline
              </div>
              <button className="flex items-center w-full px-4 py-3 bg-[#111] border border-gray-800 rounded-xl hover:bg-[#1a1a1a] transition text-sm text-gray-300">
                <IconClock size={16} className="mr-2" /> Set deadline
              </button>
            </div>
          </div>

          {/* --- Subtasks Section --- */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <IconList size={14} /> Sub tasks
            </div>
            <div className="flex items-center gap-3 px-1 py-2 cursor-pointer group">
              <div className="w-5 h-5 border border-gray-700 rounded group-hover:border-gray-500 transition"></div>
              <span className="text-gray-400 group-hover:text-gray-200 transition">
                Add a new subtask
              </span>
            </div>
          </div>

          {/* --- Links Section --- */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <IconLink size={14} /> Links
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Link name (optional)"
                className="flex-1 bg-[#111] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 transition"
              />
              <div className="flex flex-[2] bg-[#111] border border-gray-800 rounded-xl px-4 py-3 items-center">
                <span className="text-gray-500 text-sm mr-2">URL</span>
                <input
                  type="text"
                  placeholder="Paste link"
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none"
                />
              </div>
              <button className="p-3 bg-[#111] border border-gray-800 rounded-xl hover:bg-[#222] text-gray-400 transition">
                <IconPlus size={20} />
              </button>
            </div>
          </div>

          {/* --- Counter Section --- */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <IconCalculator size={14} /> Counter
            </div>
            <div className="grid grid-cols-3 gap-4">
              {/* Value */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Value
                </label>
                <div className="flex items-center justify-between bg-[#111] border border-gray-800 rounded-xl px-2 py-2">
                  <button
                    onClick={() => setCounterValue((prev) => prev - 1)}
                    className="p-1 text-gray-500 hover:text-white transition"
                  >
                    <IconMinus size={16} />
                  </button>
                  <span className="text-white font-medium">{counterValue}</span>
                  <button
                    onClick={() => setCounterValue((prev) => prev + 1)}
                    className="p-1 text-gray-500 hover:text-white transition"
                  >
                    <IconPlus size={16} />
                  </button>
                </div>
              </div>

              {/* Total */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Total
                </label>
                <div className="flex items-center justify-between bg-[#111] border border-gray-800 rounded-xl px-2 py-2">
                  <button
                    onClick={() => setCounterTotal((prev) => prev - 1)}
                    className="p-1 text-gray-500 hover:text-white transition"
                  >
                    <IconMinus size={16} />
                  </button>
                  <span className="text-white font-medium">{counterTotal}</span>
                  <button
                    onClick={() => setCounterTotal((prev) => prev + 1)}
                    className="p-1 text-gray-500 hover:text-white transition"
                  >
                    <IconPlus size={16} />
                  </button>
                </div>
              </div>

              {/* Type */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Type</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-[#111] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none cursor-pointer">
                    <option>Select type</option>
                    <option>Number</option>
                    <option>Currency</option>
                  </select>
                  <IconChevronDown
                    size={16}
                    className="absolute right-3 top-3 text-gray-500 pointer-events-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* --- Notes Section --- */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <IconNotes size={14} /> Notes
            </div>
            <textarea
              placeholder="Add notes..."
              rows={3}
              className="w-full bg-transparent border-none text-white placeholder-gray-600 focus:outline-none resize-none text-sm"
            ></textarea>
          </div>

          {/* --- Footer Buttons --- */}
          <div className="flex justify-end items-center gap-4 mt-4 pt-4 border-t border-gray-900 sticky bottom-0 z-10">
            <button
              onClick={() => setOpened(false)}
              className="px-6 py-2 text-white hover:text-gray-300 font-medium transition sticky"
            >
              Cancel
            </button>
            <button
              onClick={() => console.log("Saved")}
              className="px-8 py-2 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition sticky"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default EditTask;
