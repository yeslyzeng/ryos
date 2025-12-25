import { OsTheme } from "./types";

export const meadow: OsTheme = {
  id: "meadow",
  name: "Meadow",
  fonts: {
    ui: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'SF Mono', Monaco, Menlo, monospace",
  },
  colors: {
    windowBg: "rgba(255, 255, 255, 0.85)",
    menubarBg: "rgba(248, 250, 248, 0.8)",
    menubarBorder: "rgba(139, 154, 123, 0.2)",
    windowBorder: "rgba(139, 154, 123, 0.3)",
    windowBorderInactive: "rgba(139, 154, 123, 0.15)",
    titleBar: {
      activeBg: "rgba(248, 250, 248, 0.9)",
      inactiveBg: "rgba(248, 250, 248, 0.7)",
      text: "#3D4852",
      inactiveText: "#8B9A7B",
      border: "rgba(139, 154, 123, 0.2)",
      borderInactive: "rgba(139, 154, 123, 0.1)",
      borderBottom: "rgba(139, 154, 123, 0.15)",
    },
    button: {
      face: "rgba(255, 255, 255, 0.9)",
      highlight: "rgba(255, 255, 255, 1)",
      shadow: "rgba(139, 154, 123, 0.3)",
      activeFace: "rgba(139, 154, 123, 0.2)",
    },
    trafficLights: {
      close: "#E8B4A0",
      closeHover: "#D9A090",
      minimize: "#F0D9A0",
      minimizeHover: "#E0C990",
      maximize: "#8B9A7B",
      maximizeHover: "#7A8A6A",
    },
    selection: {
      bg: "#8B9A7B",
      text: "#FFFFFF",
    },
    text: {
      primary: "#3D4852",
      secondary: "#6B7B8A",
      disabled: "#A0AEC0",
    },
  },
  metrics: {
    borderWidth: "1px",
    radius: "1rem", // 16px - Arc-style generous rounding
    titleBarHeight: "2.5rem", // 40px - more spacious
    titleBarRadius: "16px 16px 0px 0px", // Arc-style rounded top corners
    windowShadow: "0 20px 60px rgba(61, 72, 82, 0.15), 0 8px 25px rgba(61, 72, 82, 0.1)",
  },
  wallpaperDefaults: {
    photo: "/wallpapers/photos/meadow/default.png",
  },
};
