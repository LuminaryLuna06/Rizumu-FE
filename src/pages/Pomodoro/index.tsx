import React from "react";
// import fujiImg from "@rizumu/assets/image/fuji2.jpg";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Timer from "./components/Timer";

function PomodoroPage() {
  return (
    <div
      className="bg-primary-light px-xl text-secondary bg-center bg-cover z-base font-light text-sm"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(/image/fuji.jpg)`,
      }}
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
