import { ActivityCard, ActivityDetailModal, PrintPreviewModal, type Activity } from "@/components";
import { getThemeColors } from "@/constants/theme";
import { useSettings } from "@/contexts/SettingsContext";
import { useFadeInOnFocus } from "@/hooks/useFadeInOnFocus";
import { createRefreshHandler } from "@/utils/refresh";
import * as DocumentPicker from "expo-document-picker";
import { useFonts } from "expo-font";
import * as Haptics from "expo-haptics";
import * as Print from "expo-print";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, X } from "lucide-react-native";
import React, { useEffect, useState, useCallback } from "react";
import { Alert } from "react-native";
import logbookService from "@/services/logbook";
import storage from "@/services/storage";
import { Tupoksi, Logbook as LogbookType } from "@/services/types";
import {
  Animated,
  Dimensions,
  Modal,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width: W } = Dimensions.get("window");

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const LOGBOOK_ACTIVITIES: Activity[] = [
  {
    id: 1,
    time: "8.00 - 09.15",
    statusKey: "completed",
    title: "Dokumen DOKSLI",
    desc: "Penyusunan dokumen DOKSLI untuk proyek A.",
    iconColor: "#F5A623",
    category: "Dokumenasi",
    date: "2026-02-08",
    evidence: "dokumen_doksli.pdf",
  },
  {
    id: 2,
    time: "9.30 - 11.00",
    statusKey: "completed",
    title: "Meeting Harian",
    desc: "Diskusi progress dengan tim development.",
    iconColor: "#4CAF50",
    category: "Meeting",
    date: "2026-02-08",
  },
  {
    id: 3,
    time: "13.00 - 15.00",
    statusKey: "in_progress",
    title: "Review Kode",
    desc: "Review dan testing fitur autentikasi.",
    iconColor: "#8B5CF6",
    category: "Development",
    date: "2026-02-08",
  },
];

export default function LogbookScreen() {
  const router = useRouter();
  const { openModal } = useLocalSearchParams<{ openModal?: string }>();
  const { t, settings } = useSettings();
  const { fadeAnim, slideAnim } = useFadeInOnFocus(400, settings.reducedMotion);
  const isDark = settings.theme === "dark";
  const C = getThemeColors(isDark, settings.highContrast);
  const s = getStyles(C);

  const [fontsLoaded] = useFonts({
    "Inter-Bold": require("@/assets/fonts/Inter-Bold.ttf"),
    "Inter-ExtraBold": require("@/assets/fonts/Inter-ExtraBold.ttf"),
    "ABeeZee-Regular": require("@/assets/fonts/ABeeZee-Regular.ttf"),
    "Magra-Regular": require("@/assets/fonts/Magra-Regular.ttf"),
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTupoksi = useCallback(async () => {
    setLoadingTupoksi(true);
    const result = await logbookService.getTupoksi();
    if (result.success && result.data) {
      setTupoksiList(result.data);
    }
    setLoadingTupoksi(false);
  }, []);

  const fetchLogbooks = useCallback(async () => {
    setLoadingLogbooks(true);
    const result = await logbookService.getLogbook();
    if (result.success && result.data) {
      setLogbooks(result.data);
    }
    setLoadingLogbooks(false);
  }, []);

  useEffect(() => {
    fetchTupoksi();
    fetchLogbooks();
  }, [fetchTupoksi, fetchLogbooks]);

  useEffect(() => {
    if (openModal === "true") {
      setShowForm(true);
    }
  }, [openModal]);

  const [formData, setFormData] = useState({
    tupoksiDdl: "",
    aktifitas: "",
    tanggal: "",
    deskripsiPekerjaan: "",
    fileDokumenLogbook: null as any,
    idLogbook: "",
  });

  const [tupoksiList, setTupoksiList] = useState<Tupoksi[]>([]);
  const [loadingTupoksi, setLoadingTupoksi] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [logbooks, setLogbooks] = useState<LogbookType[]>([]);
  const [loadingLogbooks, setLoadingLogbooks] = useState(false);

  const [detailActivity, setDetailActivity] = useState<Activity | null>(null);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [previewActivities, setPreviewActivities] = useState<Activity[]>([]);

  void W;
  void fontsLoaded;

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
          <p class="date">${selectedDateStr}</p>
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
        dialogTitle: t("share_pdf"),
      });
    } catch (error) {
      console.log("Share error:", error);
    }
  };

  const openPrintPreview = (activities: Activity[]) => {
    setPreviewActivities(activities);
    setShowPrintPreview(true);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const locale = settings.language === "id" ? "id-ID" : "en-US";
  const { firstDay, daysInMonth } = getDaysInMonth(currentDate);
  const monthYear = currentDate.toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
  });

  const selectedDateStr = selectedDate.toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
      });
      if (!result.canceled) {
        setFormData({ ...formData, fileDokumenLogbook: result.assets[0] });
      }
    } catch (err) {
      console.log("Document picker error:", err);
    }
  };

  const renderCalendar = () => {
    const days = [];
    // Empty cells for days before start of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={s.dayCell} />);
    }
    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        new Date().getDate() === day &&
        new Date().getMonth() === currentDate.getMonth() &&
        new Date().getFullYear() === currentDate.getFullYear();
      void isToday;
      const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === currentDate.getMonth();
      const hasActivity = day === 1 || day === 2; // Sample data

      days.push(
        <TouchableOpacity
          key={day}
          style={[s.dayCell, isSelected && s.daySelected]}
          onPress={() => {
            const newDate = new Date(currentDate);
            newDate.setDate(day);
            setSelectedDate(newDate);
          }}
        >
          <Text style={[s.dayText, isSelected && s.dayTextSelected]}>{day}</Text>
          {hasActivity && <View style={s.activityDot} />}
        </TouchableOpacity>,
      );
    }
    return days;
  };

  const onRefresh = createRefreshHandler(
    setRefreshing,
    async () => {
      await Promise.all([fetchTupoksi(), fetchLogbooks()]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
    900,
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
      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <ScrollView
          style={s.pageScroll}
          contentContainerStyle={s.pageContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={C.orange}
              progressViewOffset={110}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={s.header}>
            <View style={s.headerTop}>
              <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
                <ArrowLeft size={24} color={C.white} />
              </TouchableOpacity>
            </View>
            <Text style={s.headerTitle}>{t("my_logbook")}</Text>
            <Text style={s.headerSubtitle}>{t("record_activity")}</Text>
          </View>

          {/* Calendar Card */}
          <View style={s.calendarCard}>
            {/* Month Navigation */}
            <View style={s.monthNav}>
              <TouchableOpacity
                onPress={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              >
                <ChevronLeft size={24} color={C.textDark} />
              </TouchableOpacity>
              <Text style={s.monthText}>{monthYear.charAt(0).toUpperCase() + monthYear.slice(1)}</Text>
              <TouchableOpacity
                onPress={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              >
                <ChevronRight size={24} color={C.textDark} />
              </TouchableOpacity>
            </View>

            {/* Day Headers */}
            <View style={s.dayHeaders}>
              {DAYS.map((day) => (
                <Text key={day} style={s.dayHeaderText}>
                  {day}
                </Text>
              ))}
            </View>

            {/* Calendar Grid */}
            <View style={s.calendarGrid}>{renderCalendar()}</View>
          </View>

          {/* Selected Date Activities */}
          <View style={s.activitiesSection}>
            <Text style={s.selectedDateText}>{selectedDateStr}</Text>

            {/* Activity Cards */}
            {loadingLogbooks ? (
              <Text style={s.selectedDateText}>Loading...</Text>
            ) : activities.length > 0 ? (
              activities.map((item) => (
                <ActivityCard
                  key={item.id}
                  activity={item}
                  isDark={isDark}
                  highContrast={settings.highContrast}
                  onPress={() => setDetailActivity(item)}
                  getStatusText={getStatusText}
                  getStatusColor={getStatusColor}
                />
              ))
            ) : (
              <Text style={s.selectedDateText}>No activities found</Text>
            )}
          </View>
        </ScrollView>
      </Animated.View>

      {/* Floating Add Button */}
      <TouchableOpacity style={s.fab} onPress={() => setShowForm(true)}>
        <Plus size={28} color={C.white} />
      </TouchableOpacity>

      {/* Activity Detail Modal */}
      <ActivityDetailModal
        activity={detailActivity}
        isDark={isDark}
        highContrast={settings.highContrast}
        reducedMotion={settings.reducedMotion}
        onClose={() => setDetailActivity(null)}
        onPrint={(activity) => openPrintPreview([activity])}
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
        today={selectedDateStr}
      />

      {/* Add Log Modal */}
      <Modal
        visible={showForm}
        animationType={settings.reducedMotion ? "none" : "slide"}
        transparent
        onRequestClose={() => setShowForm(false)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            {/* Modal Header */}
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{t("my_logbook")}</Text>
              <TouchableOpacity onPress={() => setShowForm(false)}>
                <X size={24} color={C.textGray} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Pilihan (Tupoksi) */}
              <View style={s.inputCard}>
                <Text style={s.inputLabel}>{t("choice")}</Text>
                <TextInput
                  style={s.input}
                  value={formData.tupoksiDdl}
                  onChangeText={(text) => setFormData({ ...formData, tupoksiDdl: text })}
                  placeholder={loadingTupoksi ? "Loading..." : t("choice_placeholder")}
                  editable={!loadingTupoksi}
                />
              </View>

              {/* Nama Aktivitas (Aktifitas) */}
              <View style={s.inputCard}>
                <Text style={s.inputLabel}>{t("activity_name")}</Text>
                <TextInput
                  style={s.input}
                  value={formData.aktifitas}
                  onChangeText={(text) => setFormData({ ...formData, aktifitas: text })}
                  placeholder={t("activity_name_placeholder")}
                />
              </View>

              {/* Tanggal */}
              <View style={s.inputCard}>
                <Text style={s.inputLabel}>{t("date")}</Text>
                <TextInput
                  style={s.input}
                  value={formData.tanggal}
                  onChangeText={(text) => setFormData({ ...formData, tanggal: text })}
                  placeholder={t("date_placeholder")}
                />
              </View>

              {/* Deskripsi (Deskripsi Pekerjaan) */}
              <View style={s.inputCardLarge}>
                <Text style={s.inputLabel}>{t("work_description")}</Text>
                <TextInput
                  style={[s.input, s.inputLarge]}
                  value={formData.deskripsiPekerjaan}
                  onChangeText={(text) => setFormData({ ...formData, deskripsiPekerjaan: text })}
                  placeholder={t("work_description_placeholder")}
                  multiline
                  numberOfLines={4}
                />
              </View>

              {/* Bukti Aktivitas (File Dokumen Logbook) */}
              <View style={s.inputCard}>
                <Text style={s.inputLabel}>{t("activity_evidence")}</Text>
                <TouchableOpacity style={s.fileButton} onPress={pickDocument}>
                  <Text style={s.fileButtonText}>
                    {formData.fileDokumenLogbook?.name || t("choose_file")}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={s.fileHint}>{t("file_hint")}</Text>

              {/* Action Buttons */}
              <View style={s.modalActions}>
                <TouchableOpacity
                  style={s.deleteButton}
                  onPress={() => {
                    setFormData({
                      tupoksiDdl: "",
                      aktifitas: "",
                      tanggal: "",
                      deskripsiPekerjaan: "",
                      fileDokumenLogbook: null,
                      idLogbook: "",
                    });
                    setShowForm(false);
                  }}
                >
                  <Text style={s.deleteButtonText}>{t("delete_log")}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[s.saveButton, loadingSubmit && s.saveButtonDisabled]}
                  onPress={async () => {
                    if (!formData.tupoksiDdl || !formData.aktifitas || !formData.tanggal) {
                      Alert.alert("Error", "Please fill in all required fields");
                      return;
                    }
                    
                    setLoadingSubmit(true);
                    const nip = await storage.getNip();
                    if (!nip) {
                      Alert.alert("Error", "User not logged in");
                      setLoadingSubmit(false);
                      return;
                    }

                    const result = await logbookService.createLogbook({
                      nip,
                      tupoksiDdl: formData.tupoksiDdl,
                      aktifitas: formData.aktifitas,
                      tanggal: formData.tanggal,
                      deskripsiPekerjaan: formData.deskripsiPekerjaan,
                      fileDokumenLogbook: formData.fileDokumenLogbook,
                      idLogbook: formData.idLogbook || undefined,
                    });

                    setLoadingSubmit(false);

                    if (result.success) {
                      Alert.alert("Success", "Logbook saved successfully");
                      setFormData({
                        tupoksiDdl: "",
                        aktifitas: "",
                        tanggal: "",
                        deskripsiPekerjaan: "",
                        fileDokumenLogbook: null,
                        idLogbook: "",
                      });
                      setShowForm(false);
                      fetchLogbooks();
                    } else {
                      Alert.alert("Error", result.message || "Failed to save logbook");
                    }
                  }}
                  disabled={loadingSubmit}
                >
                  <Text style={s.saveButtonText}>
                    {loadingSubmit ? "Saving..." : t("save_daily_log")}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const getStyles = (C: ReturnType<typeof getThemeColors>) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: C.bgGray,
    },
    pageScroll: {
      flex: 1,
    },
    pageContent: {
      paddingBottom: 120,
    },

    // Header
    header: {
      backgroundColor: C.orange,
      paddingTop: 50,
      paddingHorizontal: 20,
      paddingBottom: 25,
      borderBottomLeftRadius: 25,
      borderBottomRightRadius: 25,
    },
    headerTop: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    backBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(255,255,255,0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 24,
      fontFamily: "Inter-ExtraBold",
      color: C.white,
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 14,
      fontFamily: "Magra-Regular",
      color: C.white,
      opacity: 0.9,
    },

    // Calendar Card
    calendarCard: {
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
    calendarGrid: {
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
    activityDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: C.orange,
      marginTop: 2,
    },

    // Activities Section
    activitiesSection: {
      paddingHorizontal: 16,
      paddingTop: 20,
    },
    selectedDateText: {
      fontSize: 14,
      fontFamily: "Inter-Bold",
      color: C.textDark,
      marginBottom: 16,
    },

    // FAB
    fab: {
      position: "absolute",
      right: 20,
      bottom: 40,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: C.orange,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },

    // Modal
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: C.cardBg,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingHorizontal: 20,
      paddingTop: 20,
      maxHeight: "90%",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontFamily: "Inter-Bold",
      color: C.textDark,
    },

    // Form Inputs
    inputCard: {
      backgroundColor: C.cardBg,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: C.border,
    },
    inputCardLarge: {
      backgroundColor: C.cardBg,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: C.border,
      minHeight: 120,
    },
    inputLabel: {
      fontSize: 12,
      color: C.textLight,
      fontFamily: "Magra-Regular",
      marginBottom: 8,
    },
    input: {
      fontSize: 14,
      color: C.textDark,
      fontFamily: "Inter-Bold",
      backgroundColor: C.inputBg,
      borderColor: C.border,
      borderWidth: 1,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 8,
    },
    inputLarge: {
      height: 80,
      textAlignVertical: "top",
    },
    fileButton: {
      backgroundColor: C.inputBg,
      borderColor: C.border,
      borderWidth: 1,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
      alignSelf: "flex-start",
    },
    fileButtonText: {
      fontSize: 12,
      color: C.textDark,
      fontFamily: "Magra-Regular",
    },
    fileHint: {
      fontSize: 11,
      color: C.textLight,
      fontFamily: "Magra-Regular",
      marginTop: 4,
      marginBottom: 20,
      lineHeight: 16,
    },

    // Modal Actions
    modalActions: {
      flexDirection: "row",
      gap: 12,
      marginTop: 10,
    },
    deleteButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 25,
      borderWidth: 1.5,
      borderColor: C.red,
      justifyContent: "center",
      alignItems: "center",
    },
    deleteButtonText: {
      fontSize: 14,
      fontFamily: "Inter-Bold",
      color: C.red,
    },
    saveButton: {
      flex: 1.5,
      paddingVertical: 14,
      borderRadius: 25,
      backgroundColor: C.orange,
      justifyContent: "center",
      alignItems: "center",
    },
    saveButtonDisabled: {
      opacity: 0.6,
    },
    saveButtonText: {
      fontSize: 14,
      fontFamily: "Inter-Bold",
      color: C.white,
    },
  });
