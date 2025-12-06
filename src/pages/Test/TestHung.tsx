import React from "react";
import RankingBoard from "@rizumu/components/RankingBoard";
import StreakModal from "@rizumu/components/StreakModal";
import ManageFrinedModal from "@rizumu/components/ManageFriendModal";

function TestHung() {
  return (
    <div
      className="h-screen"
      style={{ backgroundImage: `url(/image/fuji2.jpg)` }}
    >
      <ManageFrinedModal />
    </div>
  );
}

export default TestHung;
