import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import AuthPrompt from "./components/Auth/AuthPrompt";
import { useServerKeepAlive } from "./hooks/useServerKeepAlive";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./tanstack/api/config/queryClient";
import { Analytics } from "@vercel/analytics/react";

function App() {
  useServerKeepAlive(true, 14);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools
        initialIsOpen={process.env.NODE_ENV !== "production"}
      />
      <Analytics />
      <AuthProvider>
        <SocketProvider>
          <BrowserRouter>
            <AuthPrompt />
            <AppRoutes />
          </BrowserRouter>
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
