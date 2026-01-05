import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "./useDriverTour.css";
import { useState, useEffect } from "react";

export const useDriverTour = () => {
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize("mobile"); // < md
      } else if (width < 1024) {
        setScreenSize("tablet"); // md -> lg
      } else {
        setScreenSize("desktop"); // >= lg
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const startTimerTour = () => {
    const tagSelectorElement =
      screenSize === "tablet" ? "#header-tag-selector" : "#timer-tag-selector";

    const driverObj = driver({
      showProgress: true,
      showButtons: ["next", "previous", "close"],
      overlayClickBehavior: "nextStep",
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
          element: tagSelectorElement,
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
            const streakTrigger =
              document.querySelector<HTMLElement>("#streak-trigger");
            if (streakTrigger) {
              streakTrigger.click();
            }
          },
          onDeselected: () => {
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
              "Shows total work time for the day. Press next to see detailed analytics.",
            side: "bottom",
            align: "center",
            onNextClick: () => {
              const activitiesButton = document.querySelector<HTMLElement>(
                "#header-activities button"
              );
              if (activitiesButton) {
                activitiesButton.click();
                setTimeout(() => {
                  driverObj.moveNext();
                }, 100);
              } else {
                driverObj.moveNext();
              }
            },
          },
        },
        {
          element: ".activities-modal",
          popover: {
            title: "📊 Activities Details",
            description:
              "Here you can see your work time statistics by hour and day. Track your productivity patterns and analyze your focus habits over time.",
            side: "left",
            align: "center",
          },

          onDeselected: () => {
            const modalBackdrop =
              document.querySelector<HTMLElement>(
                ".activities-modal"
              )?.parentElement;
            if (modalBackdrop) {
              modalBackdrop.click();
            }
          },
        },
        {
          element: "#header-leaderboard",
          popover: {
            title: "🏆 Leaderboard",
            description:
              "View user rankings based on focus time. Healthy competition to boost motivation! Press next to see rankings.",
            side: "bottom",
            align: "center",
            onPrevClick: () => {
              const activitiesButton = document.querySelector<HTMLElement>(
                "#header-activities button"
              );
              if (activitiesButton) {
                activitiesButton.click();
                setTimeout(() => {
                  driverObj.movePrevious();
                }, 100);
              } else {
                driverObj.movePrevious();
              }
            },
            onNextClick: () => {
              const leaderboardButton = document.querySelector<HTMLElement>(
                "#header-leaderboard button"
              );
              if (leaderboardButton) {
                leaderboardButton.click();
                setTimeout(() => {
                  driverObj.moveNext();
                }, 100);
              } else {
                driverObj.moveNext();
              }
            },
          },
        },
        {
          element: ".leaderboard-modal",
          popover: {
            title: "🏆 Leaderboard Rankings",
            description:
              "View global and friend rankings. See who's working hard and get motivated to climb the leaderboard! You can filter by daily, weekly, or monthly time periods.",
            side: "left",
            align: "center",
          },
          onDeselected: () => {
            const modalBackdrop =
              document.querySelector<HTMLElement>(
                ".leaderboard-modal"
              )?.parentElement;
            if (modalBackdrop) {
              modalBackdrop.click();
            }
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
            onPrevClick: () => {
              const leaderboardButton = document.querySelector<HTMLElement>(
                "#header-leaderboard button"
              );
              if (leaderboardButton) {
                leaderboardButton.click();
                setTimeout(() => {
                  driverObj.movePrevious();
                }, 100);
              } else {
                driverObj.movePrevious();
              }
            },
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
              "Access your profile, find public study rooms, configure app settings, and logout. Press next to open menu.",
            side: "bottom",
            align: "center",
            onNextClick: () => {
              const userMenuTrigger =
                document.querySelector<HTMLElement>("#user-menu-trigger");
              if (userMenuTrigger) {
                userMenuTrigger.click();
                setTimeout(() => {
                  driverObj.moveNext();
                }, 100);
              } else {
                driverObj.moveNext();
              }
            },
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
            onPrevClick: () => {
              const userMenuTrigger =
                document.querySelector<HTMLElement>("#user-menu-trigger");
              if (userMenuTrigger) {
                userMenuTrigger.click();
                setTimeout(() => {
                  driverObj.movePrevious();
                }, 100);
              } else {
                driverObj.movePrevious();
              }
            },
          },
        },
        // Profile Modal Steps
        {
          element: "#user-menu-content li:nth-child(1)",
          popover: {
            title: "👤 Public Profile",
            description:
              "View and edit your public profile. Show your stats, achievements, and activity to other users. Press next to open.",
            side: "left",
            align: "center",
            onNextClick: () => {
              const profileMenuItem = document.querySelector<HTMLElement>(
                "#user-menu-content li:nth-child(1)"
              );
              if (profileMenuItem) {
                profileMenuItem.click();
                setTimeout(() => {
                  driverObj.moveNext();
                }, 100);
              } else {
                driverObj.moveNext();
              }
            },
          },
        },
        {
          element: ".profile-modal",
          popover: {
            title: "👤 Your Profile",
            description:
              "Here you can see your complete profile including level, XP, stats, heatmap, and gifts received. You can also edit your profile or share it with friends.",
            side: "left",
            align: "center",
          },
          onDeselected: () => {
            const modalBackdrop =
              document.querySelector<HTMLElement>(
                ".profile-modal"
              )?.parentElement;
            if (modalBackdrop) {
              modalBackdrop.click();
            }
          },
        },
        // Study Room Modal Steps
        {
          element: "#user-menu-content li:nth-child(2)",
          popover: {
            title: "📚 Find Study Room",
            description:
              "Discover and join public study rooms created by other users. Study together and stay motivated! Press next to open.",
            side: "left",
            align: "center",
            onPrevClick: () => {
              const profileMenuItem = document.querySelector<HTMLElement>(
                "#user-menu-content li:nth-child(1)"
              );
              if (profileMenuItem) {
                profileMenuItem.click();
                setTimeout(() => {
                  driverObj.movePrevious();
                }, 100);
              } else {
                driverObj.movePrevious();
              }
            },
            onNextClick: () => {
              const studyRoomMenuItem = document.querySelector<HTMLElement>(
                "#user-menu-content li:nth-child(2)"
              );
              if (studyRoomMenuItem) {
                studyRoomMenuItem.click();
                setTimeout(() => {
                  driverObj.moveNext();
                }, 100);
              } else {
                driverObj.moveNext();
              }
            },
          },
        },
        {
          element: ".study-room-modal",
          popover: {
            title: "📚 Public Study Rooms",
            description:
              "Browse all available public study rooms. You can see room details, number of members, and join any room you like.",
            side: "left",
            align: "center",
          },
          onDeselected: () => {
            const modalBackdrop =
              document.querySelector<HTMLElement>(
                ".study-room-modal"
              )?.parentElement;
            if (modalBackdrop) {
              modalBackdrop.click();
            }
          },
        },
        // App Settings Modal Steps
        {
          element: "#user-menu-content li:nth-child(3)",
          popover: {
            title: "⚙️ App Settings",
            description:
              "Customize your Rizumu experience. Configure timer behavior, alarm sounds, and other preferences. Press next to open.",
            side: "left",
            align: "center",
            onPrevClick: () => {
              const profileMenuItem = document.querySelector<HTMLElement>(
                "#user-menu-content li:nth-child(2)"
              );
              if (profileMenuItem) {
                profileMenuItem.click();
                setTimeout(() => {
                  driverObj.movePrevious();
                }, 100);
              } else {
                driverObj.movePrevious();
              }
            },
            onNextClick: () => {
              const settingsMenuItem = document.querySelector<HTMLElement>(
                "#user-menu-content li:nth-child(3)"
              );
              if (settingsMenuItem) {
                settingsMenuItem.click();
                setTimeout(() => {
                  driverObj.moveNext();
                }, 100);
              } else {
                driverObj.moveNext();
              }
            },
          },
        },
        {
          element: ".app-setting-modal",
          popover: {
            title: "⚙️ Your Settings",
            description:
              "Configure alarm sounds, auto-start options, long break intervals, and more. Customize Rizumu to match your working style.",
            side: "left",
            align: "center",
            onNextClick: () => {
              const userMenuTrigger =
                document.querySelector<HTMLElement>("#user-menu-trigger");
              if (userMenuTrigger) {
                userMenuTrigger.click();
                setTimeout(() => {
                  driverObj.moveNext();
                }, 100);
              } else {
                driverObj.moveNext();
              }
            },
          },
          onDeselected: () => {
            const modalBackdrop =
              document.querySelector<HTMLElement>(
                ".app-setting-modal"
              )?.parentElement;
            if (modalBackdrop) {
              modalBackdrop.click();
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
            onPrevClick: () => {
              const settingsMenuItem = document.querySelector<HTMLElement>(
                "#user-menu-content li:nth-child(3)"
              );
              const userMenuTrigger =
                document.querySelector<HTMLElement>("#user-menu-trigger");
              if (settingsMenuItem) {
                settingsMenuItem.click();
              }
              if (userMenuTrigger) {
                userMenuTrigger.click();
                setTimeout(() => {
                  driverObj.movePrevious();
                }, 100);
              } else {
                driverObj.movePrevious();
              }
            },
          },
        },
        // Tasks Feature Steps
        {
          element: "#tasks-container button",
          popover: {
            title: "✅ Tasks Management",
            description:
              "Organize your work with task lists. Create, edit, and track tasks with due dates. Press next to open tasks panel.",
            side: "right",
            align: "center",
            onNextClick: () => {
              const tasksButton = document.querySelector<HTMLElement>(
                "#tasks-container button"
              );
              if (tasksButton) {
                tasksButton.click();
                setTimeout(() => {
                  driverObj.moveNext();
                }, 100);
              } else {
                driverObj.moveNext();
              }
            },
          },
        },
        {
          element: "#tasks-container > div:nth-child(2)",
          popover: {
            title: "✅ Your Task List",
            description:
              "Add new tasks, set due dates and times, check off completed tasks, and clear finished items. Stay organized and productive!",
            side: "right",
            align: "center",
          },
          onDeselected: () => {
            const tasksButton = document.querySelector<HTMLElement>(
              "#tasks-container button"
            );
            if (tasksButton) {
              tasksButton.click();
            }
          },
        },
        {
          element: "#footer-iframe",
          popover: {
            title: "🎵 Music Player",
            description:
              "Open YouTube, Soundcloud, Spotify, Apple Music... to listen to music while studying/working. Press next to open music player.",
            side: "top",
            align: "start",
            onPrevClick: () => {
              const tasksButton = document.querySelector<HTMLElement>(
                "#tasks-container button"
              );
              if (tasksButton) {
                tasksButton.click();
                setTimeout(() => {
                  driverObj.movePrevious();
                }, 100);
              } else {
                driverObj.movePrevious();
              }
            },
            onNextClick: () => {
              const iframeButton = document.querySelector<HTMLElement>(
                "#footer-iframe button"
              );
              if (iframeButton) {
                iframeButton.click();
                setTimeout(() => {
                  driverObj.moveNext();
                }, 100);
              } else {
                driverObj.moveNext();
              }
            },
          },
        },
        {
          element: ".iframe-popover",
          popover: {
            title: "🎵 Music Controls",
            description:
              "Paste links from YouTube, Spotify, Apple Music, or SoundCloud. View recent tracks and switch between different music sources easily.",
            side: "top",
            align: "start",
          },
          onDeselected: () => {
            const iframeButton = document.querySelector<HTMLElement>(
              "#footer-iframe button"
            );
            if (iframeButton) {
              iframeButton.click();
            }
          },
        },
        {
          element: "#footer-background",
          popover: {
            title: "🖼️ Background Settings",
            description:
              "Change room background (admin only). Choose from static images or animated videos to customize the interface. Press next to see options.",
            side: "top",
            align: "start",
            onPrevClick: () => {
              const iframeButton = document.querySelector<HTMLElement>(
                "#footer-iframe button"
              );
              if (iframeButton) {
                iframeButton.click();
                setTimeout(() => {
                  driverObj.movePrevious();
                }, 100);
              } else {
                driverObj.movePrevious();
              }
            },
            onNextClick: () => {
              const backgroundButton = document.querySelector<HTMLElement>(
                "#footer-background button"
              );
              if (backgroundButton) {
                backgroundButton.click();
                setTimeout(() => {
                  driverObj.moveNext();
                }, 100);
              } else {
                driverObj.moveNext();
              }
            },
          },
        },
        {
          element: ".background-modal",
          popover: {
            title: "🖼️ Background Gallery",
            description:
              "Choose from Motion videos or Still images to customize your workspace. A beautiful background helps create a pleasant working environment.",
            side: "left",
            align: "center",
          },
          onDeselected: () => {
            const modalBackdrop =
              document.querySelector<HTMLElement>(
                ".background-modal"
              )?.parentElement;
            if (modalBackdrop) {
              modalBackdrop.click();
            }
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
            onPrevClick: () => {
              const backgroundButton = document.querySelector<HTMLElement>(
                "#footer-background button"
              );
              if (backgroundButton) {
                backgroundButton.click();
                setTimeout(() => {
                  driverObj.movePrevious();
                }, 100);
              } else {
                driverObj.movePrevious();
              }
            },
          },
        },
        {
          element: "#footer-friends",
          popover: {
            title: "👥 Friends Management",
            description:
              "Manage friend list: send/receive friend requests, view friend list. A badge will appear when you have pending friend requests. Press next to see details.",
            side: "top",
            align: "end",
            onNextClick: () => {
              const friendsButton = document.querySelector<HTMLElement>(
                "#footer-friends button"
              );
              if (friendsButton) {
                friendsButton.click();
                setTimeout(() => {
                  driverObj.moveNext();
                }, 100);
              } else {
                driverObj.moveNext();
              }
            },
          },
        },
        {
          element: ".friends-modal",
          popover: {
            title: "👥 Friends List",
            description:
              "Manage your friends here. Accept or reject friend requests, view your friend list, and search for new friends to connect with.",
            side: "left",
            align: "center",
          },
          onDeselected: () => {
            const modalBackdrop =
              document.querySelector<HTMLElement>(
                ".friends-modal"
              )?.parentElement;
            if (modalBackdrop) {
              modalBackdrop.click();
            }
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
            onPrevClick: () => {
              const friendsButton = document.querySelector<HTMLElement>(
                "#footer-friends button"
              );
              if (friendsButton) {
                friendsButton.click();
                setTimeout(() => {
                  driverObj.movePrevious();
                }, 100);
              } else {
                driverObj.movePrevious();
              }
            },
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
