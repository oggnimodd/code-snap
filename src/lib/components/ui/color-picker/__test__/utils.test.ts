import { describe, it, expect } from "vitest";
import { hexToRgb, rgbToHsv, hsvToRgb, rgbToHex } from "../utils";

describe("hexToRgb", () => {
  it("converts a 6-digit hex to RGB with alpha 255", () => {
    const result = hexToRgb("#ff5733");
    expect(result).toEqual({ r: 255, g: 87, b: 51, a: 255 });
  });

  it("converts a 3-digit shorthand hex to RGB with alpha 255", () => {
    const result = hexToRgb("#abc");
    expect(result).toEqual({ r: 170, g: 187, b: 204, a: 255 });
  });

  it("converts an 8-digit hex to RGB including alpha", () => {
    const result = hexToRgb("#ff573380");
    expect(result).toEqual({ r: 255, g: 87, b: 51, a: 128 });
  });

  it("converts hex without leading hash", () => {
    const result = hexToRgb("ff5733");
    expect(result).toEqual({ r: 255, g: 87, b: 51, a: 255 });
  });

  it("returns null for invalid hex strings", () => {
    const result = hexToRgb("invalid");
    expect(result).toBeNull();
  });
});

describe("rgbToHsv", () => {
  it("converts red RGB to HSV", () => {
    const result = rgbToHsv(255, 0, 0);
    expect(result).toEqual({ h: 0, s: 100, v: 100 });
  });

  it("converts green RGB to HSV", () => {
    const result = rgbToHsv(0, 255, 0);
    expect(result).toEqual({ h: 120, s: 100, v: 100 });
  });

  it("converts blue RGB to HSV", () => {
    const result = rgbToHsv(0, 0, 255);
    expect(result).toEqual({ h: 240, s: 100, v: 100 });
  });

  it("converts white RGB to HSV", () => {
    const result = rgbToHsv(255, 255, 255);
    expect(result).toEqual({ h: 0, s: 0, v: 100 });
  });

  it("converts black RGB to HSV", () => {
    const result = rgbToHsv(0, 0, 0);
    expect(result).toEqual({ h: 0, s: 0, v: 0 });
  });

  it("converts grey RGB to HSV", () => {
    const result = rgbToHsv(128, 128, 128);
    expect(result).toEqual({ h: 0, s: 0, v: 50 });
  });
});

describe("hsvToRgb", () => {
  it("converts HSV red to RGB", () => {
    const result = hsvToRgb(0, 100, 100);
    expect(result).toEqual({ r: 255, g: 0, b: 0 });
  });

  it("converts HSV green to RGB", () => {
    const result = hsvToRgb(120, 100, 100);
    expect(result).toEqual({ r: 0, g: 255, b: 0 });
  });

  it("converts HSV blue to RGB", () => {
    const result = hsvToRgb(240, 100, 100);
    expect(result).toEqual({ r: 0, g: 0, b: 255 });
  });

  it("converts HSV with zero saturation to white/grey", () => {
    const white = hsvToRgb(0, 0, 100);
    expect(white).toEqual({ r: 255, g: 255, b: 255 });
    const grey = hsvToRgb(0, 0, 50);
    expect(grey).toEqual({ r: 128, g: 128, b: 128 });
  });

  it("handles hue of 360 correctly", () => {
    const result = hsvToRgb(360, 100, 100);
    expect(result).toEqual({ r: 255, g: 0, b: 0 });
  });
});

describe("rgbToHex", () => {
  it("converts RGB to hex without alpha", () => {
    const result = rgbToHex(255, 0, 0);
    expect(result).toEqual("#ff0000");
  });

  it("converts RGB to hex with alpha when provided and not 255", () => {
    const result = rgbToHex(255, 0, 0, 128);
    expect(result).toEqual("#ff000080");
  });

  it("does not append alpha if it is 255", () => {
    const result = rgbToHex(255, 0, 0, 255);
    expect(result).toEqual("#ff0000");
  });

  it("converts another RGB value to hex correctly", () => {
    const result = rgbToHex(0, 128, 255);
    expect(result).toEqual("#0080ff");
  });
});
