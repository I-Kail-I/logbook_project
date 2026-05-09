/**
 * App theme colors for light, dark, and high contrast modes
 */

export const getThemeColors = (isDark: boolean, highContrast = false) => {
  // High contrast overrides
  if (highContrast) {
    return {
      // Brand colors - more saturated for visibility
      orange: "#FF9500",
      orangeDark: "#E65100",
      orangeLight: "#FFB74D",

      // Base colors
      white: "#FFFFFF",
      black: "#000000",

      // Text colors - maximum contrast
      textDark: isDark ? "#FFFFFF" : "#000000",
      textGray: isDark ? "#E0E0E0" : "#333333",
      textLight: isDark ? "#B0B0B0" : "#555555",

      // Background colors
      bgGray: isDark ? "#000000" : "#FFFFFF",
      cardBg: isDark ? "#1A1A1A" : "#FFFFFF",

      // Accent colors - more saturated
      green: "#00C853",
      greenLight: isDark ? "#1B5E20" : "#B9F6CA",
      red: "#FF1744",
      redLight: isDark ? "#B71C1C" : "#FFCDD2",

      // UI colors - stronger borders
      border: isDark ? "#FFFFFF" : "#000000",
      inputBg: isDark ? "#2D2D2D" : "#F5F5F5",
      divider: isDark ? "#666666" : "#333333",

      // Icon backgrounds
      iconBgOrange: isDark ? "#4D2600" : "#FFF3E0",
      iconBgPurple: isDark ? "#38006b" : "#F3E5F5",
      iconBgGreen: isDark ? "#004d00" : "#E8F5E9",
      iconBgBlue: isDark ? "#002d4d" : "#E3F2FD",
      iconBgRed: isDark ? "#4d0000" : "#FFEBEE",
      iconBgIndigo: isDark ? "#1a237e" : "#E8EAF6",
    };
  }

  // Normal mode
  return {
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
  };
};

export type ThemeColors = ReturnType<typeof getThemeColors>;
