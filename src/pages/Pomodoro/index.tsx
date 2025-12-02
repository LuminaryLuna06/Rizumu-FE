import React from "react";
import {
  IconClockHour11Filled,
  IconFlag,
  IconPlayerSkipForwardFilled,
} from "@tabler/icons-react";
import fujiImg from "@rizumu/assets/image/fuji2.jpg";
import Header from "./components/Header";
import Footer from "./components/Footer";

function PomodoroPage() {
  return (
    <div
      className="bg-primary-light px-xl text-secondary bg-center z-base font-light text-sm"
      style={{ backgroundImage: `url(${fujiImg})` }}
    >
      {/* Header */}
      <Header />
      {/* Main Content */}
      <div className="main-content flex flex-col justify-center items-center gap-y-xs h-[82vh]">
        <a
          href="/#/pomodoro"
          className="bg-primary-light rounded-xl px-xl py-xs hover:bg-primary-secondary-hover transition-colors duration-300 ease-in-out cursor-pointer"
        >
          Select a tag
        </a>

        <div className="flex gap-x-xl items-center mt-10">
          <div className="w-8 h-8 rounded-full bg-secondary"></div>
          <div className="w-7 h-7 hover:w-8 hover:h-8 hover:bg-secondary rounded-full bg-secondary/60 transition-all duration-slow"></div>
          <div className="w-7 h-7 hover:w-8 hover:h-8 hover:bg-secondary rounded-full bg-secondary/60 transition-all duration-slow"></div>
        </div>

        <p className="leading-tight md:text-[10em] text-[6em] font-extrabold tracking-[0.07em] transition-all duration-slower ease-in-out">
          25:00
        </p>
        <button className="flex justify-center items-center gap-x-xs text-normal">
          <IconFlag size={20} />
          <p>Website</p>
        </button>
        <div className="flex items-center justify-center gap-x-xl cursor-pointer">
          <IconClockHour11Filled />
          <button className="px-lg py-lg w-[140px] md:w-[200px] md:text-lg md:px-lg md:py-lg my-lg text-primary rounded-full bg-secondary text-lg font-bold hover:bg-secondary-hover cursor-pointer transition-colors duration-300">
            Start
          </button>
          <IconPlayerSkipForwardFilled />
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default PomodoroPage;
