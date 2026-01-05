import { Routes, Route, Navigate } from "react-router-dom";
import { PagePomodoro } from "./lazy.page";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/pomodoro" element={<PagePomodoro />} />
      <Route path="*" element={<Navigate to="/pomodoro" replace />} />
    </Routes>
  );
};

export default AppRoutes;
