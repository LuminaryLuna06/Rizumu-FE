import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/pomodoro");
  }, []);
  return <div className="div"></div>;
}

export default LandingPage;
