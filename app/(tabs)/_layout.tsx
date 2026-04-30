import { Tabs } from "expo-router";
import { LayoutGrid, BookOpen, Settings } from "lucide-react-native";
import { View, StyleSheet } from "react-native";

const ORANGE = "#F5A623";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: ORANGE,
        tabBarInactiveTintColor: "#999",
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={[styles.iconContainer, color === ORANGE && styles.iconActive]}>
              <LayoutGrid size={24} color={color === ORANGE ? "#fff" : color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="logbook"
        options={{
          tabBarIcon: ({ color, size }) => (
            <BookOpen size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Settings size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: "#fff",
    borderTopWidth: 0,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  iconActive: {
    backgroundColor: ORANGE,
  },
});
