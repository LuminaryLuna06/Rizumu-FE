import Header from "./components/Header";
import Footer from "./components/Footer";
import Timer from "./components/Timer";
import { useAuth } from "@rizumu/context/AuthContext";
import { useEffect, useState } from "react";
import axiosClient from "@rizumu/api/config/axiosClient";

function PomodoroPage() {
  const { user } = useAuth();
  const [background, setBackground] = useState({
    name: "/image/fuji.webp",
    type: "static",
  });
  const [totalTime, setTotalTime] = useState(0);
  const [shouldFetch, setShouldFetch] = useState(false);

  const fetchTotalTime = async () => {
    if (!user?._id) return;
    let total = 0;
    try {
      const year = new Date().getFullYear();
      const month = new Date().getMonth();
      const date = new Date().getDate();

      const startTime = new Date(year, month, date, 0, 0, 0, 0).toISOString();
      const endTime = new Date(
        year,
        month,
        date,
        23,
        59,
        59,
        999
      ).toISOString();

      const response = await axiosClient.get(
        `/session/hourly?startTime=${startTime}&endTime=${endTime}&userId=${user?._id}`
      );
      console.log(response.data);
      response.data.forEach((data: number) => {
        total += data;
      });
      setTotalTime(Math.floor(total));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (shouldFetch) {
      fetchTotalTime();
      setShouldFetch(false);
    }
  }, [shouldFetch]);

  useEffect(() => {
    if (user?.current_room_id) {
      fetchTotalTime();
      axiosClient
        .get(`/room/id/${user.current_room_id}`)
        .then((res) => {
          if (res.data?.background) {
            setBackground(res.data.background);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [user?.current_room_id, user]);

  const handleBackgroundChange = (bg: { name: string; type: string }) => {
    setBackground(bg);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen w-full overflow-hidden px-md md:px-xl text-secondary font-light text-sm z-base">
        {background.type === "static" ? (
          <div
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center -z-10"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${background.name})`,
            }}
          />
        ) : (
          <video
            src={background.name}
            autoPlay
            muted
            loop
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover -z-10"
          />
        )}

        {/* Header */}
        <Header totalTime={totalTime} />
        {/* Main Content */}
        <Timer
          bgType={background.type}
          bgName={background.name}
          onSessionComplete={() => setShouldFetch(true)}
        />
        {/* Footer */}
        <Footer onBackgroundChange={handleBackgroundChange} />
      </div>
    </>
  );
}

export default PomodoroPage;
