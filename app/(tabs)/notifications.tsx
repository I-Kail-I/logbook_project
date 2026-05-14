import { getThemeColors } from "@/constants/theme";
import { useSettings } from "@/contexts/SettingsContext";
import { useFadeInOnFocus } from "@/hooks/useFadeInOnFocus";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { ArrowLeft, Bell, FileText, ShieldAlert, Trash2 } from "lucide-react-native";
import React, { useEffect, useState, useCallback } from "react";
import { Animated, Dimensions, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import notificationService, { NotificationItem } from "@/services/notifications";

const { width: W } = Dimensions.get("window");

const ICON_MAP: Record<string, { icon: any; bg: string; color: string }> = {
  logbook_saved: { icon: FileText, bg: "#EEF2FF", color: "#7C3AED" },
  logbook_added: { icon: Bell, bg: "#FFF4E5", color: "#F5A623" },
  reminder: { icon: ShieldAlert, bg: "#FEE2E2", color: "#EF4444" },
};

export default function NotificationsScreen() {
  const router = useRouter();
  const { t, settings } = useSettings();
  const { fadeAnim, slideAnim } = useFadeInOnFocus(400, settings.reducedMotion);
  const isDark = settings.theme === "dark";
  const C = getThemeColors(isDark, settings.highContrast);
  const s = getStyles(C);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useFonts({
    "Inter-Bold": require("@/assets/fonts/Inter-Bold.ttf"),
    "Inter-ExtraBold": require("@/assets/fonts/Inter-ExtraBold.ttf"),
    "ABeeZee-Regular": require("@/assets/fonts/ABeeZee-Regular.ttf"),
    "Magra-Regular": require("@/assets/fonts/Magra-Regular.ttf"),
  });

  const loadNotifications = useCallback(async () => {
    const items = await notificationService.getHistory();
    setNotifications(items);
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleDelete = async (id: string) => {
    await notificationService.deleteNotification(id);
    loadNotifications();
  };

  const unreadCount = notifications.filter((item) => item.unread).length;

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
          </View>
          <Text style={s.headerTitle}>{t("notifications_title")}</Text>
          <Text style={s.headerSubtitle}>
            {unreadCount} {t("unread")}
          </Text>
        </View>

        <ScrollView
          style={s.content}
          contentContainerStyle={s.contentContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={loadNotifications} tintColor={C.orange} progressViewOffset={110} />
          }
        >
          {notifications.length === 0 ? (
            <View style={s.emptyState}>
              <Bell size={48} color={C.textLight} />
              <Text style={s.emptyText}>Belum ada notifikasi</Text>
            </View>
          ) : (
            notifications.map((item) => {
              const meta = ICON_MAP[item.type] || ICON_MAP.logbook_saved;
              const Icon = meta.icon;
              return (
                <View key={item.id} style={[s.notificationCard, item.unread && s.notificationCardUnread]}>
                  <View style={s.cardLeft}>
                    <View style={[s.iconWrap, { backgroundColor: meta.bg }]}>
                      <Icon size={20} color={meta.color} />
                    </View>
                    <View style={s.cardText}>
                      <Text style={s.notificationTitle}>{item.title}</Text>
                      <Text style={s.notificationMessage}>{item.message}</Text>
                    </View>
                  </View>
                  <View style={s.cardRight}>
                    <Text style={s.notificationTime}>{item.time}</Text>
                    <TouchableOpacity style={s.deleteBtn} onPress={() => handleDelete(item.id)}>
                      <Trash2 size={18} color={C.textLight} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
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
      paddingTop: 50,
      paddingBottom: 30,
      paddingHorizontal: 20,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
    },
    headerTop: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
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
      color: C.white,
      fontSize: 24,
      fontFamily: "Inter-ExtraBold",
      marginBottom: 4,
    },
    headerSubtitle: {
      color: "rgba(255,255,255,0.87)",
      fontSize: 14,
      fontFamily: "Magra-Regular",
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 100,
    },
    notificationCard: {
      backgroundColor: C.cardBg,
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
      color: C.textLight,
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

    notificationCardUnread: {
      borderLeftWidth: 3,
      borderLeftColor: C.orange,
    },

    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 80,
      gap: 16,
    },

    emptyText: {
      fontSize: 16,
      color: C.textLight,
      fontFamily: "Magra-Regular",
    },
  });
