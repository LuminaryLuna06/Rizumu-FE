import { useToast } from "@rizumu/utils/toast/toast";
import { useEffect, useState } from "react";

function testTranh2() {
  const [duration, setDuration] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3);
  const [running, setRunning] = useState(false);
  const [payload, setPayload] = useState({
    startDate: new Date().toISOString(),
    duration: 0,
    endDate: "",
  });

  useEffect(() => {
    if (running) {
      const interval = setInterval(() => {
        setDuration((duration) => duration + 1);
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [running]);

  return (
    <div>
      <h1>Timer: {timeLeft} seconds</h1>
      <h2>Duration: {duration} seconds</h2>
      <button
        onClick={() => {
          setRunning(!running);
        }}
      >
        Run
      </button>
    </div>
  );
}

export default testTranh2;
