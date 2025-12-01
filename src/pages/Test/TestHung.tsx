import UserMenu from "@rizumu/components/UserMenu";
import React from "react";
import fuji2 from "@rizumu/assets/image/fuji2.jpg";

function TestHung() {
  return (
    <div className="h-screen" style={{ backgroundImage: `url(${fuji2})` }}>
      <UserMenu></UserMenu>
    </div>
  );
}

export default TestHung;
