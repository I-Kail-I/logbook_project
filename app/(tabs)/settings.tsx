import { getThemeColors } from "@/constants/theme";
import { resolveFontFamily, scaleFont } from "@/constants/typography";
import { useSettings } from "@/contexts/SettingsContext";
import { useFadeInOnFocus } from "@/hooks/useFadeInOnFocus";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import {
    ArrowLeft,
    Bell,
    Check,
    ChevronRight,
    Contrast,
    Globe,
    HelpCircle,
    Lock,
    LogOut,
    Moon,
    Type,
    User,
    X,
    Zap,
} from "lucide-react-native";
import React, { useState, useEffect } from "react";
import { Alert, Image, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import storage from "@/services/storage";
import auth from "@/services/auth";
import {
    Animated,
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

export default function SettingsScreen() {
  const router = useRouter();
  const {
    settings,
    toggleNotifications,
    toggleTheme,
    setLanguage,
    setFontFamily,
    setFontSize,
    toggleHighContrast,
    toggleReducedMotion,
    t,
  } = useSettings();
  const isDark = settings.theme === "dark";
  const C = getThemeColors(isDark, settings.highContrast);
  const s = getStyles(C, settings.fontSize, settings.fontFamily, settings.reducedMotion);
  const [fontsLoaded] = useFonts({
    "Inter-Bold": require("@/assets/fonts/Inter-Bold.ttf"),
    "Inter-ExtraBold": require("@/assets/fonts/Inter-ExtraBold.ttf"),
    "ABeeZee-Regular": require("@/assets/fonts/ABeeZee-Regular.ttf"),
    "Magra-Regular": require("@/assets/fonts/Magra-Regular.ttf"),
    "Roboto-Regular": require("@/assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Bold": require("@/assets/fonts/Roboto-Bold.ttf"),
    "OpenSans-Regular": require("@/assets/fonts/OpenSans-Regular.ttf"),
    "OpenSans-Bold": require("@/assets/fonts/OpenSans-Bold.ttf"),
  });

  const { fadeAnim, slideAnim } = useFadeInOnFocus(400, settings.reducedMotion);
  void fontsLoaded;

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showFontFamilyModal, setShowFontFamilyModal] = useState(false);
  const [showFontSizeModal, setShowFontSizeModal] = useState(false);

  const [profileData, setProfileData] = useState({
    nama: "",
    email: "",
    nip: "",
    telepon: "",
  });

  const [profilePictureUri, setProfilePictureUri] = useState<string | null>(null);

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    const nip = await storage.getNip();
    const name = await storage.getUserName();
    const email = await storage.getProfileEmail();
    const phone = await storage.getProfilePhone();
    const pic = await storage.getProfilePicture();
    
    setProfileData({
      nama: name || "",
      email: email || "",
      nip: nip || "",
      telepon: phone || "",
    });
    setProfilePictureUri(pic);
  };

  const pickProfilePicture = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled && result.assets[0]) {
      setProfilePictureUri(result.assets[0].uri);
    }
  };

  const handleSaveProfile = async () => {
    if (profileData.nama) {
      await storage.saveUserName(profileData.nama);
    }
    if (profileData.email) {
      await storage.saveProfileEmail(profileData.email);
    }
    if (profileData.telepon) {
      await storage.saveProfilePhone(profileData.telepon);
    }
    if (profilePictureUri) {
      await storage.saveProfilePicture(profilePictureUri);
    }
    Alert.alert("Success", "Profile saved locally");
    setShowProfileModal(false);
  };

  const handleChangePassword = async () => {
    const savedPassword = await storage.getSavedPassword();
    
    if (!passwordData.current) {
      Alert.alert("Error", "Please enter current password");
      return;
    }
    
    if (!passwordData.new) {
      Alert.alert("Error", "Please enter new password");
      return;
    }
    
    if (passwordData.new !== passwordData.confirm) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }
    
    if (savedPassword && passwordData.current !== savedPassword) {
      Alert.alert("Error", "Current password is incorrect");
      return;
    }
    
    await storage.savePassword(passwordData.new);
    setPasswordData({ current: "", new: "", confirm: "" });
    Alert.alert("Success", "Password saved locally");
    setShowPasswordModal(false);
  };

  const handleLogout = async () => {
    await auth.logout();
    router.replace("/");
  };

  const languageLabelMap: Record<(typeof settings)["language"], string> = {
    id: "indonesia",
    en: "english",
    ar: "العربية",
    zh: "中文",
  };

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
        <Icon size={20} color="#F5A623" />
      </View>
      <View style={s.settingText}>
        <Text style={s.settingTitle}>{title}</Text>
        <Text style={s.settingSubtitle}>{subtitle}</Text>
      </View>
      {rightElement || <ChevronRight size={20} color={isDark ? "#808080" : "#999999"} />}
    </TouchableOpacity>
  );

  return (
    <View style={s.root}>
      <StatusBar barStyle={isDark ? "light-content" : "light-content"} backgroundColor={C.orange} />
      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        {/* Header */}
        <View style={s.header}>
          <View style={s.headerTop}>
            <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
              <ArrowLeft size={24} color={C.white} />
            </TouchableOpacity>
          </View>
          <Text style={s.headerTitle}>{t("settings")}</Text>
          <Text style={s.headerSubtitle}>{t("settings_sub")}</Text>
        </View>

        {/* Content */}
        <ScrollView style={s.content} showsVerticalScrollIndicator={false}>
          {/* Akun Section */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>{t("account")}</Text>
            <View style={s.card}>
              <SettingItem
                icon={User}
                title={t("edit_profile")}
                subtitle={t("edit_profile_sub")}
                onPress={() => setShowProfileModal(true)}
              />
              <View style={s.divider} />
              <SettingItem
                icon={Lock}
                title={t("change_password")}
                subtitle={t("change_password_sub")}
                onPress={() => setShowPasswordModal(true)}
              />
            </View>
          </View>

          {/* Aplikasi Section */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>{t("application")}</Text>
            <View style={s.card}>
              <SettingItem
                icon={Bell}
                title={t("notifications")}
                subtitle={t("notifications_sub")}
                rightElement={
                  <Switch
                    value={settings.notificationsEnabled}
                    onValueChange={toggleNotifications}
                    trackColor={{ false: "#E0E0E0", true: "#FFB84D" }}
                    thumbColor={settings.notificationsEnabled ? "#F5A623" : "#fff"}
                  />
                }
              />
              <View style={s.divider} />
              <SettingItem
                icon={Moon}
                title={t("dark_mode")}
                subtitle={settings.theme === "dark" ? t("dark") : t("light")}
                rightElement={
                  <Switch
                    value={settings.theme === "dark"}
                    onValueChange={toggleTheme}
                    trackColor={{ false: "#E0E0E0", true: "#FFB84D" }}
                    thumbColor={settings.theme === "dark" ? "#F5A623" : "#fff"}
                  />
                }
              />
              <View style={s.divider} />
              <SettingItem
                icon={Globe}
                title={t("language")}
                subtitle={languageLabelMap[settings.language]}
                onPress={() => setShowLanguageModal(true)}
              />
            </View>
          </View>

          {/* Appearance & Accessibility Section */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>{t("appearance")}</Text>
            <View style={s.card}>
              <SettingItem
                icon={Type}
                title={t("font_family")}
                subtitle={t(`font_${settings.fontFamily}`)}
                onPress={() => setShowFontFamilyModal(true)}
              />
              <View style={s.divider} />
              <SettingItem
                icon={Type}
                title={t("font_size")}
                subtitle={t(`size_${settings.fontSize === "extraLarge" ? "extra_large" : settings.fontSize}` as any)}
                onPress={() => setShowFontSizeModal(true)}
              />
              <View style={s.divider} />
              <SettingItem
                icon={Contrast}
                title={t("high_contrast")}
                subtitle={settings.highContrast ? t("on") : t("off")}
                rightElement={
                  <Switch
                    value={settings.highContrast}
                    onValueChange={toggleHighContrast}
                    trackColor={{ false: "#E0E0E0", true: "#FFB84D" }}
                    thumbColor={settings.highContrast ? "#F5A623" : "#fff"}
                  />
                }
              />
              <View style={s.divider} />
              <SettingItem
                icon={Zap}
                title={t("reduced_motion")}
                subtitle={settings.reducedMotion ? t("on") : t("off")}
                rightElement={
                  <Switch
                    value={settings.reducedMotion}
                    onValueChange={toggleReducedMotion}
                    trackColor={{ false: "#E0E0E0", true: "#FFB84D" }}
                    thumbColor={settings.reducedMotion ? "#F5A623" : "#fff"}
                  />
                }
              />
            </View>
          </View>

          {/* Lainnya Section */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>{t("other")}</Text>
            <View style={s.card}>
              <SettingItem icon={HelpCircle} title={t("help")} subtitle={t("help_sub")} />
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={s.logoutButton} onPress={handleLogout}>
            <LogOut size={18} color={C.red} />
            <Text style={s.logoutText}>{t("logout")}</Text>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </ScrollView>
      </Animated.View>

      {/* Profile Modal */}
      <Modal
        visible={showProfileModal}
        animationType={settings.reducedMotion ? "none" : "slide"}
        transparent
        onRequestClose={() => setShowProfileModal(false)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{t("edit_profile")}</Text>
              <TouchableOpacity onPress={() => setShowProfileModal(false)}>
                <X size={24} color={C.textGray} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 120 }}
            >
              {/* Profile Picture */}
              <View style={s.profilePicSection}>
                <TouchableOpacity style={s.profilePicContainer} onPress={pickProfilePicture}>
                  {profilePictureUri ? (
                    <Image source={{ uri: profilePictureUri }} style={s.profilePic} />
                  ) : (
                    <View style={s.profilePicPlaceholder}>
                      <Text style={s.profilePicPlaceholderText}>
                        {profileData.nama ? profileData.nama[0].toUpperCase() : "U"}
                      </Text>
                    </View>
                  )}
                  <Text style={s.profilePicEditText}>{t("change_photo")}</Text>
                </TouchableOpacity>
              </View>

              <View style={s.inputGroup}>
                <Text style={s.inputLabel}>{t("full_name")}</Text>
                <TextInput
                  style={s.input}
                  value={profileData.nama}
                  onChangeText={(text) => setProfileData({ ...profileData, nama: text })}
                  placeholder={t("full_name_placeholder")}
                  placeholderTextColor={C.textLight}
                />
              </View>

              <View style={s.inputGroup}>
                <Text style={s.inputLabel}>{t("email")}</Text>
                <TextInput
                  style={s.input}
                  value={profileData.email}
                  onChangeText={(text) => setProfileData({ ...profileData, email: text })}
                  placeholder={t("email_placeholder")}
                  placeholderTextColor={C.textLight}
                  keyboardType="email-address"
                />
              </View>

              <View style={s.inputGroup}>
                <Text style={s.inputLabel}>{t("nip")}</Text>
                <TextInput
                  style={s.input}
                  value={profileData.nip}
                  onChangeText={(text) => setProfileData({ ...profileData, nip: text })}
                  placeholder={t("nip_placeholder")}
                  placeholderTextColor={C.textLight}
                  keyboardType="number-pad"
                />
              </View>

              <View style={s.inputGroup}>
                <Text style={s.inputLabel}>{t("phone")}</Text>
                <TextInput
                  style={s.input}
                  value={profileData.telepon}
                  onChangeText={(text) => setProfileData({ ...profileData, telepon: text })}
                  placeholder={t("phone_placeholder")}
                  placeholderTextColor={C.textLight}
                  keyboardType="phone-pad"
                />
              </View>

              <TouchableOpacity style={s.saveButton} onPress={handleSaveProfile}>
                <Text style={s.saveButtonText}>{t("save")}</Text>
              </TouchableOpacity>

              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Password Modal */}
      <Modal
        visible={showPasswordModal}
        animationType={settings.reducedMotion ? "none" : "slide"}
        transparent
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{t("change_password")}</Text>
              <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                <X size={24} color={C.textGray} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 120 }}>
              <View style={s.inputGroup}>
                <Text style={s.inputLabel}>{t("current_password")}</Text>
                <TextInput
                  style={s.input}
                  value={passwordData.current}
                  onChangeText={(text) => setPasswordData({ ...passwordData, current: text })}
                  placeholder={t("current_password_placeholder")}
                  placeholderTextColor={C.textLight}
                  secureTextEntry
                />
              </View>

              <View style={s.inputGroup}>
                <Text style={s.inputLabel}>{t("new_password")}</Text>
                <TextInput
                  style={s.input}
                  value={passwordData.new}
                  onChangeText={(text) => setPasswordData({ ...passwordData, new: text })}
                  placeholder={t("new_password_placeholder")}
                  placeholderTextColor={C.textLight}
                  secureTextEntry
                />
              </View>

              <View style={s.inputGroup}>
                <Text style={s.inputLabel}>{t("confirm_password")}</Text>
                <TextInput
                  style={s.input}
                  value={passwordData.confirm}
                  onChangeText={(text) => setPasswordData({ ...passwordData, confirm: text })}
                  placeholder={t("confirm_password_placeholder")}
                  placeholderTextColor={C.textLight}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity style={s.saveButton} onPress={handleChangePassword}>
                <Text style={s.saveButtonText}>{t("save")}</Text>
              </TouchableOpacity>

              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Language Modal */}
      <Modal
        visible={showLanguageModal}
        animationType={settings.reducedMotion ? "none" : "slide"}
        transparent
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{t("choose_language")}</Text>
              <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                <X size={24} color={C.textGray} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[s.languageItem, settings.language === "id" && s.languageItemActive]}
              onPress={() => {
                setLanguage("id");
                setShowLanguageModal(false);
              }}
            >
              <Text style={[s.languageText, settings.language === "id" && s.languageTextActive]}>{t("indonesia")}</Text>
              {settings.language === "id" && <Check size={20} color={C.orange} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.languageItem, settings.language === "en" && s.languageItemActive]}
              onPress={() => {
                setLanguage("en");
                setShowLanguageModal(false);
              }}
            >
              <Text style={[s.languageText, settings.language === "en" && s.languageTextActive]}>{t("english")}</Text>
              {settings.language === "en" && <Check size={20} color={C.orange} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.languageItem, settings.language === "ar" && s.languageItemActive]}
              onPress={() => {
                setLanguage("ar");
                setShowLanguageModal(false);
              }}
            >
              <Text style={[s.languageText, settings.language === "ar" && s.languageTextActive]}>العربية</Text>
              {settings.language === "ar" && <Check size={20} color={C.orange} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.languageItem, settings.language === "zh" && s.languageItemActive]}
              onPress={() => {
                setLanguage("zh");
                setShowLanguageModal(false);
              }}
            >
              <Text style={[s.languageText, settings.language === "zh" && s.languageTextActive]}>中文</Text>
              {settings.language === "zh" && <Check size={20} color={C.orange} />}
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </View>
        </View>
      </Modal>

      {/* Font Family Modal */}
      <Modal
        visible={showFontFamilyModal}
        animationType={settings.reducedMotion ? "none" : "slide"}
        transparent
        onRequestClose={() => setShowFontFamilyModal(false)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{t("font_family")}</Text>
              <TouchableOpacity onPress={() => setShowFontFamilyModal(false)}>
                <X size={24} color={C.textGray} />
              </TouchableOpacity>
            </View>

            {(["inter", "roboto", "opensans", "system"] as const).map((font) => (
              <TouchableOpacity
                key={font}
                style={[s.languageItem, settings.fontFamily === font && s.languageItemActive]}
                onPress={() => {
                  setFontFamily(font);
                  setShowFontFamilyModal(false);
                }}
              >
                <Text style={[s.languageText, settings.fontFamily === font && s.languageTextActive]}>
                  {t(`font_${font}` as any)}
                </Text>
                {settings.fontFamily === font && <Check size={20} color={C.orange} />}
              </TouchableOpacity>
            ))}

            <View style={{ height: 40 }} />
          </View>
        </View>
      </Modal>

      {/* Font Size Modal */}
      <Modal
        visible={showFontSizeModal}
        animationType={settings.reducedMotion ? "none" : "slide"}
        transparent
        onRequestClose={() => setShowFontSizeModal(false)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{t("font_size")}</Text>
              <TouchableOpacity onPress={() => setShowFontSizeModal(false)}>
                <X size={24} color={C.textGray} />
              </TouchableOpacity>
            </View>

            {(["small", "normal", "large", "extraLarge"] as const).map((size) => (
              <TouchableOpacity
                key={size}
                style={[s.languageItem, settings.fontSize === size && s.languageItemActive]}
                onPress={() => {
                  setFontSize(size);
                  setShowFontSizeModal(false);
                }}
              >
                <Text style={[s.languageText, settings.fontSize === size && s.languageTextActive]}>
                  {t(`size_${size === "extraLarge" ? "extra_large" : size}` as any)}
                </Text>
                {settings.fontSize === size && <Check size={20} color={C.orange} />}
              </TouchableOpacity>
            ))}

            <View style={{ height: 40 }} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const fontSizeMultipliers: Record<string, number> = {
  small: 0.875,
  normal: 1,
  large: 1.125,
  extraLarge: 1.25,
};

const getStyles = (
  C: ReturnType<typeof getThemeColors>,
  fontSize: string,
  fontFamily: "inter" | "roboto" | "opensans" | "system",
  reducedMotion: boolean,
) => {
  const m = fontSizeMultipliers[fontSize] || 1;
  const regularFont = resolveFontFamily(fontFamily, "regular");
  const boldFont = resolveFontFamily(fontFamily, "bold");
  const extraBoldFont = resolveFontFamily(fontFamily, "extraBold");

  return StyleSheet.create({
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
      fontSize: scaleFont(24, m),
      fontFamily: extraBoldFont,
      color: C.white,
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: scaleFont(14, m),
      fontFamily: regularFont,
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
      fontSize: scaleFont(14, m),
      fontFamily: boldFont,
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
      fontSize: scaleFont(14, m),
      fontFamily: boldFont,
      color: C.textDark,
      marginBottom: 2,
    },
    settingSubtitle: {
      fontSize: scaleFont(12, m),
      color: C.textLight,
      fontFamily: regularFont,
    },
    divider: {
      height: 1,
      backgroundColor: C.divider,
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
      fontSize: scaleFont(14, m),
      fontFamily: boldFont,
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
      fontSize: scaleFont(18, m),
      fontFamily: boldFont,
      color: C.textDark,
    },

    // Form Inputs
    inputGroup: {
      marginBottom: 16,
    },
    inputLabel: {
      fontSize: scaleFont(12, m),
      fontFamily: regularFont,
      color: C.textDark,
      marginBottom: 8,
    },
    input: {
      backgroundColor: C.inputBg,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: scaleFont(14, m),
      color: C.textDark,
      fontFamily: boldFont,
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
      fontSize: scaleFont(14, m),
      fontFamily: boldFont,
      color: C.white,
    },

    // Language Item
    languageItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 16,
      paddingHorizontal: 12,
      borderRadius: 12,
      marginBottom: 8,
      backgroundColor: C.cardBg,
      borderWidth: 1,
      borderColor: C.border,
    },
    languageItemActive: {
      backgroundColor: "rgba(245, 166, 35, 0.08)",
      borderColor: C.orange,
    },
    languageText: {
      fontSize: scaleFont(14, m),
      fontFamily: boldFont,
      color: C.textDark,
    },
    animatedContent: {
      opacity: reducedMotion ? 1 : undefined,
    },
    languageTextActive: {
      color: C.orange,
    },

    // Profile Picture
    profilePicSection: {
      alignItems: "center",
      marginBottom: 20,
    },
    profilePicContainer: {
      alignItems: "center",
    },
    profilePic: {
      width: 80,
      height: 80,
      borderRadius: 40,
    },
    profilePicPlaceholder: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: C.orange,
      justifyContent: "center",
      alignItems: "center",
    },
    profilePicPlaceholderText: {
      fontSize: 32,
      fontFamily: boldFont,
      color: C.white,
    },
    profilePicEditText: {
      fontSize: scaleFont(12, m),
      fontFamily: regularFont,
      color: C.orange,
      marginTop: 8,
    },
  });
};
