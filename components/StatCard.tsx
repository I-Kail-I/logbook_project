import { getThemeColors } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export interface StatCardData {
  value: string;
  label: string;
  iconColor: string;
  bg: string;
}

interface StatCardProps {
  data: StatCardData;
  icon: React.ElementType;
  isDark: boolean;
  highContrast?: boolean;
}

export function StatCard({ data, icon: Icon, isDark, highContrast = false }: StatCardProps) {
  const C = getThemeColors(isDark, highContrast);
  const s = getStyles(C);

  return (
    <View style={s.card}>
      <View style={[s.iconWrap, { backgroundColor: data.bg }]}>
        <Icon size={20} color={data.iconColor} />
      </View>
      <Text style={s.value}>{data.value}</Text>
      <Text style={s.label}>{data.label}</Text>
    </View>
  );
}

const getStyles = (C: ReturnType<typeof getThemeColors>) =>
  StyleSheet.create({
    card: {
      backgroundColor: C.cardBg,
      borderRadius: 16,
      padding: 14,
      width: "48%",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    iconWrap: {
      width: 36,
      height: 36,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
    },
    value: {
      fontSize: 22,
      fontFamily: "Inter-ExtraBold",
      color: C.textDark,
    },
    label: {
      fontSize: 11,
      fontFamily: "Magra-Regular",
      color: C.textGray,
      marginTop: 2,
    },
  });
