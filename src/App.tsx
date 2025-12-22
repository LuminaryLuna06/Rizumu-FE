import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import AuthPrompt from "./components/Auth/AuthPrompt";
import { useServerKeepAlive } from "./hooks/useServerKeepAlive";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./tanstack/api/config/queryClient";

function App() {
  useServerKeepAlive(true, 14);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <AuthProvider>
        <BrowserRouter>
          <AuthPrompt />
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
