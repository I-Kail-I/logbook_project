import { getThemeColors } from "@/constants/theme";
import { Clock, FileText } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface Activity {
  id: number;
  time: string;
  statusKey: "completed" | "in_progress" | "pending";
  title: string;
  desc: string;
  iconColor: string;
  category?: string;
  date?: string;
  evidence?: string;
}

interface ActivityCardProps {
  activity: Activity;
  isDark: boolean;
  highContrast?: boolean;
  isSelected?: boolean;
  selectMode?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  getStatusText: (status: string) => string;
  getStatusColor: (status: string) => string;
}

export function ActivityCard({
  activity,
  isDark,
  highContrast = false,
  isSelected,
  selectMode,
  onPress,
  onLongPress,
  getStatusText,
  getStatusColor,
}: ActivityCardProps) {
  const C = getThemeColors(isDark, highContrast);
  const s = getStyles(C);

  return (
    <TouchableOpacity
      style={[s.activityCard, isSelected && s.activityCardSelected]}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={500}
    >
      <View style={s.activityHeader}>
        <View style={s.activityTimeRow}>
          <Clock size={14} color={C.textLight} />
          <Text style={s.activityTime}>{activity.time}</Text>
        </View>
        <View style={[s.statusBadge, { backgroundColor: getStatusColor(activity.statusKey) + "20" }]}>
          <Text style={[s.statusText, { color: getStatusColor(activity.statusKey) }]}>
            {getStatusText(activity.statusKey)}
          </Text>
        </View>
      </View>

      <View style={s.activityBody}>
        <View style={[s.activityIcon, { backgroundColor: activity.iconColor }]}>
          <FileText size={20} color={C.white} />
        </View>
        <View style={s.activityContent}>
          <Text style={s.activityTitle}>{activity.title}</Text>
          <Text style={s.activityDesc} numberOfLines={2}>
            {activity.desc}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const getStyles = (C: ReturnType<typeof getThemeColors>) =>
  StyleSheet.create({
    activityCard: {
      backgroundColor: C.cardBg,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: C.border,
    },
    activityCardSelected: {
      borderWidth: 2,
      borderColor: C.orange,
    },
    activityHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    activityTimeRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    activityTime: {
      fontSize: 12,
      color: C.textLight,
      fontFamily: "Magra-Regular",
    },
    statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusText: {
      fontSize: 11,
      fontFamily: "Inter-Bold",
    },
    activityBody: {
      flexDirection: "row",
      gap: 12,
    },
    activityIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    activityContent: {
      flex: 1,
    },
    activityTitle: {
      fontSize: 14,
      fontFamily: "Inter-Bold",
      color: C.textDark,
      marginBottom: 4,
    },
    activityDesc: {
      fontSize: 12,
      color: C.textGray,
      lineHeight: 18,
      fontFamily: "Magra-Regular",
    },
  });
