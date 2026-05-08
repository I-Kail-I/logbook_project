/**
 * App theme colors for light and dark mode
 */

export const getThemeColors = (isDark: boolean) => ({
  // Brand colors
  orange: "#F5A623",
  orangeDark: "#E08A0E",
  orangeLight: "#FFB84D",

  // Base colors
  white: "#FFFFFF",
  black: "#000000",

  // Text colors
  textDark: isDark ? "#FFFFFF" : "#1A1A1A",
  textGray: isDark ? "#A0A0A0" : "#666666",
  textLight: isDark ? "#808080" : "#999999",

  // Background colors
  bgGray: isDark ? "#1A1A1A" : "#F5F5F5",
  cardBg: isDark ? "#2D2D2D" : "#FFFFFF",

  // Accent colors
  green: "#4CAF50",
  greenLight: isDark ? "#2D3D2D" : "#E8F5E9",
  red: "#FF4444",
  redLight: isDark ? "#3D2A2A" : "#FFE5E5",

  // UI colors
  border: isDark ? "#404040" : "#E0E0E0",
  inputBg: isDark ? "#3D3D3D" : "#F8F8F8",
  divider: isDark ? "#404040" : "#F0F0F0",

  // Icon backgrounds
  iconBgOrange: isDark ? "#3D2D1A" : "#FFF4E5",
  iconBgPurple: isDark ? "#2D1A3D" : "#F3E8FF",
  iconBgGreen: isDark ? "#1A3D2D" : "#DCFCE7",
  iconBgBlue: isDark ? "#1A2D3D" : "#EEF2FF",
  iconBgRed: isDark ? "#3D1A1A" : "#FEE2E2",
  iconBgIndigo: isDark ? "#1A1A3D" : "#E8EAF6",
});

export type ThemeColors = ReturnType<typeof getThemeColors>;
