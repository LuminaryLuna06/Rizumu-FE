import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import fs from "fs";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@rizumu": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-query": ["@tanstack/react-query"],
          "vendor-firebase": ["firebase/app", "firebase/auth"],
          "vendor-charts": ["recharts"],
          "vendor-icons": ["@tabler/icons-react"],
        },
      },
    },
  },
  server: {
    allowedHosts: true,
    https:
      process.env.NODE_ENV !== "production" &&
      fs.existsSync("./localhost-key.pem")
        ? {
            key: fs.readFileSync("./localhost-key.pem"),
            cert: fs.readFileSync("./localhost.pem"),
          }
        : undefined,
  },
  preview: {
    allowedHosts: true,
  },
});
