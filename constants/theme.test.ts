import { getThemeColors } from "@/constants/theme";

describe("getThemeColors", () => {
  it("returns high contrast tokens when enabled", () => {
    const colors = getThemeColors(false, true);
    expect(colors.bgGray).toBe("#FFFFFF");
    expect(colors.textDark).toBe("#000000");
    expect(colors.border).toBe("#000000");
  });

  it("returns dark colors in normal mode", () => {
    const colors = getThemeColors(true, false);
    expect(colors.bgGray).toBe("#1A1A1A");
    expect(colors.textDark).toBe("#FFFFFF");
  });
});
