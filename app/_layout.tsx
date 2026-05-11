import { FontProvider } from "@/contexts/FontContext";
import { SettingsProvider, useSettings } from "@/contexts/SettingsContext";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

function RootLayoutNav() {
  const { settings } = useSettings();
  const isDark = settings.theme === "dark";

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(admin)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={isDark ? "light" : "dark"} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SettingsProvider>
      <FontProvider>
        <RootLayoutNav />
      </FontProvider>
    </SettingsProvider>
  );
}
