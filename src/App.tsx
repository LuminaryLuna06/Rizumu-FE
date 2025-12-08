import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import "@mantine/core";
import "@mantine/hooks";
import "@mantine/charts";
import "@mantine/charts/styles.css";
import AuthPrompt from "./components/Auth/AuthPrompt";
import { useServerKeepAlive } from "./hooks/useServerKeepAlive";

function App() {
  // Tự động ping server mỗi 14 phút để tránh server bị sleep
  useServerKeepAlive(true, 14);

  return (
    <AuthProvider>
      <BrowserRouter>
        <AuthPrompt />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
