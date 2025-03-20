export function hexToRgb(
  hex: string
): { r: number; g: number; b: number; a?: number } | null {
  const shorthand = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthand, (_, r, g, b) => r + r + g + g + b + b);
  const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(
    hex
  );
  return res
    ? {
        r: parseInt(res[1], 16),
        g: parseInt(res[2], 16),
        b: parseInt(res[3], 16),
        a: res[4] ? parseInt(res[4], 16) : 255,
      }
    : null;
}

export function rgbToHsv(
  r: number,
  g: number,
  b: number
): { h: number; s: number; v: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  const d = max - min;
  let hVal = 0;
  const sVal = max === 0 ? 0 : d / max;
  const vVal = max;
  if (max !== min) {
    switch (max) {
      case r:
        hVal = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        hVal = (b - r) / d + 2;
        break;
      case b:
        hVal = (r - g) / d + 4;
        break;
    }
    hVal /= 6;
  }
  return {
    h: Math.round(hVal * 360),
    s: Math.round(sVal * 100),
    v: Math.round(vVal * 100),
  };
}

export function hsvToRgb(
  h: number,
  s: number,
  v: number
): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  v /= 100;
  let rr = 0,
    gg = 0,
    bb = 0;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      rr = v;
      gg = t;
      bb = p;
      break;
    case 1:
      rr = q;
      gg = v;
      bb = p;
      break;
    case 2:
      rr = p;
      gg = v;
      bb = t;
      break;
    case 3:
      rr = p;
      gg = q;
      bb = v;
      break;
    case 4:
      rr = t;
      gg = p;
      bb = v;
      break;
    case 5:
      rr = v;
      gg = p;
      bb = q;
      break;
  }
  return {
    r: Math.round(rr * 255),
    g: Math.round(gg * 255),
    b: Math.round(bb * 255),
  };
}

export function rgbToHex(
  r: number,
  g: number,
  b: number,
  alpha?: number
): string {
  const toHex = (c: number) => c.toString(16).padStart(2, "0");
  let out = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  if (alpha !== undefined && alpha !== 255) out += toHex(alpha);
  return out;
}

export function hexToRGBA(hex: string, alpha: number) {
  // Remove the hash if present
  hex = hex.replace(/^#/, "");

  let r: number, g: number, b: number;

  // Handle shorthand (#RGB) or full form (#RRGGBB)
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  } else {
    // Return a default fallback if the hex is not valid
    return hex;
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
