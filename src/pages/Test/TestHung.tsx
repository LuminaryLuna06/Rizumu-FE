import UserMenu from "@rizumu/components/UserMenu";
import React from "react";
import fuji2 from "@rizumu/assets/image/fuji2.jpg";
import RankingBoard from "@rizumu/components/RankingBoard";

function TestHung() {
  return (
    <div className="h-screen" style={{ backgroundImage: `url(${fuji2})` }}>
      <RankingBoard />
      <RankingBoard />
    </div>
  );
}

export default TestHung;
