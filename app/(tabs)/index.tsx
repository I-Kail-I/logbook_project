import { getThemeColors } from "@/constants/theme";
import { useSettings } from "@/contexts/SettingsContext";
import { useFadeInOnFocus } from "@/hooks/useFadeInOnFocus";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { BarChart3, Bell, Calendar, Clock, FileText, Plus, Printer } from "lucide-react-native";
import React from "react";
import { Animated, Dimensions, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width: W, height: H } = Dimensions.get("window");

const ACTIVITIES = [
  {
    id: 1,
    time: "8.00 - 09.15",
    statusKey: "completed" as const,
    title: "Dokumen DOKSLI Asli",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam in euismod augue.",
    iconColor: "#F5A623",
  },
  {
    id: 2,
    time: "8.00 - 09.15",
    statusKey: "completed" as const,
    title: "Dokumen DOKSLI Asli",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam in euismod augue.",
    iconColor: "#F5A623",
  },
];

export default function DashboardScreen() {
  const router = useRouter();
  const { fadeAnim, slideAnim } = useFadeInOnFocus(400);
  const { t, settings } = useSettings();
  const isDark = settings.theme === "dark";
  const C = getThemeColors(isDark);
  const s = getStyles(C);

  const [fontsLoaded] = useFonts({
    "Inter-Bold": require("@/assets/fonts/Inter-Bold.ttf"),
    "Inter-ExtraBold": require("@/assets/fonts/Inter-ExtraBold.ttf"),
    "ABeeZee-Regular": require("@/assets/fonts/ABeeZee-Regular.ttf"),
    "Magra-Regular": require("@/assets/fonts/Magra-Regular.ttf"),
    "Magra-Bold": require("@/assets/fonts/Magra-Bold.ttf"),
  });

  const locale = settings.language === "id" ? "id-ID" : "en-US";
  const today = new Date().toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.orange} />

      <View style={{ backgroundColor: C.orange, height: 1 }} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {/* Header Section */}
          <View style={s.header}>
            {/* Date & Notification */}
            <View style={s.headerTop}>
              <View style={s.dateRow}>
                <Calendar size={18} color={C.white} />
                <Text style={s.dateText}>{today}</Text>
              </View>
              <TouchableOpacity style={s.bellBtn} onPress={() => router.push("/(tabs)/notifications")}>
                <Bell size={20} color={C.white} />
                <View style={s.bellBadge} />
              </TouchableOpacity>
            </View>

            {/* User Profile */}
            <View style={s.userRow}>
              <View style={s.avatar}>
                <View style={s.avatarInner}>
                  <Text style={s.avatarText}>R</Text>
                </View>
              </View>
              <View style={s.greeting}>
                <Text style={s.greetingText}>{t("greeting_morning")}</Text>
                <Text style={s.userName}>RAJAMUDA ASDI</Text>
              </View>
            </View>

            {/* Action Cards */}
            <View style={s.actionCards}>
              <TouchableOpacity
                style={s.actionCard}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/logbook",
                    params: { openModal: "true" },
                  })
                }
              >
                <View style={[s.actionIcon, { backgroundColor: C.orangeLight }]}>
                  <Plus size={24} color={C.orangeDark} />
                </View>
                <View>
                  <Text style={s.actionTitle}>{t("add_log")}</Text>
                  <Text style={s.actionSubtitle}>{t("add_log_sub")}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={s.actionCard} onPress={() => router.push("/(tabs)/statistik")}>
                <View style={[s.actionIcon, { backgroundColor: "#E8D5F7" }]}>
                  <BarChart3 size={24} color="#8B5CF6" />
                </View>
                <View>
                  <Text style={s.actionTitle}>{t("statistics")}</Text>
                  <Text style={s.actionSubtitle}>{t("statistics_sub")}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Content Section */}
          <View style={s.content}>
            {/* Section Header */}
            <View style={s.sectionHeader}>
              <View style={s.sectionTitleRow}>
                <FileText size={20} color={C.orange} />
                <Text style={s.sectionTitle}>{t("today_activity")}</Text>
              </View>
              <TouchableOpacity>
                <Printer size={20} color={C.textGray} />
              </TouchableOpacity>
            </View>
            <Text style={s.sectionDate}>{today}</Text>

            {/* Activity Cards */}
            {ACTIVITIES.map((item) => (
              <View key={item.id} style={s.activityCard}>
                <View style={s.activityHeader}>
                  <View style={s.activityTimeRow}>
                    <Clock size={14} color={C.textLight} />
                    <Text style={s.activityTime}>{item.time}</Text>
                  </View>
                  <View style={s.statusBadge}>
                    <Text style={s.statusText}>{t(item.statusKey)}</Text>
                  </View>
                </View>

                <View style={s.activityBody}>
                  <View style={[s.activityIcon, { backgroundColor: item.iconColor }]}>
                    <FileText size={20} color={C.white} />
                  </View>
                  <View style={s.activityContent}>
                    <Text style={s.activityTitle}>{item.title}</Text>
                    <Text style={s.activityDesc}>{item.desc}</Text>
                  </View>
                </View>
              </View>
            ))}

            {/* Bottom spacing for tab bar */}
            <View style={{ height: 100 }} />
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const getStyles = (C: ReturnType<typeof getThemeColors>) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: C.bgGray,
    },

    // Header
    header: {
      backgroundColor: C.orange,
      paddingTop: 50,
      paddingHorizontal: 20,
      paddingBottom: 30,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
    },
    headerTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    dateRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    dateText: {
      color: C.white,
      fontSize: 13,
      fontFamily: "Magra-Regular",
    },
    bellBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(255,255,255,0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    bellBadge: {
      position: "absolute",
      top: 8,
      right: 10,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "#FF4444",
    },

    // User
    userRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 15,
      marginBottom: 25,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 16,
      backgroundColor: "rgba(255,255,255,0.3)",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: C.white,
    },
    avatarInner: {
      width: 50,
      height: 50,
      borderRadius: 12,
      backgroundColor: C.orangeLight,
      justifyContent: "center",
      alignItems: "center",
    },
    avatarText: {
      fontSize: 24,
      color: C.white,
      fontWeight: "600",
    },
    greeting: {
      flex: 1,
    },
    greetingText: {
      color: C.white,
      fontSize: 14,
      fontFamily: "Magra-Regular",
      opacity: 0.9,
      marginBottom: 4,
    },
    userName: {
      color: C.white,
      fontSize: 20,
      fontFamily: "Inter-ExtraBold",
      letterSpacing: 0.5,
    },

    // Action Cards
    actionCards: {
      flexDirection: "row",
      gap: 12,
    },
    actionCard: {
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
    actionIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    actionTitle: {
      fontSize: 14,
      fontFamily: "Inter-Bold",
      color: "#1A1A1A",
      marginBottom: 2,
    },
    actionSubtitle: {
      fontSize: 11,
      color: "#666666",
      fontFamily: "Magra-Regular",
    },

    // Content
    content: {
      paddingHorizontal: 20,
      paddingTop: 25,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
    },
    sectionTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    sectionTitle: {
      fontSize: 16,
      fontFamily: "Inter-Bold",
      color: C.textDark,
    },
    sectionDate: {
      fontSize: 12,
      color: C.textLight,
      fontFamily: "Magra-Regular",
      marginBottom: 20,
    },

    // Activity Cards
    activityCard: {
      backgroundColor: C.cardBg,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
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
      backgroundColor: C.greenLight,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusText: {
      fontSize: 11,
      color: C.green,
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
