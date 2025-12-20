import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import AuthPrompt from "./components/Auth/AuthPrompt";
import { useServerKeepAlive } from "./hooks/useServerKeepAlive";

function App() {
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
