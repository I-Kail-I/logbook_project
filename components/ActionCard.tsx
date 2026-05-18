import { getThemeColors } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface ActionCardData {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

interface ActionCardProps {
  data: ActionCardData;
  isDark: boolean;
  highContrast?: boolean;
  onPress?: () => void;
}

export function ActionCard({ data, isDark, highContrast = false, onPress }: ActionCardProps) {
  const C = getThemeColors(isDark, highContrast);
  const s = getStyles(C);
  const Icon = data.icon;

  return (
    <TouchableOpacity style={s.card} onPress={onPress}>
      <View style={[s.iconWrap, { backgroundColor: data.iconBg }]}>
        <Icon size={24} color={data.iconColor} />
      </View>
      <View>
        <Text style={s.title}>{data.title}</Text>
        <Text style={s.subtitle}>{data.subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

const getStyles = (C: ReturnType<typeof getThemeColors>) =>
  StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: C.white,
      borderRadius: 16,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    iconWrap: {
      width: 44,
      height: 44,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 14,
      fontFamily: "Inter-Bold",
      color: "#1A1A1A",
      marginBottom: 2,
    },
    subtitle: {
      fontSize: 11,
      color: "#666666",
      fontFamily: "Magra-Regular",
    },
  });
