import { View, Text, StyleSheet } from "react-native";

export default function SettingsScreen() {
  return (
    <View style={s.root}>
      <Text style={s.text}>Settings Screen</Text>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  text: {
    fontSize: 18,
    color: "#666",
  },
});
