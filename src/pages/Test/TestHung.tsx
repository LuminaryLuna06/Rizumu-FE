import React from "react";
import fuji2 from "@rizumu/assets/image/fuji2.jpg";
import RankingBoard from "@rizumu/components/RankingBoard";
import StreakModal from "@rizumu/components/StreakModal";
import ManageFrinedModal from "@rizumu/components/ManageFriendModal";

function TestHung() {
  return (
    <div className="h-screen" style={{ backgroundImage: `url(${fuji2})` }}>
      <ManageFrinedModal />
    </div>
  );
}

export default TestHung;
