import { getThemeColors } from "@/constants/theme";
import { useSettings } from "@/contexts/SettingsContext";
import { Tabs } from "expo-router";
import { BookOpen, LayoutGrid, Users } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";

const ORANGE = "#F5A623";

export default function AdminTabsLayout() {
  const { settings } = useSettings();
  const isDark = settings.theme === "dark";
  const C = getThemeColors(isDark, settings.highContrast);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [styles.tabBar, { backgroundColor: C.cardBg, borderTopColor: C.border }],
        tabBarActiveTintColor: ORANGE,
        tabBarInactiveTintColor: isDark ? "#808080" : "#999999",
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.label,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <View style={[styles.iconContainer, color === ORANGE && styles.iconActive]}>
              <LayoutGrid size={20} color={color === ORANGE ? "#FFFFFF" : color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="pegawai"
        options={{
          title: "Pegawai",
          tabBarIcon: ({ color }) => (
            <View style={[styles.iconContainer, color === ORANGE && styles.iconActive]}>
              <Users size={20} color={color === ORANGE ? "#FFFFFF" : color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="logbook"
        options={{
          title: "Logbook",
          tabBarIcon: ({ color }) => (
            <View style={[styles.iconContainer, color === ORANGE && styles.iconActive]}>
              <BookOpen size={20} color={color === ORANGE ? "#FFFFFF" : color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 76,
    paddingTop: 8,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  iconActive: {
    backgroundColor: ORANGE,
  },
  label: {
    fontSize: 12,
    marginBottom: 2,
  },
});
