import axiosClient from "@rizumu/api/config/axiosClient";
import ActivitiesModal from "@rizumu/components/ActivitiesModal";
import Modal from "@rizumu/components/Modal";
import Popover from "@rizumu/components/Popover";
import ProfileModal from "@rizumu/components/ProfileModal";
import ResponsiveButton from "@rizumu/components/ResponsiveButton";
import TextInput from "@rizumu/components/TextInput";
import { useAuth } from "@rizumu/context/AuthContext";
import { IconMessage, IconSend2, IconUsers } from "@tabler/icons-react";
import { useState } from "react";

function TestHieu() {
  const { user, refreshUser } = useAuth();
  const [opened, setOpened] = useState(false);
  const [profileOpened, setProfileOpened] = useState(false);
  const [activitiesOpened, setActivitiesOpened] = useState(false);
  const [chatOpened, setChatOpened] = useState(false);
  const [message, setMessage] = useState("");

  const getHourStats = async () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const date = new Date().getDate();

    const startTime = new Date(year, month, date, 0, 0, 0, 0).toISOString();
    const endTime = new Date(year, month, date, 23, 59, 59, 999).toISOString();

    const response = await axiosClient.get(
      `/session/hourly?startTime=${startTime}&endTime=${endTime}&userId=${user?._id}`
    );
    console.log(response.data);
  };

  return (
    <div>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => setOpened(true)}
      >
        Open Modal
      </button>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Demo Modal"
      >
        <p>This is a basic modal content.</p>
      </Modal>

      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => {
          setProfileOpened(true);
          refreshUser();
        }}
      >
        Test Profile
      </button>

      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => {
          setActivitiesOpened(true);
          refreshUser();
        }}
      >
        Test Activity
      </button>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => getHourStats()}
      >
        Test
      </button>
      <Popover
        trigger={
          <ResponsiveButton leftSection={<IconMessage />}></ResponsiveButton>
        }
        opened={chatOpened}
        onClose={() => setChatOpened(!chatOpened)}
        position="bottom-left"
      >
        <div className="flex items-center justify-center bg-black/70 backdrop-blur-xl text-secondary rounded-3xl shadow-2xl p-md border border-gray-800 font-poppins overflow-y-hidden overflow-x-hidden">
          <div className="flex flex-col w-full">
            <div className="flex justify-between mb-2 w-full">
              <h2 className="text-lg font-semibold">Chat</h2>
              <div className="flex items-center gap-2 text-text-inactive">
                <IconUsers size={14} />
                <p className="text-sm">2 members</p>
              </div>
            </div>
            <div className="flex flex-col items-start max-h-[350px] min-h-[250px] overflow-y-auto overflow-x-hidden custom-scrollbar scrollbar-hidden">
              <div className="flex flex-col h-[50px] mb-sm">
                <div className="flex items-center gap-1">
                  <h2 className="text-lg font-bold">Sinon:</h2>
                  <p className="text-white/80">Test chat</p>
                </div>
                <p className="text-text-inactive text-sm">5m ago</p>
              </div>
              <div className="flex flex-col mb-sm">
                <p className="text-text-inactive text-sm">
                  Sinon just started a session!
                </p>
              </div>
              <div className="flex flex-col mb-sm">
                <p className="text-text-inactive text-sm">
                  Wazzup is now in focus mode!
                </p>
              </div>
              <div className="flex flex-col mb-sm">
                <p className="text-text-inactive text-sm">
                  Sinon is getting things done!
                </p>
              </div>
              <div className="flex flex-col h-[50px] mb-sm">
                <div className="flex items-center gap-1">
                  <h2 className="text-lg font-bold">Sinon:</h2>
                  <p className="text-white/80">Do sth</p>
                </div>
                <p className="text-text-inactive text-sm">4 minuutes ago</p>
              </div>
              <div className="flex flex-col h-[50px] mb-sm">
                <div className="flex items-center gap-1">
                  <h2 className="text-lg font-bold">Sinon:</h2>
                  <p className="text-white/80">Ready to start</p>
                </div>
                <p className="text-text-inactive text-sm">4 minutes ago</p>
              </div>
              <div className="flex flex-col mb-xs">
                <p className="text-text-inactive text-sm">Sinon kicked off!</p>
              </div>
              <div className="flex flex-col h-[50px] mb-sm">
                <div className="flex items-center gap-1">
                  <h2 className="text-lg font-bold">Wazzup:</h2>
                  <p className="text-white/80">R U OK</p>
                </div>
                <p className="text-text-inactive text-sm">3 minutes ago</p>
              </div>
              <div className="flex flex-col h-[50px] mb-sm">
                <div className="flex items-center gap-1">
                  <h2 className="text-lg font-bold">Sinon:</h2>
                  <p className="text-white/80">Not good :)</p>
                </div>
                <p className="text-text-inactive text-sm">2 minutes ago</p>
              </div>
              <div className="flex flex-col h-[50px] mb-sm">
                <div className="flex items-center gap-1">
                  <h2 className="text-lg font-bold">Wazzup:</h2>
                  <p className="text-white/80">:)))))</p>
                </div>
                <p className="text-text-inactive text-sm">a minute ago</p>
              </div>
              <div className="flex flex-col mb-sm">
                <p className="text-text-inactive text-sm">
                  Sinon just started a session!
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <TextInput
                placeholder="Type a message"
                className="w-9/10"
                onChange={(e: any) => setMessage(e.target.value)}
              />
              <ResponsiveButton
                leftSection={<IconSend2 size={25} />}
                disabled={message.length <= 0 || message.trim() === ""}
              ></ResponsiveButton>
            </div>
          </div>
        </div>
      </Popover>

      <ProfileModal
        opened={profileOpened}
        onClose={() => setProfileOpened(false)}
        onOpenProfile={() => setProfileOpened(true)}
      />
      <ActivitiesModal
        opened={activitiesOpened}
        onClose={() => setActivitiesOpened(false)}
      />
    </div>
  );
}
export const data = {
  // December 2025
  "2025-12-30": 3,
  "2025-12-28": 2,
  "2025-12-26": 4,
  "2025-12-24": 1,
  "2025-12-22": 3,
  "2025-12-20": 2,
  "2025-12-18": 4,
  "2025-12-15": 2,
  "2025-12-12": 3,
  "2025-12-10": 1,
  "2025-12-08": 2,
  "2025-12-05": 4,
  "2025-12-03": 3,
  "2025-12-01": 2,

  // November 2025
  "2025-11-28": 4,
  "2025-11-26": 2,
  "2025-11-24": 3,
  "2025-11-22": 1,
  "2025-11-20": 4,
  "2025-11-18": 2,
  "2025-11-15": 3,
  "2025-11-13": 2,
  "2025-11-10": 4,
  "2025-11-08": 1,
  "2025-11-06": 3,
  "2025-11-04": 2,
  "2025-11-01": 4,

  // October 2025
  "2025-10-30": 3,
  "2025-10-28": 2,
  "2025-10-25": 4,
  "2025-10-23": 1,
  "2025-10-21": 3,
  "2025-10-18": 2,
  "2025-10-16": 4,
  "2025-10-14": 3,
  "2025-10-11": 2,
  "2025-10-09": 1,
  "2025-10-07": 4,
  "2025-10-04": 3,
  "2025-10-02": 2,

  // September 2025
  "2025-09-29": 4,
  "2025-09-27": 2,
  "2025-09-25": 3,
  "2025-09-23": 1,
  "2025-09-20": 4,
  "2025-09-18": 2,
  "2025-09-16": 3,
  "2025-09-13": 4,
  "2025-09-11": 2,
  "2025-09-09": 1,
  "2025-09-06": 3,
  "2025-09-04": 2,
  "2025-09-01": 4,

  // August 2025
  "2025-08-29": 3,
  "2025-08-27": 2,
  "2025-08-25": 4,
  "2025-08-22": 1,
  "2025-08-20": 3,
  "2025-08-18": 2,
  "2025-08-15": 4,
  "2025-08-13": 3,
  "2025-08-11": 2,
  "2025-08-08": 1,
  "2025-08-06": 4,
  "2025-08-04": 3,
  "2025-08-01": 2,

  // July 2025
  "2025-07-30": 4,
  "2025-07-28": 2,
  "2025-07-25": 3,
  "2025-07-23": 1,
  "2025-07-21": 4,
  "2025-07-18": 2,
  "2025-07-16": 3,
  "2025-07-14": 4,
  "2025-07-11": 2,
  "2025-07-09": 1,
  "2025-07-07": 3,
  "2025-07-04": 2,
  "2025-07-02": 4,

  // June 2025
  "2025-06-28": 3,
  "2025-06-26": 2,
  "2025-06-24": 4,
  "2025-06-21": 1,
  "2025-06-19": 3,
  "2025-06-17": 2,
  "2025-06-14": 4,
  "2025-06-12": 3,
  "2025-06-10": 2,
  "2025-06-07": 1,
  "2025-06-05": 4,
  "2025-06-03": 3,
  "2025-06-01": 2,

  // May 2025
  "2025-05-30": 4,
  "2025-05-28": 2,
  "2025-05-26": 3,
  "2025-05-23": 1,
  "2025-05-21": 4,
  "2025-05-19": 2,
  "2025-05-16": 3,
  "2025-05-14": 4,
  "2025-05-12": 2,
  "2025-05-09": 1,
  "2025-05-07": 3,
  "2025-05-05": 2,
  "2025-05-02": 4,

  // April 2025
  "2025-04-29": 3,
  "2025-04-27": 2,
  "2025-04-25": 4,
  "2025-04-23": 1,
  "2025-04-20": 3,
  "2025-04-18": 2,
  "2025-04-16": 4,
  "2025-04-13": 3,
  "2025-04-11": 2,
  "2025-04-09": 1,
  "2025-04-06": 4,
  "2025-04-04": 3,
  "2025-04-01": 2,

  // March 2025
  "2025-03-30": 4,
  "2025-03-28": 2,
  "2025-03-26": 3,
  "2025-03-24": 1,
  "2025-03-21": 4,
  "2025-03-19": 2,
  "2025-03-17": 3,
  "2025-03-14": 4,
  "2025-03-12": 2,
  "2025-03-10": 1,
  "2025-03-07": 3,
  "2025-03-05": 2,
  "2025-03-03": 4,
  "2025-03-01": 3,

  // February 2025
  "2025-02-27": 2,
  "2025-02-25": 4,
  "2025-02-23": 1,
  "2025-02-21": 3,
  "2025-02-19": 2,
  "2025-02-17": 4,
  "2025-02-14": 3,
  "2025-02-12": 2,
  "2025-02-10": 1,
  "2025-02-07": 4,
  "2025-02-05": 3,
  "2025-02-03": 2,
  "2025-02-01": 4,

  // January 2025
  "2025-01-31": 4,
  "2025-01-30": 2,
  "2025-01-29": 3,
  "2025-01-26": 2,
  "2025-01-25": 2,
  "2025-01-24": 2,
  "2025-01-23": 2,
  "2025-01-20": 3,
  "2025-01-19": 2,
  "2025-01-17": 3,
  "2025-01-16": 2,
  "2025-01-14": 3,
  "2025-01-08": 2,
  "2025-01-07": 1,
  "2025-01-05": 3,
  "2025-01-04": 1,
  "2025-01-03": 1,
  "2025-01-01": 2,
};

export default TestHieu;
