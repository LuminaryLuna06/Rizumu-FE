import { Routes, Route } from "react-router-dom";
import LandingPage from "@rizumu/pages/LandingPage";
import PomodoroPage from "@rizumu/pages/Pomodoro";
import TestHieu from "@rizumu/pages/Test/TestHieu";
import TestHung from "@rizumu/pages/Test/TestHung";
import TestTranh from "@rizumu/pages/Test/TestTranh";
import TestTranh2 from "@rizumu/pages/Test/testTranh2";
// Import các page (Ví dụ)

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/pomodoro" element={<PomodoroPage />} />
      <Route path="/test-hung" element={<TestHung />} />
      <Route path="/test-hieu" element={<TestHieu />} />
      <Route path="/test-tranh" element={<TestTranh />} />
      <Route path="/test-tranh2" element={<TestTranh2 />} />
    </Routes>
  );
};

export default AppRoutes;

{
  /* <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<div>Trang Register</div>} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<div>Settings Page</div>} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} /> */
}
