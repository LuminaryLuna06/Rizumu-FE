import { HashRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
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
