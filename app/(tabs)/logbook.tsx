import * as DocumentPicker from "expo-document-picker";
import { useFonts } from "expo-font";
import { ChevronLeft, ChevronRight, Clock, FileText, Plus, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width: W } = Dimensions.get("window");

const C = {
  orange: "#F5A623",
  orangeDark: "#E08A0E",
  orangeLight: "#FFB84D",
  white: "#FFFFFF",
  textDark: "#1A1A1A",
  textGray: "#666666",
  textLight: "#999999",
  green: "#4CAF50",
  greenLight: "#E8F5E9",
  bgGray: "#F5F5F5",
  cardBg: "#FFFFFF",
  red: "#FF4444",
};

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function LogbookScreen() {
  const [fontsLoaded] = useFonts({
    "Inter-Bold": require("@/assets/fonts/Inter-Bold.ttf"),
    "Inter-ExtraBold": require("@/assets/fonts/Inter-ExtraBold.ttf"),
    "ABeeZee-Regular": require("@/assets/fonts/ABeeZee-Regular.ttf"),
    "Magra-Regular": require("@/assets/fonts/Magra-Regular.ttf"),
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    pilihan: "",
    namaAktivitas: "",
    tanggal: "",
    deskripsi: "",
    bukti: null as any,
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate);
  const monthYear = currentDate.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  const selectedDateStr = selectedDate.toLocaleDateString("id-ID", {
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
        setFormData({ ...formData, bukti: result.assets[0] });
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

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.orange} />

      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Logbook Saya</Text>
        <Text style={s.headerSubtitle}>Catat Aktifitas</Text>
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
      <ScrollView style={s.activitiesSection}>
        <Text style={s.selectedDateText}>{selectedDateStr}</Text>

        {/* Activity Card */}
        <View style={s.activityCard}>
          <View style={s.activityHeader}>
            <View style={s.activityTimeRow}>
              <Clock size={14} color={C.textLight} />
              <Text style={s.activityTime}>8.00 - 09.15</Text>
            </View>
            <View style={s.statusBadge}>
              <Text style={s.statusText}>Selesai</Text>
            </View>
          </View>

          <View style={s.activityBody}>
            <View style={s.activityIcon}>
              <FileText size={20} color={C.white} />
            </View>
            <View style={s.activityContent}>
              <Text style={s.activityTitle}>Dokumen DOKSLI</Text>
              <Text style={s.activityDesc}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam in euismod augue.
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity style={s.fab} onPress={() => setShowForm(true)}>
        <Plus size={28} color={C.white} />
      </TouchableOpacity>

      {/* Add Log Modal */}
      <Modal visible={showForm} animationType="slide" transparent onRequestClose={() => setShowForm(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            {/* Modal Header */}
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Logbook Saya</Text>
              <TouchableOpacity onPress={() => setShowForm(false)}>
                <X size={24} color={C.textGray} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Pilihan */}
              <View style={s.inputCard}>
                <Text style={s.inputLabel}>Pilihan</Text>
                <TextInput
                  style={s.input}
                  value={formData.pilihan}
                  onChangeText={(text) => setFormData({ ...formData, pilihan: text })}
                  placeholder="Pilih kategori"
                />
              </View>

              {/* Nama Aktivitas */}
              <View style={s.inputCard}>
                <Text style={s.inputLabel}>Nama Aktivitas</Text>
                <TextInput
                  style={s.input}
                  value={formData.namaAktivitas}
                  onChangeText={(text) => setFormData({ ...formData, namaAktivitas: text })}
                  placeholder="Masukkan nama aktivitas"
                />
              </View>

              {/* Tanggal */}
              <View style={s.inputCard}>
                <Text style={s.inputLabel}>Tanggal</Text>
                <TextInput
                  style={s.input}
                  value={formData.tanggal}
                  onChangeText={(text) => setFormData({ ...formData, tanggal: text })}
                  placeholder="Pilih tanggal"
                />
              </View>

              {/* Deskripsi */}
              <View style={s.inputCardLarge}>
                <Text style={s.inputLabel}>Deskripsi pekerjaan</Text>
                <TextInput
                  style={[s.input, s.inputLarge]}
                  value={formData.deskripsi}
                  onChangeText={(text) => setFormData({ ...formData, deskripsi: text })}
                  placeholder="Deskripsikan pekerjaan..."
                  multiline
                  numberOfLines={4}
                />
              </View>

              {/* Bukti Aktivitas */}
              <View style={s.inputCard}>
                <Text style={s.inputLabel}>Bukti Aktivitas</Text>
                <TouchableOpacity style={s.fileButton} onPress={pickDocument}>
                  <Text style={s.fileButtonText}>{formData.bukti?.name || "Choose File"}</Text>
                </TouchableOpacity>
              </View>

              <Text style={s.fileHint}>
                silahkan tambahkan bukti aktivitas berupa foto pengerjaan atau dokumen yang di kerjakan, dengan maksimal
                ukuran 1MB!
              </Text>

              {/* Action Buttons */}
              <View style={s.modalActions}>
                <TouchableOpacity
                  style={s.deleteButton}
                  onPress={() => {
                    setFormData({
                      pilihan: "",
                      namaAktivitas: "",
                      tanggal: "",
                      deskripsi: "",
                      bukti: null,
                    });
                    setShowForm(false);
                  }}
                >
                  <Text style={s.deleteButtonText}>Hapus Log</Text>
                </TouchableOpacity>

                <TouchableOpacity style={s.saveButton} onPress={() => setShowForm(false)}>
                  <Text style={s.saveButtonText}>Simpan Log Harian</Text>
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

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bgGray,
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

  // Activity Card
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
    paddingHorizontal: 12,
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
    backgroundColor: C.orange,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputCardLarge: {
    backgroundColor: C.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    padding: 0,
  },
  inputLarge: {
    height: 80,
    textAlignVertical: "top",
  },
  fileButton: {
    backgroundColor: "#E8E8E8",
    paddingHorizontal: 16,
    paddingVertical: 8,
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
  saveButtonText: {
    fontSize: 14,
    fontFamily: "Inter-Bold",
    color: C.white,
  },
});
