import React from "react";
import RankingBoard from "@rizumu/components/RankingBoard";
import StreakModal from "@rizumu/components/StreakModal";
import ManageFriendModal from "@rizumu/components/ManageFriendModal";
import FindStudyRoomModal from "@rizumu/components/FindStudyRoomModal";

function TestHung() {
  return (
    <div
      className="h-screen"
      style={{ backgroundImage: `url(/image/fuji2.jpg)` }}
    >
      <FindStudyRoomModal />
    </div>
  );
}

export default TestHung;
