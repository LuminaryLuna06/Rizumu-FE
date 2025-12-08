import React, { useState } from "react";
import Modal from "../Modal";
import { IconArrowRight, IconLibrary } from "@tabler/icons-react";

type StudyRoom = {
  id: string;
  name: string;
  about: string;
  members: string[];
  host: string;
};

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
  },
  {
    id: "4",
    name: "Nam Anh",
    about: "—",
    members: ["https://ui-avatars.com/api/?name=Komei&bg=000&color=fff"],
    host: "NCKH",
  },
  {
    id: "5",
    name: "ABC",
    about: "studying math",
    members: ["https://ui-avatars.com/api/?name=Prag&bg=000&color=fff"],
    host: "zzzz",
  },
];

function FindStudyRoomModal() {
  const [opened, setOpened] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpened(true)}
        className="bg-primary/10 text-white px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors"
      >
        Open Study Rooms
      </button>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title=""
        className="!max-w-[900px] text-white"
      >
        {/* --- Header --- */}
        <div className="-mt-7 mb-6">
          <div className="flex items-center justify-start gap-3 mb-2">
            <IconLibrary />
            <p className="font-bold text-2xl">Public Study Rooms</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm pl-1">
              Jump into a public room and focus together.
            </p>
          </div>
        </div>

        {/* --- Content --- */}
        <div className="grid grid-cols-12 gap-2 text-gray-500 font-bold text-sm mb-3 px-3">
          <div className="col-span-5 md:col-span-3">Name</div>
          <div className="hidden md:block md:col-span-3">About</div>
          <div className="col-span-4 md:col-span-2">Members</div>
          <div className="hidden md:block md:col-span-2">Host</div>
          <div className="col-span-3 md:col-span-2"></div>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto [&::-webkit-scrollbar]:hidden px-1">
          {ROOMS_DATA.map((room) => (
            <div
              key={room.id}
              className="group bg-white/5 hover:bg-white/10 grid grid-cols-12 gap-2 items-center p-3 rounded-xl hover:bg-primary/5 transition-colors border border-transparent hover:border-white/5"
            >
              <div className="col-span-5 md:col-span-3 font-semibold text-white truncate pr-2">
                {room.name}
              </div>
              <div className="hidden md:block md:col-span-3 text-gray-400 text-sm truncate pr-2">
                {room.about}
              </div>
              <div className="col-span-4 md:col-span-2 flex items-center">
                <div className="flex items-center pl-2">
                  {room.members.slice(0, 3).map((avatar, index) => (
                    <img
                      key={index}
                      src={avatar}
                      alt="member"
                      className="w-8 h-8 rounded-full border-2 -ml-3 first:ml-0 object-cover bg-gray-800"
                    />
                  ))}
                  {room.members.length > 3 && (
                    <div className="w-8 h-8 rounded-full border-2 -ml-3 bg-gray-800 flex items-center justify-center text-[10px] font-bold text-white z-10">
                      +{room.members.length - 3}
                    </div>
                  )}
                </div>
              </div>
              <div className="hidden md:block md:col-span-2 text-gray-400 text-sm truncate">
                {room.host}
              </div>
              <div className="col-span-3 md:col-span-2 flex justify-end">
                <button className="flex items-center gap-1 px-3 md:px-5 py-1.5 md:py-2 rounded-full bg-primary/10 hover:bg-primary/20 text-white text-xs md:text-sm font-semibold transition-all border border-white/5 whitespace-nowrap">
                  Join <IconArrowRight size={14} className="hidden sm:block" />{" "}
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
