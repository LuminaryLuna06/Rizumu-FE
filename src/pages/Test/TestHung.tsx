import React from "react";
import RankingBoard from "@rizumu/components/RankingBoard";
import StreakModal from "@rizumu/components/StreakModal";

function TestHung() {
  return (
    <div
      className="h-screen"
      style={{ backgroundImage: `url(/public/fuji2.jpg)` }}
    >
      <StreakModal />
    </div>
  );
}

export default TestHung;
