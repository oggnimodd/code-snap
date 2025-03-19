import { FONT_FAMILY_OPTIONS, THEME_OPTIONS } from "$lib/config";
import {
  SOLID_COLOR_PRESETS,
  GRADIENT_COLOR_PRESETS,
} from "$lib/config/colors";

export type BackgroundType = "solid" | "gradient" | "image";
export type BackgroundValue = string;

export interface FrameStore {
  padding: number;
  radius: number;
  visible: boolean;
  opacity: number;
  background: {
    type: BackgroundType;
    value: BackgroundValue;
  };
}

// This store will control the background frame
export const frameStore: FrameStore = $state({
  padding: 16,
  radius: 0,
  visible: true,
  opacity: 1,
  background: {
    type: "solid",
    value: "#0000FF",
  },
  aspectRatio: "auto",
});

export const windowStore = $state({
  shadow: "small",
  border: "none",
  reflection: true,
});

export const editorStore = $state({
  language: "typescript",
  theme: "aura",
  lineNumbers: true,
  lineNumberStart: 1,
});

export const fontStore = $state({
  family: "ibm-plex-mono",
  weight: "regular",
  ligatures: true,
});

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomize() {
  fontStore.family = getRandomItem(FONT_FAMILY_OPTIONS).value;
  editorStore.theme = getRandomItem(THEME_OPTIONS).value;

  const shadowOptions = ["none", "small", "medium", "large"];
  windowStore.shadow = getRandomItem(shadowOptions);
  windowStore.reflection = Math.random() < 0.5;

  const bgType: BackgroundType = Math.random() < 0.5 ? "solid" : "gradient";
  let bgValue: BackgroundValue;

  if (bgType === "solid") {
    if (SOLID_COLOR_PRESETS.length > 0 && Math.random() < 0.5) {
      bgValue = getRandomItem(SOLID_COLOR_PRESETS);
    } else {
      bgValue =
        "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0");
    }
  } else {
    if (GRADIENT_COLOR_PRESETS.length > 0 && Math.random() < 0.5) {
      bgValue = getRandomItem(GRADIENT_COLOR_PRESETS);
    } else {
      // Randomize the angle instead of fixed 45deg
      const angle = Math.floor(Math.random() * 360);
      const color1 =
        "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0");
      const color2 =
        "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0");
      bgValue = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
    }
  }
  frameStore.background = { type: bgType, value: bgValue };
}
