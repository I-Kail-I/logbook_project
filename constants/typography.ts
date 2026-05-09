import { FontFamily } from "@/contexts/SettingsContext";

type FontWeightVariant = "regular" | "bold" | "extraBold";

export function resolveFontFamily(selected: FontFamily, weight: FontWeightVariant = "regular") {
  if (selected === "system") {
    return undefined;
  }

  if (selected === "roboto") {
    return weight === "regular" ? "Roboto-Regular" : "Roboto-Bold";
  }

  if (selected === "opensans") {
    return weight === "regular" ? "OpenSans-Regular" : "OpenSans-Bold";
  }

  if (selected === "inter") {
    if (weight === "extraBold") {
      return "Inter-ExtraBold";
    }
    return "Inter-Bold";
  }

  return undefined;
}

export function scaleFont(size: number, multiplier: number) {
  return Math.round(size * multiplier * 100) / 100;
}
