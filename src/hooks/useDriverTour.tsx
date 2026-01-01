import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const useDriverTour = () => {
  const startTimerTour = () => {
    const driverObj = driver({
      showProgress: true,
      showButtons: ["next", "previous", "close"],
      steps: [
        {
          popover: {
            title: "👋 Welcome to Rizumu!",
            description:
              "Welcome! This guided tour will walk you through all the features of Rizumu - your productivity companion for focused work and collaboration. Let's get started!",
          },
        },
        {
          element: "#timer-container",
          popover: {
            title: "🍅 Pomodoro Timer",
            description:
              "This is the Pomodoro Timer - a tool that helps you work efficiently. The Pomodoro technique divides work into short intervals (usually 25 minutes) alternating with short breaks.",
            side: "top",
            align: "center",
          },
        },
        {
          element: "#timer-tag-selector",
          popover: {
            title: "🏷️ Tag Selector",
            description: "Select a tag to categorize your pomodoro sessions.",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "#timer-mode-buttons",
          popover: {
            title: "🔘 Mode Buttons",
            description:
              "Switch between modes: Pomodoro (work), Short Break, and Long Break. Modes automatically switch after each session completes.",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "#timer-display",
          popover: {
            title: "⏱️ Timer Display",
            description:
              "The timer displays remaining time (or elapsed time). Time counts down from the duration set in the preset.",
            side: "top",
            align: "center",
          },
        },
        {
          element: "#timer-preset-button",
          popover: {
            title: "⚙️ Preset Settings",
            description:
              "Click here to open preset settings. You can customize timer preset, mode, count up or countdown.",
            side: "right",
            align: "center",
          },
        },
        {
          element: "#timer-start-button",
          popover: {
            title: "▶️ Start/Pause Button",
            description:
              "Button to start or pause the timer. When running, focus mode activates and Rizumu hides features to help you concentrate.",
            side: "top",
            align: "center",
          },
        },
        {
          element: "#timer-pip-button",
          popover: {
            title: "📺 Picture-in-Picture",
            description:
              "Open timer in a floating mini window (PiP) so you can track time while working in other apps. This feature only works on supported browsers.",
            side: "left",
            align: "center",
          },
        },
        {
          element: "#timer-skip-button",
          popover: {
            title: "⏭️ Skip Session",
            description:
              "Skip current session and move to the next. Session will be marked complete and you still receive rewards (XP and coins) based on time focused.",
            side: "left",
            align: "center",
          },
        },
        {
          element: "#header-streak",
          popover: {
            title: "🔥 Streak",
            description:
              "Track your consecutive work days. Click this button to view your streak details! (Press next to open)",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "#streak-content",
          popover: {
            title: "📊 Streak Details",
            description:
              "Here you can see your current streak and best streak record. Maintaining streaks helps build consistent study/work habits every day.",
            side: "left",
            align: "center",
          },
          onHighlightStarted: () => {
            // Open streak popover
            const streakTrigger =
              document.querySelector<HTMLElement>("#streak-trigger");
            if (streakTrigger) {
              streakTrigger.click();
            }
          },
          onDeselected: () => {
            // Close streak popover by clicking trigger again
            const streakTrigger =
              document.querySelector<HTMLElement>("#streak-trigger");
            if (streakTrigger) {
              streakTrigger.click();
            }
          },
        },
        {
          element: "#header-activities",
          popover: {
            title: "📊 Activities & Time Tracking",
            description:
              "Shows total work time for the day. Click to view detailed hourly statistics and productivity analysis over days.",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "#header-leaderboard",
          popover: {
            title: "🏆 Leaderboard",
            description:
              "View user rankings based on focus time. Healthy competition to boost motivation!",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "#header-room",
          popover: {
            title: "🏠 Room Management",
            description:
              "Manage your work rooms. Create private rooms, join friends' rooms, or share invite links to work together. (Press next to open)",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "#room-content",
          popover: {
            title: "🏠 Room Settings",
            description:
              "Here you can manage room settings, view members, share invite link, and customize room options.",
            side: "left",
            align: "center",
          },
          onHighlightStarted: () => {
            const roomTrigger =
              document.querySelector<HTMLElement>("#room-trigger");
            if (roomTrigger) {
              roomTrigger.click();
            }
          },
          onDeselected: () => {
            const roomTrigger =
              document.querySelector<HTMLElement>("#room-trigger");
            if (roomTrigger) {
              roomTrigger.click();
            }
          },
        },
        {
          element: "#header-user-menu",
          popover: {
            title: "👤 User Menu",
            description:
              "Access your profile, find public study rooms, configure app settings, and logout. (Press next to open)",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "#user-menu-content",
          popover: {
            title: "👤 User Options",
            description:
              "View your public profile, discover study rooms, customize app settings like alarms and notifications, or logout.",
            side: "left",
            align: "center",
          },
          onHighlightStarted: () => {
            const userMenuTrigger =
              document.querySelector<HTMLElement>("#user-menu-trigger");
            if (userMenuTrigger) {
              userMenuTrigger.click();
            }
          },
          onDeselected: () => {
            const userMenuTrigger =
              document.querySelector<HTMLElement>("#user-menu-trigger");
            if (userMenuTrigger) {
              userMenuTrigger.click();
            }
          },
        },
        {
          element: "#online-users",
          popover: {
            title: "👥 Online Users",
            description:
              "Shows members currently online in your room. Hover over avatars to see names. Working with friends boosts motivation!",
            side: "left",
            align: "center",
          },
        },
        {
          element: "#footer-iframe",
          popover: {
            title: "🎵 Music Player",
            description:
              "Open YouTube, Soundcloud, Spotify, Apple Music... to listen to music while studying/working. Helps improve focus and create a pleasant workspace.",
            side: "top",
            align: "start",
          },
        },
        {
          element: "#footer-background",
          popover: {
            title: "🖼️ Background Settings",
            description:
              "Change room background (admin only). Choose from static images or animated videos to customize the interface.",
            side: "top",
            align: "start",
          },
        },
        {
          element: "#footer-tutorial",
          popover: {
            title: "❓ Tutorial",
            description:
              "Reopen this tutorial anytime. The tour will guide you through all main features of the app.",
            side: "top",
            align: "start",
          },
        },
        {
          element: "#footer-friends",
          popover: {
            title: "👥 Friends Management",
            description:
              "Manage friend list: send/receive friend requests, view friend list. A badge will appear when you have pending friend requests.",
            side: "top",
            align: "end",
          },
        },
        {
          element: "#footer-chat",
          popover: {
            title: "💬 Chat",
            description:
              "Chat with room members. Chat might be hidden in focus mode depending on room settings.",
            side: "top",
            align: "end",
          },
        },
        {
          popover: {
            title: "🎉 You're All Set!",
            description:
              "Congratulations! You've completed the tour. Now you know all the features Rizumu has to offer. Start your first Pomodoro session and enjoy a productive journey. Happy focusing! 🚀",
          },
        },
      ],
    });

    driverObj.drive();
  };

  return {
    startTimerTour,
  };
};
