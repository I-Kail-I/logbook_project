import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import {
    ArrowLeft,
    Bell,
    ChevronRight,
    Globe,
    HelpCircle,
    Lock,
    LogOut,
    Palette,
    Sun,
    User,
    X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const C = {
  orange: "#F5A623",
  orangeDark: "#E08A0E",
  orangeLight: "#FFB84D",
  white: "#FFFFFF",
  textDark: "#1A1A1A",
  textGray: "#666666",
  textLight: "#999999",
  bgGray: "#F5F5F5",
  cardBg: "#FFFFFF",
  red: "#FF4444",
  redLight: "#FFE5E5",
  border: "#E0E0E0",
};

export default function SettingsScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    "Inter-Bold": require("@/assets/fonts/Inter-Bold.ttf"),
    "Inter-ExtraBold": require("@/assets/fonts/Inter-ExtraBold.ttf"),
    "ABeeZee-Regular": require("@/assets/fonts/ABeeZee-Regular.ttf"),
    "Magra-Regular": require("@/assets/fonts/Magra-Regular.ttf"),
  });

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [notifications, setNotifications] = useState(false);

  const [profileData, setProfileData] = useState({
    nama: "",
    email: "",
    nip: "",
    telepon: "",
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const SettingItem = ({
    icon: Icon,
    title,
    subtitle,
    onPress,
    rightElement,
  }: {
    icon: any;
    title: string;
    subtitle: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity style={s.settingItem} onPress={onPress} disabled={!onPress}>
      <View style={s.settingIcon}>
        <Icon size={20} color={C.orange} />
      </View>
      <View style={s.settingText}>
        <Text style={s.settingTitle}>{title}</Text>
        <Text style={s.settingSubtitle}>{subtitle}</Text>
      </View>
      {rightElement || <ChevronRight size={20} color={C.textLight} />}
    </TouchableOpacity>
  );

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.orange} />

      {/* Header */}
      <View style={s.header}>
        <View style={s.headerTop}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={24} color={C.white} />
          </TouchableOpacity>
        </View>
        <Text style={s.headerTitle}>Pengaturan</Text>
        <Text style={s.headerSubtitle}>Kelola akun dan preferensi aplikasi</Text>
      </View>

      {/* Content */}
      <ScrollView style={s.content} showsVerticalScrollIndicator={false}>
        {/* Akun Section */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Akun</Text>
          <View style={s.card}>
            <SettingItem
              icon={User}
              title="Ubah Profil"
              subtitle="Nama, email, dan informasi akun"
              onPress={() => setShowProfileModal(true)}
            />
            <View style={s.divider} />
            <SettingItem
              icon={Lock}
              title="Ubah Password"
              subtitle="Perbarui password akun Anda"
              onPress={() => setShowPasswordModal(true)}
            />
          </View>
        </View>

        {/* Aplikasi Section */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Aplikasi</Text>
          <View style={s.card}>
            <SettingItem
              icon={Bell}
              title="Notifikasi"
              subtitle="Pengaturan Pemberitahuan"
              rightElement={
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: "#E0E0E0", true: C.orangeLight }}
                  thumbColor={notifications ? C.orange : "#fff"}
                />
              }
            />
            <View style={s.divider} />
            <SettingItem icon={Globe} title="Bahasa" subtitle="Indonesia" />
            <View style={s.divider} />
            <SettingItem icon={Palette} title="Tampilan" subtitle="Sesuaikan tema aplikasi" />
          </View>
        </View>

        {/* Lainnya Section */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Lainnya</Text>
          <View style={s.card}>
            <SettingItem icon={HelpCircle} title="Bantuan" subtitle="Pusat bantuan dan FAQ" />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={s.logoutButton}>
          <LogOut size={18} color={C.red} />
          <Text style={s.logoutText}>Keluar dari Akun</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Profile Modal */}
      <Modal
        visible={showProfileModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowProfileModal(false)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Ubah Profil</Text>
              <TouchableOpacity onPress={() => setShowProfileModal(false)}>
                <X size={24} color={C.textGray} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={s.inputGroup}>
                <Text style={s.inputLabel}>Nama Lengkap</Text>
                <TextInput
                  style={s.input}
                  value={profileData.nama}
                  onChangeText={(text) => setProfileData({ ...profileData, nama: text })}
                  placeholder="Contoh Nama: Jamaluddin"
                  placeholderTextColor={C.textLight}
                />
              </View>

              <View style={s.inputGroup}>
                <Text style={s.inputLabel}>Email</Text>
                <TextInput
                  style={s.input}
                  value={profileData.email}
                  onChangeText={(text) => setProfileData({ ...profileData, email: text })}
                  placeholder="Contoh Email: logbook@gmail.com"
                  placeholderTextColor={C.textLight}
                  keyboardType="email-address"
                />
              </View>

              <View style={s.inputGroup}>
                <Text style={s.inputLabel}>NIP</Text>
                <TextInput
                  style={s.input}
                  value={profileData.nip}
                  onChangeText={(text) => setProfileData({ ...profileData, nip: text })}
                  placeholder="0123456789"
                  placeholderTextColor={C.textLight}
                  keyboardType="number-pad"
                />
              </View>

              <View style={s.inputGroup}>
                <Text style={s.inputLabel}>No Telepon</Text>
                <TextInput
                  style={s.input}
                  value={profileData.telepon}
                  onChangeText={(text) => setProfileData({ ...profileData, telepon: text })}
                  placeholder="081********"
                  placeholderTextColor={C.textLight}
                  keyboardType="phone-pad"
                />
              </View>

              <TouchableOpacity style={s.saveButton} onPress={() => setShowProfileModal(false)}>
                <Text style={s.saveButtonText}>Simpan</Text>
              </TouchableOpacity>

              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Password Modal */}
      <Modal
        visible={showPasswordModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Ubah Password</Text>
              <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                <X size={24} color={C.textGray} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={s.inputGroup}>
                <Text style={s.inputLabel}>Password Saat Ini</Text>
                <TextInput
                  style={s.input}
                  value={passwordData.current}
                  onChangeText={(text) => setPasswordData({ ...passwordData, current: text })}
                  placeholder="Password123"
                  placeholderTextColor={C.textLight}
                  secureTextEntry
                />
              </View>

              <View style={s.inputGroup}>
                <Text style={s.inputLabel}>Password Baru</Text>
                <TextInput
                  style={s.input}
                  value={passwordData.new}
                  onChangeText={(text) => setPasswordData({ ...passwordData, new: text })}
                  placeholder="Password baru"
                  placeholderTextColor={C.textLight}
                  secureTextEntry
                />
              </View>

              <View style={s.inputGroup}>
                <Text style={s.inputLabel}>Konfirmasi Password Baru</Text>
                <TextInput
                  style={s.input}
                  value={passwordData.confirm}
                  onChangeText={(text) => setPasswordData({ ...passwordData, confirm: text })}
                  placeholder="Masukkan password baru"
                  placeholderTextColor={C.textLight}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity style={s.saveButton} onPress={() => setShowPasswordModal(false)}>
                <Text style={s.saveButtonText}>Simpan</Text>
              </TouchableOpacity>

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
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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

  // Content
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Inter-Bold",
    color: C.textGray,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: C.cardBg,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  // Setting Item
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(245, 166, 35, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontFamily: "Inter-Bold",
    color: C.textDark,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: C.textLight,
    fontFamily: "Magra-Regular",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginLeft: 64,
  },

  // Logout Button
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.redLight,
    paddingVertical: 14,
    borderRadius: 25,
    gap: 8,
  },
  logoutText: {
    fontSize: 14,
    fontFamily: "Inter-Bold",
    color: C.red,
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
    maxHeight: "85%",
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

  // Form Inputs
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: "Magra-Regular",
    color: C.textDark,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: C.textDark,
    fontFamily: "Inter-Bold",
    borderWidth: 1,
    borderColor: C.border,
  },

  // Save Button
  saveButton: {
    backgroundColor: C.orange,
    paddingVertical: 14,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 14,
    fontFamily: "Inter-Bold",
    color: C.white,
  },
});
