import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ToastProvider } from "./utils/toast/toast.tsx";
import { MantineProvider } from "@mantine/core";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider defaultColorScheme="light">
      <ToastProvider>
        <App />
      </ToastProvider>
    </MantineProvider>
  </StrictMode>
);
