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
  server: {
    https:
      process.env.NODE_ENV !== "production" &&
      fs.existsSync("./localhost-key.pem")
        ? {
            key: fs.readFileSync("./localhost-key.pem"),
            cert: fs.readFileSync("./localhost.pem"),
          }
        : undefined,
  },
});
