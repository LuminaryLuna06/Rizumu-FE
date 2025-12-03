import { HashRouter, BrowserRouter } from "react-router-dom";
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
      <BrowserRouter>
        <AuthPrompt />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
