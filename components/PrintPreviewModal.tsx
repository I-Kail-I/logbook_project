import { getThemeColors } from "@/constants/theme";
import { useSettings } from "@/contexts/SettingsContext";
import { Printer, Share2, X } from "lucide-react-native";
import React from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Activity } from "./ActivityCard";

interface PrintPreviewModalProps {
  visible: boolean;
  activities: Activity[];
  isDark: boolean;
  highContrast?: boolean;
  reducedMotion?: boolean;
  onClose: () => void;
  onPrint: (activities: Activity[]) => void;
  onSharePDF: (activities: Activity[]) => void;
  getStatusText: (status: string) => string;
  getStatusColor: (status: string) => string;
  today: string;
}

export function PrintPreviewModal({
  visible,
  activities,
  isDark,
  highContrast = false,
  reducedMotion = false,
  onClose,
  onPrint,
  onSharePDF,
  getStatusText,
  getStatusColor,
  today,
}: PrintPreviewModalProps) {
  const { t } = useSettings();
  const C = getThemeColors(isDark, highContrast);
  const s = getStyles(C);

  return (
    <Modal visible={visible} animationType={reducedMotion ? "none" : "slide"} transparent onRequestClose={onClose}>
      <View style={s.modalOverlay}>
        <View style={s.modalContent}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>{t("print_preview")}</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={C.textGray} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={s.previewScroll}>
            <Text style={s.previewTitle}>{t("today_activity")}</Text>
            <Text style={s.previewDate}>{today}</Text>
            <View style={s.previewTable}>
              <View style={s.previewTableHeader}>
                <Text style={s.previewHeaderCell}>{t("time")}</Text>
                <Text style={s.previewHeaderCell}>{t("activity")}</Text>
                <Text style={s.previewHeaderCell}>{t("status")}</Text>
              </View>
              {activities.map((item) => (
                <View key={item.id} style={s.previewTableRow}>
                  <Text style={s.previewCell}>{item.time}</Text>
                  <Text style={s.previewCell}>{item.title}</Text>
                  <Text style={[s.previewCell, { color: getStatusColor(item.statusKey) }]}>
                    {getStatusText(item.statusKey)}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={s.previewActions}>
            <TouchableOpacity style={s.previewBtn} onPress={() => onSharePDF(activities)}>
              <Share2 size={18} color={C.orange} />
              <Text style={s.previewBtnText}>{t("share_pdf")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.previewBtnPrimary} onPress={() => onPrint(activities)}>
              <Printer size={18} color={C.white} />
              <Text style={s.previewBtnPrimaryText}>{t("print")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const getStyles = (C: ReturnType<typeof getThemeColors>) =>
  StyleSheet.create({
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
      paddingVertical: 40,
      maxHeight: "75%",
      marginTop: 80,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
    },
    modalTitle: {
      fontSize: 18,
      fontFamily: "Inter-Bold",
      color: C.textDark,
    },
    previewScroll: {
      maxHeight: 300,
      marginBottom: 20,
    },
    previewTitle: {
      fontSize: 20,
      fontFamily: "Inter-ExtraBold",
      color: C.orange,
      marginBottom: 4,
    },
    previewDate: {
      fontSize: 14,
      color: C.textGray,
      fontFamily: "Magra-Regular",
      marginBottom: 16,
    },
    previewTable: {
      borderWidth: 1,
      borderColor: C.border,
      borderRadius: 12,
      overflow: "hidden",
    },
    previewTableHeader: {
      flexDirection: "row",
      backgroundColor: C.orange,
      paddingVertical: 12,
    },
    previewHeaderCell: {
      flex: 1,
      fontSize: 12,
      fontFamily: "Inter-Bold",
      color: C.white,
      textAlign: "center",
    },
    previewTableRow: {
      flexDirection: "row",
      borderTopWidth: 1,
      borderTopColor: C.border,
      paddingVertical: 12,
      backgroundColor: C.cardBg,
    },
    previewCell: {
      flex: 1,
      fontSize: 12,
      color: C.textDark,
      textAlign: "center",
      fontFamily: "Magra-Regular",
    },
    previewActions: {
      flexDirection: "row",
      gap: 12,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: C.border,
    },
    previewBtn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 14,
      borderRadius: 25,
      borderWidth: 1.5,
      borderColor: C.orange,
    },
    previewBtnText: {
      fontSize: 14,
      fontFamily: "Inter-Bold",
      color: C.orange,
    },
    previewBtnPrimary: {
      flex: 1.5,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 14,
      borderRadius: 25,
      backgroundColor: C.orange,
    },
    previewBtnPrimaryText: {
      fontSize: 14,
      fontFamily: "Inter-Bold",
      color: C.white,
    },
  });
