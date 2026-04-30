import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

//  Screen Dimensions
const { width: W, height: H } = Dimensions.get("window");

//  Design Tokens
const C = {
  // Background
  gradientBg: "#E08A0E",

  // Light card
  card: "#FFFFFF",
  cardShadow: "rgba(0,0,0,0.18)",
  loginTitle: "#1A1A1A",

  // Inputs
  inputBg: "#F5F5F5",
  inputBorder: "#E9740D",
  inputBorderIdle: "#E0E0E0",
  inputLabel: "#E9740D",
  inputText: "#1A1A1A",
  inputPlaceholder: "rgba(0,0,0,0.35)",

  // Button
  loginBtn: "#E9740D",
  loginBtnText: "#FFFFFF",
  showHide: "#E9740D",

  white: "#FFFFFF",
};

//  Animation Timings (ms)
const T = {
  dropDelay: 350,
  dropDuration: 650,
  holdAtCenter: 700,
  riseDuration: 550,
  cardDuration: 650,
  cardDelay: 250,
  formDuration: 400,
  formDelay: 150,
};

//  Layout Constants
const LOGO_SIZE = W * 0.62;
const CARD_HEIGHT = H * 0.51;

const LOGO_Y_START = -LOGO_SIZE - 60;
const LOGO_Y_CENTER = H * 0.2;
const LOGO_Y_FINAL = H * 0.065;

export default function LoginScreen() {
  const router = useRouter();

  const [nip, setNip] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const [nipFocused, setNipFocused] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);

  const logoY = useRef(new Animated.Value(LOGO_Y_START)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const cardY = useRef(new Animated.Value(CARD_HEIGHT + 60)).current;
  const formOp = useRef(new Animated.Value(0)).current;
  const textOp = useRef(new Animated.Value(0)).current;

  //  Intro Animation
  useEffect(() => {
    Animated.sequence([
      Animated.delay(T.dropDelay),

      // Phase 1: Logo drop with bounce
      Animated.parallel([
        Animated.spring(logoY, {
          toValue: LOGO_Y_CENTER,
          useNativeDriver: true,
          tension: 52,
          friction: 7,
          velocity: 4,
        }),
        Animated.timing(logoScale, {
          toValue: 1.05,
          duration: T.dropDuration,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
      ]),

      Animated.delay(T.holdAtCenter),

      // Phase 2: Logo rise, card slide, subtitle fade
      Animated.parallel([
        Animated.timing(logoY, {
          toValue: LOGO_Y_FINAL,
          duration: T.riseDuration,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 0.9,
          duration: T.riseDuration,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(T.cardDelay),
          Animated.timing(cardY, {
            toValue: 0,
            duration: T.cardDuration,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(120),
          Animated.timing(textOp, {
            toValue: 1,
            duration: T.riseDuration * 0.9,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ]),

      // Phase 3: Form fade in
      Animated.delay(T.formDelay),
      Animated.timing(formOp, {
        toValue: 1,
        duration: T.formDuration,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  //  Login Handler
  const handleLogin = async () => {
    if (!nip.trim() || !password.trim()) return;
    setLoading(true);
    try {
      // TODO: Replace with your real API call:
      // const { data } = await axios.post('/api/auth/login', { nip, password });
      // await AsyncStorage.setItem('token', data.token);
      await new Promise((r) => setTimeout(r, 1000));
      router.replace("/(tabs)");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={s.container}>
          <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

          {/*
           * Background: Gradient layer + Photo overlay (20% opacity)
           * Photo uses cover mode to fill screen without distortion
           */}
          <View style={s.bgGradient} />
          <Image source={require("@/assets/images/background_UNM.png")} style={s.bgPhoto} resizeMode="cover" />

          {/* Animated logo block */}
          <Animated.View style={[s.logoBlock, { transform: [{ translateY: logoY }, { scale: logoScale }] }]}>
            <Image source={require("@/assets/images/Logo_UNM.png")} style={s.logo} resizeMode="contain" />
            <Animated.Text style={[s.uniLabel, { opacity: textOp }]}>UNIVERSITAS NEGERI MAKASSAR</Animated.Text>
            <Animated.Text style={[s.logbookLabel, { opacity: textOp }]}>LOGBOOK</Animated.Text>
          </Animated.View>

          {/* Login card (slides up from bottom) */}
          <Animated.View style={[s.card, { transform: [{ translateY: cardY }] }]}>
            <ScrollView
              contentContainerStyle={s.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Form Title */}
              <Animated.Text style={[s.loginTitle, { opacity: formOp }]}>Login</Animated.Text>

              {/* NIP Field */}
              <Animated.View style={[s.fieldWrap, { opacity: formOp }]}>
                <Text style={s.fieldLabel}>NIP</Text>
                <View style={[s.inputBox, nipFocused && s.inputBoxFocused]}>
                  <TextInput
                    style={s.textInput}
                    value={nip}
                    onChangeText={setNip}
                    placeholder="Masukkan NIP Anda"
                    placeholderTextColor={C.inputPlaceholder}
                    keyboardType="numeric"
                    autoCapitalize="none"
                    selectionColor={C.inputLabel}
                    onFocus={() => setNipFocused(true)}
                    onBlur={() => setNipFocused(false)}
                  />
                </View>
              </Animated.View>

              {/* Password Field */}
              <Animated.View style={[s.fieldWrap, { opacity: formOp }]}>
                <Text style={s.fieldLabel}>Password</Text>
                <View style={[s.inputBox, pwFocused && s.inputBoxFocused]}>
                  <TextInput
                    style={[s.textInput, { flex: 1 }]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Masukkan Password"
                    placeholderTextColor={C.inputPlaceholder}
                    secureTextEntry={secureText}
                    autoCapitalize="none"
                    selectionColor={C.inputLabel}
                    onFocus={() => setPwFocused(true)}
                    onBlur={() => setPwFocused(false)}
                  />
                  <TouchableOpacity
                    onPress={() => setSecureText((v) => !v)}
                    style={s.showHideBtn}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={s.showHideText}>{secureText ? "Lihat" : "Sembunyikan"}</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>

              {/* Login Button */}
              <Animated.View style={[s.btnWrap, { opacity: formOp }]}>
                <TouchableOpacity
                  style={[s.btn, loading && s.btnDisabled]}
                  onPress={handleLogin}
                  activeOpacity={0.8}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={C.loginBtnText} size="small" />
                  ) : (
                    <Text style={s.btnText}>Login</Text>
                  )}
                </TouchableOpacity>
              </Animated.View>
            </ScrollView>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

//  Styles
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.gradientBg,
  },
  container: {
    flex: 1,
  },

  // Background
  bgGradient: {
    // Note: Replace with expo-linear-gradient for real gradient effect
    ...StyleSheet.absoluteFillObject,
    backgroundColor: C.gradientBg,
  },
  bgPhoto: {
    // Full screen coverage with cover mode (crops to fill, preserves ratio)
    position: "absolute",
    top: 0,
    left: 0,
    width: W,
    height: H,
    opacity: 0.2,
  },

  // Logo
  logoBlock: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  logo: {
    width: W * 0.62,
    height: W * 0.62,
    shadowColor: "#474747",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  uniLabel: {
    marginTop: 4,
    fontSize: 14,
    color: C.white,
    letterSpacing: -0.3,
    fontFamily: "Magra-Regular",
    textAlign: "center",
  },
  logbookLabel: {
    fontSize: 40,
    color: C.white,
    letterSpacing: 2,
    fontFamily: "ABeeZee-Regular",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.25)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
    marginTop: 10,
  },

  // Login Card
  card: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: CARD_HEIGHT,
    backgroundColor: C.card,
    borderTopLeftRadius: 47,
    borderTopRightRadius: 47,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    // Shadow (casts upward)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 16,
    zIndex: 99,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },

  // Form
  loginTitle: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    color: C.loginTitle,
    textAlign: "center",
    letterSpacing: -0.5,
    marginBottom: 24,
    // Drop shadow
    textShadowColor: "rgba(0,0,0,0.15)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },

  fieldWrap: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: C.inputLabel,
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.inputBg,
    borderWidth: 1.5,
    borderColor: C.inputBorderIdle,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  inputBoxFocused: {
    borderColor: C.inputBorder,
    backgroundColor: "#FFFAF5",
  },
  textInput: {
    flex: 1,
    color: C.inputText,
    fontSize: 14.5,
    paddingVertical: 0,
    margin: 0,
  },
  showHideBtn: {
    paddingLeft: 10,
  },
  showHideText: {
    fontSize: 12,
    color: C.showHide,
    fontWeight: "500",
  },

  // Button
  btnWrap: {
    marginTop: 20,
    alignItems: "center",
  },
  btn: {
    width: "65%",
    backgroundColor: C.loginBtn,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.loginBtn,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  btnDisabled: {
    opacity: 0.55,
  },
  btnText: {
    color: C.loginBtnText,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
