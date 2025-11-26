import React from "react";
import ResponsiveButton from "@rizumu/components/ResponsiveButton";
import { IconPlayCard } from "@tabler/icons-react";

function PomodoroPage() {
  return (
    <>
      <ResponsiveButton leftSection={<IconPlayCard />} onClick={() => null}>
        Start .......
      </ResponsiveButton>
    </>
  );
}

export default PomodoroPage;
