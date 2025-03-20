import { FONT_FAMILY_OPTIONS, THEME_OPTIONS } from "$lib/config";
import {
  SOLID_COLOR_PRESETS,
  GRADIENT_COLOR_PRESETS,
} from "$lib/config/colors";
import type { EditorView } from "@codemirror/view";

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
  padding: 64,
  radius: 0,
  visible: true,
  opacity: 1,
  background: {
    type: "gradient",
    value: "linear-gradient(135deg, #9B5DE5 0%, #F15BB5 50%, #FEE440 100%)",
  },
  aspectRatio: "auto",
});

export const windowStore = $state({
  shadow: "small",
  border: "none",
  reflection: true,
});

interface EditorStore {
  language: string;
  theme: string;
  lineNumbers: boolean;
  lineNumberStart: number;
  isReady: boolean;
  editorView: EditorView | null;
}

export const editorStore: EditorStore = $state({
  language: "typescript",
  theme: "aura",
  lineNumbers: true,
  lineNumberStart: 1,
  isReady: false,
  editorView: null,
});

export const fontStore = $state({
  family: "ibm-plex-mono",
  weight: "regular",
  ligatures: true,
});

export interface ExportConfig {
  type: "svg" | "png" | "jpeg";
  scale: 1 | 2 | 3 | 4;
}

export const exportConfigStore = $state<ExportConfig>({
  type: "png",
  scale: 1,
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

  // Randomly choose between solid and gradient, but only use presets
  const bgType: BackgroundType = Math.random() < 0.5 ? "solid" : "gradient";
  let bgValue: BackgroundValue;

  if (bgType === "solid") {
    // Only use solid color presets
    bgValue = getRandomItem(SOLID_COLOR_PRESETS);
  } else {
    // Only use gradient color presets
    bgValue = getRandomItem(GRADIENT_COLOR_PRESETS);
  }

  frameStore.background.type = bgType;
  frameStore.background.value = bgValue;
}
