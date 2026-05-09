import { resolveFontFamily, scaleFont } from "@/constants/typography";

describe("typography helpers", () => {
  it("resolves roboto families correctly", () => {
    expect(resolveFontFamily("roboto", "regular")).toBe("Roboto-Regular");
    expect(resolveFontFamily("roboto", "bold")).toBe("Roboto-Bold");
  });

  it("uses system fallback when system is selected", () => {
    expect(resolveFontFamily("system", "bold")).toBeUndefined();
  });

  it("scales font size with multiplier", () => {
    expect(scaleFont(16, 1.25)).toBe(20);
  });
});
