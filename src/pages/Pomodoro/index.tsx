import React from "react";
// import fujiImg from "@rizumu/assets/image/fuji2.jpg";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Timer from "./components/Timer";

function PomodoroPage() {
  return (
    <div
      className="bg-primary-light px-xl text-secondary bg-center z-base font-light text-sm"
      style={{ backgroundImage: `url(/image/fuji2.jpg)` }}
    >
      {/* Header */}
      <Header />
      {/* Main Content */}
      <Timer />
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default PomodoroPage;
