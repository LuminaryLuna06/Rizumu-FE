import React from "react";
import RankingBoard from "@rizumu/components/RankingBoard";
import StreakModal from "@rizumu/components/StreakModal";
import ManageFriendModal from "@rizumu/components/ManageFriendModal";

function TestHung() {
  return (
    <div
      className="h-screen"
      style={{ backgroundImage: `url(/image/fuji2.jpg)` }}
    >
      <ManageFriendModal />
    </div>
  );
}

export default TestHung;
