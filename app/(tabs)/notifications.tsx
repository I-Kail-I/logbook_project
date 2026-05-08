import { getThemeColors } from "@/constants/theme";
import { useSettings } from "@/contexts/SettingsContext";
import { useFadeInOnFocus } from "@/hooks/useFadeInOnFocus";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { ArrowLeft, Bell, FileText, ShieldAlert, Trash2 } from "lucide-react-native";
import React from "react";
import { Animated, Dimensions, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width: W } = Dimensions.get("window");

export default function NotificationsScreen() {
  const router = useRouter();
  const { fadeAnim, slideAnim } = useFadeInOnFocus(400);
  const { t, settings } = useSettings();
  const isDark = settings.theme === "dark";
  const C = getThemeColors(isDark);
  const s = getStyles(C);
  useFonts({
    "Inter-Bold": require("@/assets/fonts/Inter-Bold.ttf"),
    "Inter-ExtraBold": require("@/assets/fonts/Inter-ExtraBold.ttf"),
    "ABeeZee-Regular": require("@/assets/fonts/ABeeZee-Regular.ttf"),
    "Magra-Regular": require("@/assets/fonts/Magra-Regular.ttf"),
  });

  const NOTIFICATIONS = [
    {
      id: 1,
      title: t("reminder_logbook"),
      message: t("reminder_logbook_msg"),
      time: `5 ${t("minutes_ago")}`,
      icon: Bell,
      iconBg: "#FFF4E5",
      iconColor: C.orange,
      unread: true,
    },
    {
      id: 2,
      title: t("logbook_saved"),
      message: t("logbook_saved_msg"),
      time: `1 ${t("hours_ago")}`,
      icon: FileText,
      iconBg: "#EEF2FF",
      iconColor: "#7C3AED",
      unread: true,
    },
    {
      id: 3,
      title: t("report_deadline"),
      message: t("report_deadline_msg"),
      time: `2 ${t("hours_ago")}`,
      icon: ShieldAlert,
      iconBg: "#FEE2E2",
      iconColor: C.red,
      unread: false,
    },
    {
      id: 4,
      title: t("system_update"),
      message: t("system_update_msg"),
      time: `1 ${t("days_ago")}`,
      icon: FileText,
      iconBg: "#E8EAF6",
      iconColor: "#4338CA",
      unread: false,
    },
  ];

  const unreadCount = NOTIFICATIONS.filter((item) => item.unread).length;

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
        <View style={s.header}>
          <View style={s.headerTop}>
            <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
              <ArrowLeft size={24} color={C.white} />
            </TouchableOpacity>
            <Text style={s.headerTitle}>{t("notifications_title")}</Text>
            <View style={s.headerSpacer} />
          </View>
          <Text style={s.headerSubtitle}>
            {unreadCount} {t("unread")}
          </Text>
        </View>

        <ScrollView style={s.content} contentContainerStyle={s.contentContainer} showsVerticalScrollIndicator={false}>
          {NOTIFICATIONS.map((item) => {
            const Icon = item.icon;
            return (
              <View key={item.id} style={s.notificationCard}>
                <View style={s.cardLeft}>
                  <View style={[s.iconWrap, { backgroundColor: item.iconBg }]}>
                    <Icon size={20} color={item.iconColor} />
                  </View>
                  <View style={s.cardText}>
                    <Text style={s.notificationTitle}>{item.title}</Text>
                    <Text style={s.notificationMessage}>{item.message}</Text>
                  </View>
                </View>
                <View style={s.cardRight}>
                  <Text style={s.notificationTime}>{item.time}</Text>
                  <TouchableOpacity style={s.deleteBtn}>
                    <Trash2 size={18} color={C.textLight} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const getStyles = (C: ReturnType<typeof getThemeColors>) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: C.bgGray,
    },
    header: {
      backgroundColor: C.orange,
      paddingTop: 48,
      paddingBottom: 24,
      paddingHorizontal: 24,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
    },
    headerTop: {
      flexDirection: "column",
      marginTop: 20,
    },
    backBtn: {
      width: 44,
      height: 44,
      borderRadius: 100,
      backgroundColor: "rgba(255,255,255,0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      marginTop: 9,
      color: C.white,
      fontSize: 25,
      fontFamily: "Inter-Bold",
    },
    headerSpacer: {
      width: 44,
    },
    headerSubtitle: {
      marginTop: 5,
      color: "rgba(255,255,255,0.87)",
      fontSize: 14,
      fontFamily: "ABeeZee-Regular",
    },
    content: {
      flex: 1,
      marginTop: 10,
    },
    contentContainer: {
      paddingHorizontal: 24,
      paddingBottom: 32,
    },
    notificationCard: {
      backgroundColor: C.white,
      borderRadius: 20,
      padding: 16,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 4,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    cardLeft: {
      flex: 1,
      flexDirection: "row",
      alignItems: "flex-start",
    },
    iconWrap: {
      width: 48,
      height: 48,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    cardText: {
      flex: 1,
    },
    notificationTitle: {
      color: C.textDark,
      fontSize: 16,
      fontFamily: "Inter-Bold",
      marginBottom: 6,
    },
    notificationMessage: {
      color: C.textGray,
      fontSize: 14,
      fontFamily: "ABeeZee-Regular",
      lineHeight: 20,
    },
    cardRight: {
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginLeft: 12,
    },
    notificationTime: {
      color: C.textLight,
      fontSize: 12,
      fontFamily: "ABeeZee-Regular",
    },
    deleteBtn: {
      marginTop: 12,
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: C.bgGray,
      justifyContent: "center",
      alignItems: "center",
    },
  });
