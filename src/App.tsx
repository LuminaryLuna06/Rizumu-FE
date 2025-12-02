import { HashRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import "@mantine/core";
import "@mantine/hooks";
import "@mantine/charts";
import "@mantine/charts/styles.css";
import AuthPrompt from "./components/Auth/AuthPrompt";

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AuthPrompt />
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
