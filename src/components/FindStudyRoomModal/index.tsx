import React, { useState } from "react";
import Modal from "../Modal";
import { IconStack2, IconArrowRight, IconLibrary } from "@tabler/icons-react";

// 1. Định nghĩa kiểu dữ liệu cho phòng học
type StudyRoom = {
  id: string;
  name: string;
  about: string;
  members: string[];
  host: string;
  studyTime: string;
};

// 2. Dữ liệu mẫu giống trong ảnh
const ROOMS_DATA: StudyRoom[] = [
  {
    id: "1",
    name: "Hưng",
    about: "studying toeic",
    members: [
      "https://ui-avatars.com/api/?name=Blue&bg=0D8ABC&color=fff",
      "https://ui-avatars.com/api/?name=User2&bg=random",
      "https://ui-avatars.com/api/?name=User3&bg=random",
      "https://ui-avatars.com/api/?name=User4&bg=random",
      "https://ui-avatars.com/api/?name=User5&bg=random",
    ],
    host: "Hưng",
    studyTime: "92h 32m",
  },
  {
    id: "2",
    name: "Trọng Anh",
    about: "—",
    members: [
      "https://ui-avatars.com/api/?name=Zhi&bg=teal&color=fff",
      "https://ui-avatars.com/api/?name=Whale&bg=blue",
      "https://ui-avatars.com/api/?name=Y&bg=000&color=fff",
    ],
    host: "Tranh",
    studyTime: "12h 44m",
  },
  {
    id: "3",
    name: "An",
    about: "—",
    members: [
      "https://ui-avatars.com/api/?name=Abby&bg=pink&color=fff",
      "https://ui-avatars.com/api/?name=Girl&bg=black&color=fff",
    ],
    host: "An",
    studyTime: "1h 40m",
  },
  {
    id: "4",
    name: "Nam Anh",
    about: "—",
    members: ["https://ui-avatars.com/api/?name=Komei&bg=000&color=fff"],
    host: "NCKH",
    studyTime: "14h 39m",
  },
  {
    id: "5",
    name: "ABC",
    about: "studying math",
    members: ["https://ui-avatars.com/api/?name=Prag&bg=000&color=fff"],
    host: "zzzz",
    studyTime: "31h 26m",
  },
];

function FindStudyRoomModal() {
  const [opened, setOpened] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpened(true)}
        className="bg-primary/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
      >
        Open Study Rooms
      </button>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title=""
        className="!max-w-[1000px] text-white"
      >
        {/* --- Header --- */}
        <div className="-mt-7 mb-3">
          <div className="flex items-center justify-start gap-3 mb-2">
            <IconLibrary />
            <p className="font-bold text-2xl">Public Study Room</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm pl-1">
              Jump into a public room and focus together.
            </p>
          </div>
        </div>

        {/* --- Content --- */}
        <div className="hidden md:grid grid-cols-12 gap-4 text-gray-500 font-semibold text-sm mb-4 px-2">
          <div className="col-span-3">Name</div>
          <div className="col-span-3">About</div>
          <div className="col-span-2">Members</div>
          <div className="col-span-2">Host</div>
          <div className="col-span-2">Study Time</div>
        </div>

        <div className="space-y-1 max-h-[60vh] overflow-y-auto [&::-webkit-scrollbar]:hidden px-1">
          {ROOMS_DATA.map((room) => (
            <div
              key={room.id}
              className="group flex flex-col custom-scrollbar md:grid md:grid-cols-12 md:gap-4 items-center p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
            >
              <div className="col-span-3 font-semibold text-white w-full">
                {room.name}
              </div>

              <div className="col-span-3 text-gray-400 text-sm truncate w-full">
                {room.about}
              </div>

              <div className="col-span-2 flex items-center w-full my-2 md:my-0">
                <div className="flex items-center pl-2">
                  {room.members.slice(0, 3).map((avatar, index) => (
                    <img
                      key={index}
                      src={avatar}
                      alt="member"
                      className="w-8 h-8 rounded-full border-2 border-[#121212] -ml-2 first:ml-0 object-cover bg-gray-800"
                    />
                  ))}
                  {room.members.length > 3 && (
                    <div className="w-8 h-8 rounded-full border-2 border-[#121212] -ml-2 bg-gray-800 flex items-center justify-center text-[10px] font-bold text-white">
                      +{room.members.length - 3}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-2 text-gray-400 text-sm w-full">
                {room.host}
              </div>

              <div className="col-span-2 flex items-center justify-between w-full mt-2 md:mt-0">
                <span className="text-gray-300 font-medium text-sm">
                  {room.studyTime}
                </span>

                <button className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/5">
                  Join <IconArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}

export default FindStudyRoomModal;
