import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  TrendingUp,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart, LineChart } from "react-native-gifted-charts";

const { width: W } = Dimensions.get("window");
const C = {
  orange: "#F5A623",
  orangeDark: "#E08A0E",
  orangeLight: "#FFB84D",
  white: "#FFFFFF",
  textDark: "#1A1A1A",
  textGray: "#666666",
  textLight: "#999999",
  bgGray: "#F5F5F5",
  cardBg: "#FFFFFF",
};

const BAR_DATA = [
  { value: 4, label: "Sen", frontColor: C.orange },
  { value: 6, label: "Sel", frontColor: C.orange },
  { value: 3, label: "Rab", frontColor: C.orange },
  { value: 8, label: "Kam", frontColor: C.orange },
  { value: 5, label: "Jum", frontColor: C.orange },
  { value: 2, label: "Sab", frontColor: C.orange },
  { value: 0, label: "Min", frontColor: C.orange },
];

const LINE_DATA = [
  { value: 4, label: "Sen" },
  { value: 6, label: "Sel" },
  { value: 3, label: "Rab" },
  { value: 8, label: "Kam" },
  { value: 5, label: "Jum" },
  { value: 2, label: "Sab" },
  { value: 0, label: "Min" },
];

const STAT_CARDS = [
  {
    icon: FileText,
    value: "156",
    label: "Total Logbook",
    bg: "#FFF4E5",
    iconColor: C.orange,
  },
  {
    icon: Calendar,
    value: "28",
    label: "Bulan Ini",
    bg: "#F3E8FF",
    iconColor: "#8B5CF6",
  },
  {
    icon: TrendingUp,
    value: "4.2",
    label: "Rata-rata/Hari",
    bg: "#DCFCE7",
    iconColor: "#22C55E",
  },
  {
    icon: Clock,
    value: "312",
    label: "Total Jam",
    bg: "#E0E7FF",
    iconColor: "#6366F1",
  },
];

export default function StatistikScreen() {
  const router = useRouter();
  const [range, setRange] = useState<"minggu" | "bulan">("minggu");
  useFonts({
    "Inter-Bold": require("@/assets/fonts/Inter-Bold.ttf"),
    "Inter-ExtraBold": require("@/assets/fonts/Inter-ExtraBold.ttf"),
    "ABeeZee-Regular": require("@/assets/fonts/ABeeZee-Regular.ttf"),
    "Magra-Regular": require("@/assets/fonts/Magra-Regular.ttf"),
  });

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.orange} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={24} color={C.white} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Statistik</Text>
          <Text style={s.headerSubtitle}>Analisis aktivitas logbook Anda</Text>
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
            <Text style={s.chartTitle}>Grafik Aktivitas</Text>
            <View style={s.toggleRow}>
              <TouchableOpacity
                onPress={() => setRange("minggu")}
                style={[s.toggleBtn, range === "minggu" && s.toggleActive]}
              >
                <Text
                  style={[
                    s.toggleText,
                    range === "minggu" && s.toggleTextActive,
                  ]}
                >
                  Minggu
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setRange("bulan")}
                style={[s.toggleBtn, range === "bulan" && s.toggleActive]}
              >
                <Text
                  style={[
                    s.toggleText,
                    range === "bulan" && s.toggleTextActive,
                  ]}
                >
                  Bulan
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ marginLeft: -10, marginRight: -10 }}>
            <BarChart
              data={BAR_DATA}
              barWidth={W * 0.07}
              spacing={W * 0.03}
              height={160}
              maxValue={8}
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
            />
          </View>
        </View>

        {/* Line Chart */}
        <View style={[s.chartCard, { overflow: "hidden" }]}>
          <Text style={s.chartTitle}>Tren Produktivitas</Text>
          <View style={{ marginLeft: -10, marginRight: -10 }}>
            <LineChart
              data={LINE_DATA}
              height={160}
              maxValue={8}
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
            />
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
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
