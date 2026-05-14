import { getThemeColors } from "@/constants/theme";
import { useSettings } from "@/contexts/SettingsContext";
import { useFadeInOnFocus } from "@/hooks/useFadeInOnFocus";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { ArrowLeft, Calendar, Clock, FileText, TrendingUp } from "lucide-react-native";
import React, { useEffect, useState, useCallback } from "react";
import { Animated, Dimensions, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BarChart, LineChart } from "react-native-gifted-charts";
import logbookService from "@/services/logbook";
import { Statistics, Logbook } from "@/services/types";

const { width: W } = Dimensions.get("window");

const DAY_LABELS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export default function StatistikScreen() {
  const router = useRouter();
  const [range, setRange] = useState<"week" | "month">("week");
  const { t, settings } = useSettings();
  const { fadeAnim, slideAnim } = useFadeInOnFocus(400, settings.reducedMotion);
  const isDark = settings.theme === "dark";
  const C = getThemeColors(isDark, settings.highContrast);
  const s = getStyles(C, W);
  
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useFonts({
    "Inter-Bold": require("@/assets/fonts/Inter-Bold.ttf"),
    "Inter-ExtraBold": require("@/assets/fonts/Inter-ExtraBold.ttf"),
    "ABeeZee-Regular": require("@/assets/fonts/ABeeZee-Regular.ttf"),
    "Magra-Regular": require("@/assets/fonts/Magra-Regular.ttf"),
  });

  const fetchStatistics = useCallback(async () => {
    setLoading(true);
    const result = await logbookService.getLogbook();
    if (result.success && result.data) {
      const stats = logbookService.calculateStatistics(result.data);
      setStatistics(stats);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  const BAR_DATA = statistics?.weeklyData.map((d: { day: string; count: number }, i: number) => ({
    value: d.count,
    label: t(DAY_LABELS[i] as any),
    frontColor: C.orange,
  })) || [
    { value: 0, label: t("mon"), frontColor: C.orange },
    { value: 0, label: t("tue"), frontColor: C.orange },
    { value: 0, label: t("wed"), frontColor: C.orange },
    { value: 0, label: t("thu"), frontColor: C.orange },
    { value: 0, label: t("fri"), frontColor: C.orange },
    { value: 0, label: t("sat"), frontColor: C.orange },
    { value: 0, label: t("sun"), frontColor: C.orange },
  ];

  const LINE_DATA = statistics?.weeklyData.map((d: { day: string; count: number }) => ({ value: d.count })) || [
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
  ];

  const STAT_CARDS = [
    {
      icon: FileText,
      value: loading ? "..." : String(statistics?.totalLogbook || 0),
      label: t("total_logbook"),
      bg: "#FFF4E5",
      iconColor: C.orange,
    },
    {
      icon: Calendar,
      value: loading ? "..." : String(statistics?.thisMonth || 0),
      label: t("this_month"),
      bg: "#F3E8FF",
      iconColor: "#8B5CF6",
    },
    {
      icon: TrendingUp,
      value: loading ? "..." : String(statistics?.avgPerDay || 0),
      label: t("avg_per_day"),
      bg: "#DCFCE7",
      iconColor: "#22C55E",
    },
    {
      icon: Clock,
      value: loading ? "..." : String(statistics?.totalHours || 0),
      label: t("total_hours"),
      bg: "#E0E7FF",
      iconColor: "#6366F1",
    },
  ];

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.orange} />
      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => {
                setRefreshing(true);
                await fetchStatistics();
                setRefreshing(false);
              }}
              tintColor={isDark ? C.orange : "#fff"}
              colors={[isDark ? C.orange : "#F5A623"]}
              progressBackgroundColor={isDark ? undefined : "#fff"}
              progressViewOffset={110}
            />
          }
        >
          {/* Header */}
          <View style={s.header}>
            <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
              <ArrowLeft size={24} color={C.white} />
            </TouchableOpacity>
            <Text style={s.headerTitle}>{t("stats_title")}</Text>
            <Text style={s.headerSubtitle}>{t("stats_sub")}</Text>
          </View>

          {/* Stats Grid */}
          <View style={s.statsGrid}>
            {STAT_CARDS.map((item, i) => (
              <View key={i} style={s.statCard}>
                <View style={[s.statIconWrap, { backgroundColor: item.bg }]}>
                  <item.icon size={20} color={item.iconColor} />
                </View>
                <Text style={s.statValue}>{item.value}</Text>
                <Text style={s.statLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* Bar Chart */}
          <View style={[s.chartCard, { overflow: "hidden" }]}>
            <View style={s.chartHeader}>
              <Text style={s.chartTitle}>{t("activity_chart")}</Text>
              <View style={s.toggleRow}>
                <TouchableOpacity
                  onPress={() => setRange("week")}
                  style={[s.toggleBtn, range === "week" && s.toggleActive]}
                >
                  <Text style={[s.toggleText, range === "week" && s.toggleTextActive]}>{t("week")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setRange("month")}
                  style={[s.toggleBtn, range === "month" && s.toggleActive]}
                >
                  <Text style={[s.toggleText, range === "month" && s.toggleTextActive]}>{t("month")}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ marginLeft: -10, marginRight: -10, overflow: "hidden" }}>
              <BarChart
                data={BAR_DATA}
                barWidth={W * 0.07}
                spacing={W * 0.03}
                height={160}
                maxValue={Math.max(8, ...BAR_DATA.map(d => d.value))}
                noOfSections={4}
                yAxisThickness={0}
                xAxisThickness={1}
                xAxisColor={C.textLight}
                yAxisTextStyle={s.axisText}
                xAxisLabelTextStyle={s.axisText}
                rulesType="dashed"
                rulesColor="#E0E0E0"
                showYAxisIndices={false}
                isAnimated
                hideRules
                adjustToWidth={false}
              />
            </View>
          </View>

          {/* Line Chart */}
          <View style={[s.chartCard, { overflow: "hidden" }]}>
            <Text style={s.chartTitle}>{t("productivity_trend")}</Text>
            <View style={{ marginLeft: -10, marginRight: -10, overflow: "hidden" }}>
              <LineChart
                data={LINE_DATA}
                height={160}
                maxValue={Math.max(8, ...LINE_DATA.map(d => d.value))}
                noOfSections={4}
                color={C.orange}
                dataPointsColor={C.orange}
                dataPointsRadius={4}
                thickness={2}
                yAxisThickness={0}
                xAxisThickness={1}
                xAxisColor={C.textLight}
                yAxisTextStyle={s.axisText}
                xAxisLabelTextStyle={s.axisText}
                rulesType="dashed"
                rulesColor="#E0E0E0"
                showYAxisIndices={false}
                isAnimated
                hideRules
                adjustToWidth={false}
                dataPointsHeight={4}
                dataPointsWidth={4}
                curved
                areaChart
                startFillColor={C.orange}
                endFillColor={C.orange}
                startOpacity={0.3}
                endOpacity={0.05}
              />
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const getStyles = (C: ReturnType<typeof getThemeColors>, W: number) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: C.bgGray },
    header: {
      backgroundColor: C.orange,
      paddingTop: 50,
      paddingHorizontal: 20,
      paddingBottom: 25,
      borderBottomLeftRadius: 25,
      borderBottomRightRadius: 25,
    },
    backBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(255,255,255,0.2)",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
    },
    headerTitle: { fontSize: 24, fontFamily: "Inter-ExtraBold", color: C.white },
    headerSubtitle: {
      fontSize: 13,
      fontFamily: "Magra-Regular",
      color: C.white,
      opacity: 0.9,
      marginTop: 2,
    },
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      paddingHorizontal: 16,
      gap: 12,
      marginTop: 16,
      justifyContent: "space-between",
    },
    statCard: {
      backgroundColor: C.cardBg,
      borderRadius: 16,
      padding: 14,
      width: (W - 56) / 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    statIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
    },
    statValue: { fontSize: 22, fontFamily: "Inter-ExtraBold", color: C.textDark },
    statLabel: {
      fontSize: 11,
      fontFamily: "Magra-Regular",
      color: C.textGray,
      marginTop: 2,
    },
    chartCard: {
      backgroundColor: C.cardBg,
      marginHorizontal: 16,
      marginTop: 16,
      borderRadius: 20,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    chartHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    chartTitle: { fontSize: 16, fontFamily: "Inter-Bold", color: C.textDark },
    toggleRow: {
      flexDirection: "row",
      backgroundColor: "#F0F0F0",
      borderRadius: 20,
      padding: 2,
    },
    toggleBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 18 },
    toggleActive: { backgroundColor: C.orange },
    toggleText: { fontSize: 12, fontFamily: "Inter-Bold", color: C.textGray },
    toggleTextActive: { color: C.white },
    axisText: { fontSize: 10, color: C.textLight, fontFamily: "Magra-Regular" },
  });
