import { getThemeColors } from "@/constants/theme";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export interface CalendarCardProps {
  currentDate: Date;
  selectedDate: Date;
  monthYear: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDay: (day: number) => void;
  isDark: boolean;
  highContrast?: boolean;
}

export function CalendarCard({
  currentDate,
  selectedDate,
  monthYear,
  onPrevMonth,
  onNextMonth,
  onSelectDay,
  isDark,
  highContrast = false,
}: CalendarCardProps) {
  const C = getThemeColors(isDark, highContrast);
  const s = getStyles(C);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate);

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<View key={`empty-${i}`} style={s.dayCell} />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === currentDate.getMonth();
    days.push(
      <TouchableOpacity
        key={day}
        style={[s.dayCell, isSelected && s.daySelected]}
        onPress={() => onSelectDay(day)}
      >
        <Text style={[s.dayText, isSelected && s.dayTextSelected]}>{day}</Text>
      </TouchableOpacity>,
    );
  }

  return (
    <View style={s.card}>
      <View style={s.monthNav}>
        <TouchableOpacity onPress={onPrevMonth}>
          <ChevronLeft size={24} color={C.textDark} />
        </TouchableOpacity>
        <Text style={s.monthText}>{monthYear.charAt(0).toUpperCase() + monthYear.slice(1)}</Text>
        <TouchableOpacity onPress={onNextMonth}>
          <ChevronRight size={24} color={C.textDark} />
        </TouchableOpacity>
      </View>

      <View style={s.dayHeaders}>
        {DAYS.map((day) => (
          <Text key={day} style={s.dayHeaderText}>{day}</Text>
        ))}
      </View>

      <View style={s.grid}>{days}</View>
    </View>
  );
}

const getStyles = (C: ReturnType<typeof getThemeColors>) =>
  StyleSheet.create({
    card: {
      backgroundColor: C.cardBg,
      marginHorizontal: 16,
      marginTop: -15,
      borderRadius: 20,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    monthNav: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    monthText: {
      fontSize: 16,
      fontFamily: "Inter-Bold",
      color: C.textDark,
      textTransform: "capitalize",
    },
    dayHeaders: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 10,
    },
    dayHeaderText: {
      fontSize: 12,
      color: C.textLight,
      fontFamily: "Magra-Regular",
      width: 36,
      textAlign: "center",
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    dayCell: {
      width: 36,
      height: 36,
      justifyContent: "center",
      alignItems: "center",
      margin: 2,
    },
    daySelected: {
      backgroundColor: C.orange,
      borderRadius: 18,
    },
    dayText: {
      fontSize: 13,
      color: C.textDark,
      fontFamily: "Inter-Bold",
    },
    dayTextSelected: {
      color: C.white,
    },
  });
