import { getThemeColors } from "@/constants/theme";
import { useSettings } from "@/contexts/SettingsContext";
import { useFadeInOnFocus } from "@/hooks/useFadeInOnFocus";
import { CalendarDays, Clock3, Link2, LogOut, Search, Shield } from "lucide-react-native";
import React from "react";
import { Animated, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const LOGS = [
  {
    id: "A",
    name: "Athiyuatyuyun",
    nip: "092928365181",
    title: "Dokumen PNS",
    desc: "Pengerjaan dokumen administrasi kepegawaian.",
    time: "08:00 - 09:15",
    evidence: true,
  },
  {
    id: "B",
    name: "Budi Santoso",
    nip: "092928365182",
    title: "Maintenance Server",
    desc: "Perawatan server utama dan backup data bulanan.",
    time: "08:30 - 10:00",
    evidence: false,
  },
];

export default function AdminLogbookScreen() {
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
            <Text style={s.headerTitle}>Logbook Pegawai</Text>
          </View>

          <View style={s.summaryCard}>
            <Text style={s.summaryLabel}>Total Aktivitas</Text>
            <Text style={s.summaryValue}>6</Text>
            <Text style={s.summarySub}>Mode pemantauan - hanya melihat</Text>
          </View>

          <View style={s.searchBox}>
            <Search size={18} color={C.textLight} />
            <TextInput placeholder="Cari pegawai atau aktivitas..." placeholderTextColor={C.textLight} style={s.searchInput} />
          </View>

          <View style={s.dayRow}>
            <CalendarDays size={14} color={C.orange} />
            <Text style={s.dayText}>12 Feb 2026</Text>
            <Text style={s.daySub}>- 3 aktivitas</Text>
          </View>

          {LOGS.map((log) => (
            <View key={log.name + log.title} style={s.logCard}>
              <View style={s.logTop}>
                <View style={s.avatar}>
                  <Text style={s.avatarText}>{log.id}</Text>
                </View>
                <View style={s.personInfo}>
                  <Text style={s.personName}>{log.name}</Text>
                  <Text style={s.personNip}>{log.nip}</Text>
                </View>
                {log.evidence && (
                  <View style={s.evidenceBadge}>
                    <Link2 size={12} color={C.orange} />
                    <Text style={s.evidenceText}>Bukti</Text>
                  </View>
                )}
              </View>
              <View style={s.logBody}>
                <Text style={s.logTitle}>{log.title}</Text>
                <Text style={s.logDesc}>{log.desc}</Text>
                <View style={s.timeRow}>
                  <Clock3 size={14} color={C.textLight} />
                  <Text style={s.timeText}>{log.time}</Text>
                </View>
              </View>
            </View>
          ))}
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
    headerTitle: { color: C.white, fontSize: 30, fontWeight: "700" },
    summaryCard: {
      marginHorizontal: 16,
      marginTop: -18,
      backgroundColor: C.cardBg,
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: C.border,
    },
    summaryLabel: { color: C.textGray, fontSize: 14, marginBottom: 4 },
    summaryValue: { color: C.textDark, fontSize: 38, fontWeight: "700" },
    summarySub: { color: C.textGray, fontSize: 14, marginTop: 2 },
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
    dayRow: { marginTop: 14, marginHorizontal: 16, flexDirection: "row", alignItems: "center", gap: 8 },
    dayText: { color: C.textDark, fontWeight: "700", fontSize: 14 },
    daySub: { color: C.textGray, fontSize: 13 },
    logCard: {
      marginTop: 10,
      marginHorizontal: 16,
      borderWidth: 1,
      borderColor: C.border,
      borderRadius: 20,
      backgroundColor: C.cardBg,
      padding: 14,
    },
    logTop: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: C.orange,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 10,
    },
    avatarText: { color: C.white, fontWeight: "700", fontSize: 16 },
    personInfo: { flex: 1 },
    personName: { color: C.textDark, fontSize: 18, fontWeight: "700" },
    personNip: { color: C.textGray, fontSize: 13 },
    evidenceBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: C.iconBgOrange,
      borderRadius: 10,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    evidenceText: { color: C.orange, fontSize: 12, fontWeight: "600" },
    logBody: { borderLeftWidth: 2, borderLeftColor: C.orangeLight, paddingLeft: 10, marginLeft: 4 },
    logTitle: { color: C.textDark, fontSize: 18, fontWeight: "700", marginBottom: 2 },
    logDesc: { color: C.textGray, fontSize: 14, marginBottom: 6 },
    timeRow: { flexDirection: "row", alignItems: "center", gap: 5 },
    timeText: { color: C.textLight, fontSize: 13 },
  });
