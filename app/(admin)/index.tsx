import { getThemeColors } from "@/constants/theme";
import { useSettings } from "@/contexts/SettingsContext";
import { useFadeInOnFocus } from "@/hooks/useFadeInOnFocus";
import { LogOut, Shield, TrendingUp, UserRound, Users } from "lucide-react-native";
import React from "react";
import { Animated, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AdminDashboardScreen() {
  const { settings } = useSettings();
  const { fadeAnim, slideAnim } = useFadeInOnFocus(400, settings.reducedMotion);
  const isDark = settings.theme === "dark";
  const C = getThemeColors(isDark, settings.highContrast);
  const s = getStyles(C);

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.orange} />
      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.contentContainer}>
          <View style={s.header}>
            <View style={s.headerTop}>
              <View style={s.headerBadge}>
                <Shield size={18} color={C.white} />
              </View>
              <TouchableOpacity style={s.logoutBtn}>
                <LogOut size={18} color={C.white} />
              </TouchableOpacity>
            </View>
            <Text style={s.headerLabel}>PANEL ADMIN</Text>
            <Text style={s.headerTitle}>Dashboard</Text>
          </View>

          <View style={s.summaryCard}>
            <Text style={s.summaryLabel}>Ringkasan Hari Ini</Text>
            <Text style={s.summaryValue}>12 Logbook Baru</Text>
            <View style={s.summaryTrend}>
              <TrendingUp size={14} color={C.green} />
              <Text style={s.summaryTrendText}>+18% dari kemarin</Text>
            </View>
          </View>

          <View style={s.statsGrid}>
            <View style={s.statCard}>
              <View style={[s.statIcon, { backgroundColor: C.iconBgOrange }]}>
                <Users size={16} color={C.orange} />
              </View>
              <Text style={s.statValue}>48</Text>
              <Text style={s.statLabel}>Pegawai</Text>
            </View>
            <View style={s.statCard}>
              <View style={[s.statIcon, { backgroundColor: C.iconBgPurple }]}>
                <UserRound size={16} color="#8B5CF6" />
              </View>
              <Text style={s.statValue}>1,247</Text>
              <Text style={s.statLabel}>Total Logbook</Text>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const getStyles = (C: ReturnType<typeof getThemeColors>) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: C.bgGray },
    contentContainer: { paddingBottom: 100 },
    header: {
      backgroundColor: C.orange,
      paddingTop: 50,
      paddingHorizontal: 20,
      paddingBottom: 30,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
    },
    headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
    headerBadge: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(255,255,255,0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    logoutBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(255,255,255,0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    headerLabel: { color: C.white, opacity: 0.9, fontSize: 12, letterSpacing: 1.5, marginBottom: 6 },
    headerTitle: { color: C.white, fontSize: 32, fontWeight: "700" },
    summaryCard: {
      marginHorizontal: 16,
      marginTop: -18,
      backgroundColor: C.cardBg,
      borderRadius: 20,
      padding: 18,
      borderWidth: 1,
      borderColor: C.border,
    },
    summaryLabel: { color: C.textGray, fontSize: 14, marginBottom: 6 },
    summaryValue: { color: C.textDark, fontSize: 34, fontWeight: "700" },
    summaryTrend: { marginTop: 10, flexDirection: "row", alignItems: "center", gap: 6 },
    summaryTrendText: { color: C.green, fontSize: 13, fontWeight: "600" },
    statsGrid: { flexDirection: "row", gap: 12, marginTop: 14, paddingHorizontal: 16 },
    statCard: {
      flex: 1,
      backgroundColor: C.cardBg,
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: C.border,
    },
    statIcon: {
      width: 34,
      height: 34,
      borderRadius: 17,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
    },
    statValue: { color: C.textDark, fontSize: 30, fontWeight: "700" },
    statLabel: { color: C.textGray, fontSize: 14, marginTop: 2 },
  });
