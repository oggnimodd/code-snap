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
  aspectRatio: "auto" | "16:9" | "4:3" | "1:1";
}

// This store will control the background frame
export const frameStore: FrameStore = $state({
  // Padding can be 0,16,32,64,128
  padding: 16,
  // Radius can be 0,8,16,24
  radius: 0,
  // Show frame or not
  visible: true,
  // Control opacity of the frame, from 0 to 1
  opacity: 1,
  // Background type, can be solid, gradient, or image
  background: {
    type: "solid",
    value: "#0000FF",
  },
  // Aspect ratio of the frame, can be 16:9, 4:3, etc. Default to auto
  aspectRatio: "auto",
});

export const windowStore = $state({
  // true => "Yes", false => "No"
  header: true,
  // "none", "small", "medium", "large"
  shadow: "small",
  // "none", "thin", "normal", "thick", etc.
  border: "none",
});

export const editorStore = $state({
  // syntax
  language: "typescript",
  theme: "aura-dark",
  lineNumbers: true,
  // Only applied when lineNumbers is true
  lineNumberStart: 1,
});

export const fontStore = $state({
  family: "ibm-plex-mono",
  weight: "regular",
  ligatures: true,
});
