import { getThemeColors } from "@/constants/theme";
import { useSettings } from "@/contexts/SettingsContext";
import { Printer, Trash2, X } from "lucide-react-native";
import React from "react";
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Activity } from "./ActivityCard";

interface ActivityDetailModalProps {
  activity: Activity | null;
  isDark: boolean;
  highContrast?: boolean;
  reducedMotion?: boolean;
  onClose: () => void;
  onPrint: (activity: Activity) => void;
  onDelete?: (activity: Activity) => void;
  getStatusText: (status: string) => string;
  getStatusColor: (status: string) => string;
}

export function ActivityDetailModal({
  activity,
  isDark,
  highContrast = false,
  reducedMotion = false,
  onClose,
  onPrint,
  onDelete,
  getStatusText,
  getStatusColor,
}: ActivityDetailModalProps) {
  const { t } = useSettings();
  const C = getThemeColors(isDark, highContrast);
  const s = getStyles(C);

  return (
    <Modal visible={activity !== null} animationType={reducedMotion ? "none" : "slide"} transparent onRequestClose={onClose}>
      <View style={s.modalOverlay}>
        <View style={s.modalContent}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>{t("activity_details")}</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={C.textGray} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {activity && (
              <>
                <View style={s.detailRow}>
                  <Text style={s.detailLabel}>{t("time")}</Text>
                  <Text style={s.detailValue}>{activity.time}</Text>
                </View>
                <View style={s.detailRow}>
                  <Text style={s.detailLabel}>{t("status")}</Text>
                  <View
                    style={[
                      s.detailStatusBadge,
                      { backgroundColor: getStatusColor(activity.statusKey) + "20" },
                    ]}
                  >
                    <Text style={[s.detailStatusText, { color: getStatusColor(activity.statusKey) }]}>
                      {getStatusText(activity.statusKey)}
                    </Text>
                  </View>
                </View>
                <View style={s.detailRow}>
                  <Text style={s.detailLabel}>{t("category")}</Text>
                  <Text style={s.detailValue}>{activity.category || "-"}</Text>
                </View>
                <View style={s.detailRow}>
                  <Text style={s.detailLabel}>{t("activity")}</Text>
                  <Text style={s.detailValue}>{activity.title}</Text>
                </View>
                <View style={s.detailRow}>
                  <Text style={s.detailLabel}>{t("description")}</Text>
                  <Text style={s.detailDesc}>{activity.desc}</Text>
                </View>
                {activity.evidence && (
                  <View style={s.detailRow}>
                    <Text style={s.detailLabel}>{t("evidence")}</Text>
                    <Text style={s.detailValue}>{activity.evidence}</Text>
                  </View>
                )}

                <View style={s.actionRow}>
                  <TouchableOpacity
                    style={s.printSingleBtn}
                    onPress={() => {
                      onClose();
                      onPrint(activity);
                    }}
                  >
                    <Printer size={18} color={C.white} />
                    <Text style={s.printSingleBtnText}>{t("print_log")}</Text>
                  </TouchableOpacity>

                  {onDelete && (
                    <TouchableOpacity
                      style={s.deleteBtn}
                      onPress={() => {
                        Alert.alert(
                          "Delete Logbook",
                          "Are you sure you want to delete this logbook entry?",
                          [
                            { text: "Cancel", style: "cancel" },
                            {
                              text: "Delete",
                              style: "destructive",
                              onPress: () => {
                                onClose();
                                onDelete(activity);
                              },
                            },
                          ],
                        );
                      }}
                    >
                      <Trash2 size={18} color={C.white} />
                      <Text style={s.printSingleBtnText}>{t("delete")}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}
            <View style={{ height: 40 }} />
          </ScrollView>
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
    detailRow: {
      marginBottom: 16,
    },
    detailLabel: {
      fontSize: 12,
      color: C.textLight,
      fontFamily: "Magra-Regular",
      marginBottom: 4,
    },
    detailValue: {
      fontSize: 14,
      color: C.textDark,
      fontFamily: "Inter-Bold",
    },
    detailDesc: {
      fontSize: 14,
      color: C.textGray,
      fontFamily: "Magra-Regular",
      lineHeight: 22,
    },
    detailStatusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: "flex-start",
    },
    detailStatusText: {
      fontSize: 12,
      fontFamily: "Inter-Bold",
    },
    actionRow: {
      flexDirection: "row",
      gap: 12,
      marginTop: 20,
    },
    printSingleBtn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: C.orange,
      paddingVertical: 14,
      borderRadius: 25,
    },
    deleteBtn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: C.red,
      paddingVertical: 14,
      borderRadius: 25,
    },
    printSingleBtnText: {
      fontSize: 14,
      fontFamily: "Inter-Bold",
      color: C.white,
    },
  });
