import { useSettings } from "@/contexts/SettingsContext";
import React, { createContext, useContext, useEffect, useMemo } from "react";
import { Text, TextInput } from "react-native";

type FontContextValue = {
  fontFamily: string | undefined;
  fontSizeMultiplier: number;
};

const FontContext = createContext<FontContextValue>({
  fontFamily: undefined,
  fontSizeMultiplier: 1,
});

type TextDefaultProps = React.ComponentProps<typeof Text> & {
  style?: any;
};

type TextInputDefaultProps = React.ComponentProps<typeof TextInput> & {
  style?: any;
};

export function FontProvider({ children }: { children: React.ReactNode }) {
  const { getFontFamily, getFontSizeMultiplier } = useSettings();
  const fontFamily = getFontFamily();
  const fontSizeMultiplier = getFontSizeMultiplier();

  useEffect(() => {
    const textBase = (Text as any).defaultProps || {};
    const inputBase = (TextInput as any).defaultProps || {};

    const normalizedFontFamily = fontFamily === "System" ? undefined : fontFamily;
    const globalTextStyle = { fontFamily: normalizedFontFamily, fontSize: 14 * fontSizeMultiplier };

    (Text as any).defaultProps = {
      ...textBase,
      allowFontScaling: true,
      style: globalTextStyle,
    } as TextDefaultProps;

    (TextInput as any).defaultProps = {
      ...inputBase,
      allowFontScaling: true,
      style: globalTextStyle,
    } as TextInputDefaultProps;
  }, [fontFamily, fontSizeMultiplier]);

  const value = useMemo(
    () => ({
      fontFamily: fontFamily === "System" ? undefined : fontFamily,
      fontSizeMultiplier,
    }),
    [fontFamily, fontSizeMultiplier],
  );

  return <FontContext.Provider value={value}>{children}</FontContext.Provider>;
}

export function useFontSettings() {
  return useContext(FontContext);
}
