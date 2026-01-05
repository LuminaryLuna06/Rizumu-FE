import { lazy as reactLazy } from "react";

const lazy = (componentImport: () => Promise<any>) =>
  reactLazy(async () => {
    const hasForceRefresh = JSON.parse(
      window.localStorage.getItem("has_force_refresh") || "false"
    );

    try {
      const component = await componentImport();

      window.localStorage.setItem("has_force_refresh", "false");

      return component;
    } catch (error) {
      if (!hasForceRefresh) {
        window.localStorage.setItem("has_force_refresh", "true");
        return window.location.reload();
      }

      throw error;
    }
  });

export const PagePomodoro = lazy(() => import("@rizumu/pages/Pomodoro"));
