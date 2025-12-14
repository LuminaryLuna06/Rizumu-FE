import React from "react";
import RankingBoard from "@rizumu/components/RankingBoard";
import StreakModal from "@rizumu/components/StreakPopover";
import ManageFriendModal from "@rizumu/components/ManageFriendModal";
import FindStudyRoomModal from "@rizumu/components/FindStudyRoomModal";
import AppSetting from "@rizumu/components/AppSetting";
import EditTask from "@rizumu/components/EditTask";
import Task from "@rizumu/components/Task";

function TestHung() {
  return (
    <div
      className="h-screen"
      style={{ backgroundImage: `url(/image/fuji2.jpg)` }}
    >
      <Task />
    </div>
  );
}

export default TestHung;
