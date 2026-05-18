import { ActivityCard, ActivityDetailModal, PrintPreviewModal, type Activity } from "@/components";
import { getThemeColors } from "@/constants/theme";
import { useSettings } from "@/contexts/SettingsContext";
import { useFadeInOnFocus } from "@/hooks/useFadeInOnFocus";
import { createRefreshHandler } from "@/utils/refresh";
import { useFonts } from "expo-font";
import * as Haptics from "expo-haptics";
import * as Print from "expo-print";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { BarChart3, Bell, Calendar, Check, FileText, Plus, Printer, X } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Animated, Dimensions, Image, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import logbookService from "@/services/logbook";
import storage from "@/services/storage";
import auth from "@/services/auth";
import notificationService from "@/services/notifications";
import { Logbook as LogbookType } from "@/services/types";

const { width: W, height: H } = Dimensions.get("window");

export default function DashboardScreen() {
  const router = useRouter();
  const { t, settings } = useSettings();
  const { fadeAnim, slideAnim } = useFadeInOnFocus(400, settings.reducedMotion);
  const isDark = settings.theme === "dark";
  const C = getThemeColors(isDark, settings.highContrast);
  const s = getStyles(C);

  const [selectedActivities, setSelectedActivities] = useState<number[]>([]);
  const [selectMode, setSelectMode] = useState(false);
  const [detailActivity, setDetailActivity] = useState<Activity | null>(null);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [previewActivities, setPreviewActivities] = useState<Activity[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [logbooks, setLogbooks] = useState<LogbookType[]>([]);
  const [loadingLogbooks, setLoadingLogbooks] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    const count = await notificationService.getUnreadCount();
    setUnreadCount(count);
  }, []);

  const fetchLogbooks = useCallback(async () => {
    setLoadingLogbooks(true);
    const result = await logbookService.getLogbook();
    if (result.success && result.data) {
      setLogbooks(result.data);
    }
    setLoadingLogbooks(false);
  }, []);

  const fetchUserName = useCallback(async () => {
    const user = await auth.getCurrentUser();
    if (user?.name) {
      setUserName(user.name);
    } else {
      const storedName = await storage.getUserName();
      if (storedName) {
        setUserName(storedName);
      }
    }
    const pic = await storage.getProfilePicture();
    setProfilePicture(pic);
  }, []);

  useEffect(() => {
    fetchLogbooks();
    fetchUserName();
    fetchUnreadCount();
  }, [fetchLogbooks, fetchUserName, fetchUnreadCount]);

  const [fontsLoaded] = useFonts({
    "Inter-Bold": require("@/assets/fonts/Inter-Bold.ttf"),
    "Inter-ExtraBold": require("@/assets/fonts/Inter-ExtraBold.ttf"),
    "ABeeZee-Regular": require("@/assets/fonts/ABeeZee-Regular.ttf"),
    "Magra-Regular": require("@/assets/fonts/Magra-Regular.ttf"),
    "Magra-Bold": require("@/assets/fonts/Magra-Bold.ttf"),
  });

  void W;
  void H;
  void fontsLoaded;

  const locale = settings.language === "id" ? "id-ID" : "en-US";
  const today = new Date().toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const toggleSelection = (id: number) => {
    setSelectedActivities((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    setSelectedActivities([]);
  };

  const generateHTML = (activities: Activity[]) => {
    const isEnglish = settings.language === "en";
    const rows = activities
      .map((item) => {
        const statusText =
          item.statusKey === "completed"
            ? isEnglish
              ? "Completed"
              : "Selesai"
            : item.statusKey === "in_progress"
              ? isEnglish
                ? "In Progress"
                : "Dalam Proses"
              : isEnglish
                ? "Pending"
                : "Menunggu";
        return `
      <tr style="border-bottom: 1px solid #E0E0E0;">
        <td style="padding: 12px; font-size: 14px;">${item.time}</td>
        <td style="padding: 12px; font-size: 14px;">${item.title}</td>
        <td style="padding: 12px; font-size: 14px;">${item.category || "-"}</td>
        <td style="padding: 12px; font-size: 14px;">${statusText}</td>
        <td style="padding: 12px; font-size: 14px;">${item.desc}</td>
      </tr>
    `;
      })
      .join("");

    const headers = isEnglish
      ? { time: "Time", activity: "Activity", category: "Category", status: "Status", desc: "Description" }
      : { time: "Waktu", activity: "Aktivitas", category: "Kategori", status: "Status", desc: "Deskripsi" };
    const title = isEnglish ? "Daily Logbook" : "Logbook Harian";

    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #F5A623; font-size: 24px; margin-bottom: 8px; }
            .date { color: #666; font-size: 14px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th { background-color: #F5A623; color: white; padding: 12px; text-align: left; font-size: 14px; }
            td { padding: 12px; font-size: 14px; color: #333; }
            tr:nth-child(even) { background-color: #F5F5F5; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <p class="date">${today}</p>
          <table>
            <thead>
              <tr>
                <th>${headers.time}</th>
                <th>${headers.activity}</th>
                <th>${headers.category}</th>
                <th>${headers.status}</th>
                <th>${headers.desc}</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </body>
      </html>
    `;
  };

  const handlePrint = async (activities: Activity[]) => {
    try {
      const html = generateHTML(activities);
      const { uri } = await Print.printToFileAsync({ html });
      await Print.printAsync({ uri });
    } catch (error) {
      console.log("Print error:", error);
    }
  };

  const handleSharePDF = async (activities: Activity[]) => {
    try {
      const html = generateHTML(activities);
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Bagikan Logbook",
      });
    } catch (error) {
      console.log("Share error:", error);
    }
  };

  const openPrintPreview = (activities: Activity[]) => {
    setPreviewActivities(activities);
    setShowPrintPreview(true);
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      completed: t("completed"),
      in_progress: t("in_progress_status"),
      pending: t("pending_status"),
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      completed: "#4CAF50",
      in_progress: "#F5A623",
      pending: "#999999",
    };
    return colorMap[status] || "#999999";
  };

  const onRefresh = useCallback(
    createRefreshHandler(
      setRefreshing,
      async () => {
        await fetchLogbooks();
        await fetchUserName();
        await fetchUnreadCount();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      },
    ),
    [fetchLogbooks, fetchUserName, fetchUnreadCount],
  );

  const convertLogbookToActivity = useCallback((log: LogbookType): Activity => {
    const statusKey = (log.status as "completed" | "in_progress" | "pending") || "pending";
    return {
      id: log.id,
      time: log.aktifitas || "00:00 - 00:00",
      statusKey,
      title: log.aktifitas || "",
      desc: log.deskripsiPekerjaan || "",
      iconColor: statusKey === "completed" ? "#4CAF50" : statusKey === "in_progress" ? "#F5A623" : "#999999",
      category: log.tupoksiDdl,
      date: log.tanggal,
      evidence: log.fileDokumenLogbook,
    };
  }, []);

  const activities = logbooks.map(convertLogbookToActivity);

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.orange} />

      <View style={{ backgroundColor: C.orange, height: 1 }} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDark ? C.orange : "#fff"}
            colors={[isDark ? C.orange : "#F5A623"]}
            progressBackgroundColor={isDark ? undefined : "#fff"}
            progressViewOffset={180}
          />
        }
      >
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
                {unreadCount > 0 && <View style={s.bellBadge} />}
              </TouchableOpacity>
            </View>

            {/* User Profile */}
            <View style={s.userRow}>
              <View style={s.avatar}>
                {profilePicture ? (
                  <Image source={{ uri: profilePicture }} style={s.avatarImage} />
                ) : (
                  <View style={s.avatarInner}>
                    <Text style={s.avatarText}>{userName ? userName[0] : "U"}</Text>
                  </View>
                )}
              </View>
              <View style={s.greeting}>
                <Text style={s.greetingText}>{t("greeting_morning")}</Text>
                <Text style={s.userName}>{userName || "User"}</Text>
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
              <View style={{ flexDirection: "row", gap: 8 }}>
                {selectMode ? (
                  <>
                    <TouchableOpacity
                      style={[s.printBtn, selectedActivities.length === 0 && s.printBtnDisabled]}
                      onPress={() => {
                        if (selectedActivities.length > 0) {
                          const toPrint = activities.filter((a) => selectedActivities.includes(a.id));
                          openPrintPreview(toPrint);
                        }
                      }}
                      disabled={selectedActivities.length === 0}
                    >
                      <Printer size={18} color={selectedActivities.length > 0 ? C.orange : "#999"} />
                    </TouchableOpacity>
                    <TouchableOpacity style={s.printBtn} onPress={toggleSelectMode}>
                      <X size={18} color={C.textGray} />
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity style={s.printBtn} onPress={toggleSelectMode}>
                    <Printer size={18} color={C.textGray} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <Text style={s.sectionDate}>{today}</Text>

            {/* Activity Cards */}
            {loadingLogbooks ? (
              <Text style={s.sectionDate}>Loading...</Text>
            ) : activities.length > 0 ? (
              activities.map((item) => (
              <View
                key={item.id}
                style={[s.cardWrapper, selectMode && selectedActivities.includes(item.id) && s.cardWrapperSelected]}
              >
                <ActivityCard
                  activity={item}
                  isDark={isDark}
                  highContrast={settings.highContrast}
                  onPress={() => {
                    if (selectMode) {
                      toggleSelection(item.id);
                    } else {
                      setDetailActivity(item);
                    }
                  }}
                  onLongPress={() => {
                    if (!selectMode) {
                      setSelectMode(true);
                      setSelectedActivities([item.id]);
                    }
                  }}
                  getStatusText={getStatusText}
                  getStatusColor={getStatusColor}
                />
                {selectMode && (
                  <View style={[s.checkbox, selectedActivities.includes(item.id) && s.checkboxSelected]}>
                    {selectedActivities.includes(item.id) && <Check size={14} color={C.white} />}
                  </View>
                )}
              </View>
            ))
            ) : (
              <Text style={s.sectionDate}>No activities found</Text>
            )}

            {/* Bottom spacing for tab bar */}
            <View style={{ height: 100 }} />
          </View>
        </Animated.View>
      </ScrollView>

      {/* Activity Detail Modal */}
      <ActivityDetailModal
        activity={detailActivity}
        isDark={isDark}
        highContrast={settings.highContrast}
        reducedMotion={settings.reducedMotion}
        onClose={() => setDetailActivity(null)}
        onPrint={(activity) => openPrintPreview([activity])}
        onDelete={async (activity) => {
          const nip = await storage.getNip();
          if (!nip) return;
          const result = await logbookService.deleteLogbook(String(activity.id), nip);
          if (result.success) {
            await notificationService.scheduleLogbookDeleted();
            fetchLogbooks();
          } else {
            Alert.alert("Error", result.message || "Failed to delete logbook");
          }
        }}
        getStatusText={getStatusText}
        getStatusColor={getStatusColor}
      />

      {/* Print Preview Modal */}
      <PrintPreviewModal
        visible={showPrintPreview}
        activities={previewActivities}
        isDark={isDark}
        highContrast={settings.highContrast}
        reducedMotion={settings.reducedMotion}
        onClose={() => setShowPrintPreview(false)}
        onPrint={handlePrint}
        onSharePDF={handleSharePDF}
        getStatusText={getStatusText}
        getStatusColor={getStatusColor}
        today={today}
      />
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
    avatarImage: {
      width: 50,
      height: 50,
      borderRadius: 12,
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
    printBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: C.cardBg,
      justifyContent: "center",
      alignItems: "center",
    },
    printBtnDisabled: {
      opacity: 0.5,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: C.border,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 8,
      position: "absolute",
      right: 16,
      top: "50%",
      marginTop: -12,
    },
    checkboxSelected: {
      backgroundColor: C.orange,
      borderColor: C.orange,
    },
    cardWrapper: {
      position: "relative",
      marginBottom: 12,
    },
    cardWrapperSelected: {
      borderWidth: 2,
      borderColor: C.orange,
      borderRadius: 16,
    },
  });
