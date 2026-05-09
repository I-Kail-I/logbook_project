import { Lang, TranslationKey, translations } from "@/constants/translations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "@app_settings";

export type FontFamily = "inter" | "roboto" | "opensans" | "system";
export type FontSize = "small" | "normal" | "large" | "extraLarge";

export interface AppSettings {
  language: Lang;
  notificationsEnabled: boolean;
  theme: "light" | "dark";
  pushToken: string | null;
  fontFamily: FontFamily;
  fontSize: FontSize;
  highContrast: boolean;
  reducedMotion: boolean;
}

const defaultSettings: AppSettings = {
  language: "id",
  notificationsEnabled: false,
  theme: "light",
  pushToken: null,
  fontFamily: "inter",
  fontSize: "normal",
  highContrast: false,
  reducedMotion: false,
};

interface SettingsContextType {
  settings: AppSettings;
  loaded: boolean;
  setLanguage: (lang: Lang) => Promise<void>;
  toggleNotifications: () => Promise<void>;
  setTheme: (theme: "light" | "dark") => Promise<void>;
  toggleTheme: () => Promise<void>;
  setPushToken: (token: string | null) => Promise<void>;
  setFontFamily: (font: FontFamily) => Promise<void>;
  setFontSize: (size: FontSize) => Promise<void>;
  toggleHighContrast: () => Promise<void>;
  toggleReducedMotion: () => Promise<void>;
  t: (key: TranslationKey) => string;
  getFontFamily: () => string;
  getFontSizeMultiplier: () => number;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<AppSettings>;
          setSettings((prev) => ({ ...prev, ...parsed }));
        }
      })
      .catch(console.error)
      .finally(() => setLoaded(true));
  }, []);

  const persist = useCallback(async (next: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...next };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(console.error);
      return updated;
    });
  }, []);

  const setLanguage = useCallback(async (language: Lang) => persist({ language }), [persist]);

  const toggleNotifications = useCallback(async () => {
    persist({ notificationsEnabled: !settings.notificationsEnabled });
  }, [persist, settings.notificationsEnabled]);

  const setTheme = useCallback(async (theme: "light" | "dark") => persist({ theme }), [persist]);

  const toggleTheme = useCallback(async () => {
    persist({ theme: settings.theme === "light" ? "dark" : "light" });
  }, [persist, settings.theme]);

  const setPushToken = useCallback(async (pushToken: string | null) => persist({ pushToken }), [persist]);

  const setFontFamily = useCallback(async (fontFamily: FontFamily) => persist({ fontFamily }), [persist]);

  const setFontSize = useCallback(async (fontSize: FontSize) => persist({ fontSize }), [persist]);

  const toggleHighContrast = useCallback(async () => {
    persist({ highContrast: !settings.highContrast });
  }, [persist, settings.highContrast]);

  const toggleReducedMotion = useCallback(async () => {
    persist({ reducedMotion: !settings.reducedMotion });
  }, [persist, settings.reducedMotion]);

  const getFontFamily = useCallback(() => {
    const fontMap: Record<FontFamily, string> = {
      inter: "Inter",
      roboto: "Roboto",
      opensans: "OpenSans",
      system: "System",
    };
    return fontMap[settings.fontFamily];
  }, [settings.fontFamily]);

  const getFontSizeMultiplier = useCallback(() => {
    const sizeMap: Record<FontSize, number> = {
      small: 0.875,
      normal: 1,
      large: 1.125,
      extraLarge: 1.25,
    };
    return sizeMap[settings.fontSize];
  }, [settings.fontSize]);

  const t = useCallback((key: TranslationKey) => translations[settings.language][key] || key, [settings.language]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loaded,
        setLanguage,
        toggleNotifications,
        setTheme,
        toggleTheme,
        setPushToken,
        setFontFamily,
        setFontSize,
        toggleHighContrast,
        toggleReducedMotion,
        t,
        getFontFamily,
        getFontSizeMultiplier,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be inside SettingsProvider");
  return ctx;
}
