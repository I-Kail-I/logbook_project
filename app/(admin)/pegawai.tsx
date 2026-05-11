import { getThemeColors } from "@/constants/theme";
import { useSettings } from "@/contexts/SettingsContext";
import { useFadeInOnFocus } from "@/hooks/useFadeInOnFocus";
import { LogOut, Search, Shield, Users } from "lucide-react-native";
import React from "react";
import { Animated, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const EMPLOYEES = [
  { id: "A", name: "Athiyuatyuyun", unit: "Kepegawaian", active: true },
  { id: "B", name: "Budi Santoso", unit: "Teknologi Informasi", active: true },
  { id: "C", name: "Citra Dewi", unit: "Keuangan", active: true },
  { id: "D", name: "Dani Prasetyo", unit: "Hukum", active: false },
];

export default function AdminPegawaiScreen() {
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
            <Text style={s.headerTitle}>Pegawai</Text>
          </View>

          <View style={s.statRow}>
            <View style={s.statCard}>
              <Text style={s.statLabel}>Total</Text>
              <Text style={s.statValue}>6</Text>
            </View>
            <View style={s.statCard}>
              <Text style={s.statLabel}>Aktif</Text>
              <Text style={[s.statValue, { color: C.green }]}>5</Text>
            </View>
          </View>

          <View style={s.searchBox}>
            <Search size={18} color={C.textLight} />
            <TextInput placeholder="Cari nama atau NIP..." placeholderTextColor={C.textLight} style={s.searchInput} />
          </View>

          <View style={s.listCard}>
            {EMPLOYEES.map((emp, idx) => (
              <View key={emp.id} style={[s.employeeRow, idx < EMPLOYEES.length - 1 && s.employeeDivider]}>
                <View style={s.avatar}>
                  <Text style={s.avatarText}>{emp.id}</Text>
                </View>
                <View style={s.employeeInfo}>
                  <Text style={s.employeeName}>{emp.name}</Text>
                  <Text style={s.employeeUnit}>{emp.unit}</Text>
                </View>
                <View style={[s.badge, { backgroundColor: emp.active ? C.greenLight : C.redLight }]}>
                  <Text style={[s.badgeText, { color: emp.active ? C.green : C.red }]}>
                    {emp.active ? "Aktif" : "Nonaktif"}
                  </Text>
                </View>
              </View>
            ))}
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
    statRow: { flexDirection: "row", gap: 12, marginHorizontal: 16, marginTop: -18 },
    statCard: {
      flex: 1,
      backgroundColor: C.cardBg,
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: C.border,
    },
    statLabel: { color: C.textGray, fontSize: 14, marginBottom: 4 },
    statValue: { color: C.textDark, fontSize: 34, fontWeight: "700" },
    searchBox: {
      marginHorizontal: 16,
      marginTop: 14,
      borderWidth: 1,
      borderColor: C.border,
      borderRadius: 20,
      backgroundColor: C.cardBg,
      paddingHorizontal: 14,
      paddingVertical: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    searchInput: { flex: 1, color: C.textDark, fontSize: 16 },
    listCard: {
      marginHorizontal: 16,
      marginTop: 14,
      borderWidth: 1,
      borderColor: C.border,
      borderRadius: 22,
      backgroundColor: C.cardBg,
      overflow: "hidden",
    },
    employeeRow: { flexDirection: "row", alignItems: "center", padding: 12 },
    employeeDivider: { borderBottomWidth: 1, borderBottomColor: C.divider },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: C.orange,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    avatarText: { color: C.white, fontWeight: "700", fontSize: 17 },
    employeeInfo: { flex: 1 },
    employeeName: { color: C.textDark, fontSize: 22, fontWeight: "700" },
    employeeUnit: { color: C.textGray, fontSize: 15 },
    badge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5 },
    badgeText: { fontSize: 12, fontWeight: "600" },
  });
