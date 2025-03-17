<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import IconTrash from "@tabler/icons-svelte/icons/trash";

  interface ColorPickerProps {
    value: string;
    // Changed default to a sensible gradient value
    initialColor?: string;
    onchange?: (color: string) => void;
    maxGradientColors?: number;
  }

  // Default gradient value if parsing fails
  const DEFAULT_VALUE = "linear-gradient(90deg, #000000 0%, #ffffff 100%)";

  let {
    value = $bindable(),
    initialColor = DEFAULT_VALUE,
    onchange,
    maxGradientColors = 5,
  }: ColorPickerProps = $props();

  // Always in gradient mode
  let color = $state(initialColor);
  let h = $state(0);
  let s = $state(100);
  let vVal = $state(100); // renamed from v to vVal
  let a = $state(255);
  let r = $state(0);
  let g = $state(0);
  let b = $state(0);
  let hexValue = $state(initialColor);

  let colorCanvas = $state<HTMLCanvasElement | null>(null);
  let hueCanvas = $state<HTMLCanvasElement | null>(null);
  let alphaCanvas = $state<HTMLCanvasElement | null>(null);
  let gradientCanvas = $state<HTMLCanvasElement | null>(null);

  let isDragging = $state(false);
  let isDraggingHue = $state(false);
  let isDraggingAlpha = $state(false);
  let isDraggingGradient = $state(false);

  let pointer = $state({ x: 0, y: 0 });
  let huePosition = $state(0);
  let alphaPosition = $state(0);
  let colorRect: DOMRect | null = null;
  let gradientRect: DOMRect | null = null;
  let inited = false;
  let containerEl = $state<HTMLDivElement | null>(null);

  interface GradientStop {
    pos: number;
    color: string;
  }
  // For a gradient default, use two different colors.
  let gradientStops: GradientStop[] = $state([
    { pos: 0, color: "#000000" },
    { pos: 100, color: "#ffffff" },
  ]);
  let activeGradientStop = $state(0);
  let gradientType = $state<"linear" | "radial">("linear");
  let gradientAngle = $state(90);
  let gradientDraggingIndex: number | null = null;

  // Helper: parse a gradient string and update state. Returns true if parsed.
  function parseGradient(val: string): boolean {
    const vTrim = val.trim().replace(/;$/, ""); // remove trailing semicolon if any
    let parsed = false;
    if (vTrim.startsWith("linear-gradient")) {
      gradientType = "linear";
      const linearMatch = vTrim.match(
        /^linear-gradient\(\s*(-?\d+)deg,\s*(.+)\)$/
      );
      if (linearMatch) {
        gradientAngle = parseInt(linearMatch[1]);
        const stopsPart = linearMatch[2];
        const regex =
          /(#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8}))\s*(\d+)%/g;
        let m;
        let stops: GradientStop[] = [];
        while ((m = regex.exec(stopsPart))) {
          stops.push({ color: m[1], pos: parseInt(m[2]) });
        }
        if (stops.length >= 2) {
          stops.sort((a, b) => a.pos - b.pos);
          gradientStops = stops;
          activeGradientStop = 0;
          // Active color is the leftmost stop
          hexValue = gradientStops[0].color;
          const rgb = hexToRgb(hexValue);
          if (rgb) {
            const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
            h = hsv.h;
            s = hsv.s;
            vVal = hsv.v;
            r = rgb.r;
            g = rgb.g;
            b = rgb.b;
          }
          parsed = true;
        }
      }
    } else if (vTrim.startsWith("radial-gradient")) {
      gradientType = "radial";
      const radialMatch = vTrim.match(/^radial-gradient\(\s*circle,\s*(.+)\)$/);
      if (radialMatch) {
        const stopsPart = radialMatch[1];
        const regex =
          /(#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8}))\s*(\d+)%/g;
        let m;
        let stops: GradientStop[] = [];
        while ((m = regex.exec(stopsPart))) {
          stops.push({ color: m[1], pos: parseInt(m[2]) });
        }
        if (stops.length >= 2) {
          stops.sort((a, b) => a.pos - b.pos);
          gradientStops = stops;
          activeGradientStop = 0;
          hexValue = gradientStops[0].color;
          const rgb = hexToRgb(hexValue);
          if (rgb) {
            const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
            h = hsv.h;
            s = hsv.s;
            vVal = hsv.v;
            r = rgb.r;
            g = rgb.g;
            b = rgb.b;
          }
          parsed = true;
        }
      }
    }
    return parsed;
  }

  // Parse initial value on mount
  $effect(() => {
    if (!inited && initialColor) {
      inited = true;
      if (
        initialColor.startsWith("linear-gradient") ||
        initialColor.startsWith("radial-gradient")
      ) {
        if (!parseGradient(initialColor)) {
          value = DEFAULT_VALUE;
          parseGradient(DEFAULT_VALUE);
          if (onchange) onchange(DEFAULT_VALUE);
        }
        updateColorCanvas();
        updateHueCanvas();
        updateAlphaCanvas();
        updateGradientCanvas();
        updatePointerFromHsv();
      } else {
        const rgb = hexToRgb(initialColor);
        if (rgb) {
          const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
          h = hsv.h;
          s = hsv.s;
          vVal = hsv.v;
          a = rgb.a ?? 255;
          r = rgb.r;
          g = rgb.g;
          b = rgb.b;
          hexValue = initialColor;
          updateColorValue();
          updatePointerFromHsv();
          if (hueCanvas) huePosition = (h / 360) * hueCanvas.width;
        }
      }
    }
  });

  // When external value changes, always parse and update the active color.
  $effect(() => {
    if (value !== color) {
      const trimmed = value.trim().replace(/;$/, "");
      let parsed = false;
      if (
        trimmed.startsWith("linear-gradient") ||
        trimmed.startsWith("radial-gradient")
      ) {
        parsed = parseGradient(trimmed);
      } else {
        const rgb = hexToRgb(trimmed);
        if (rgb) {
          const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
          h = hsv.h;
          s = hsv.s;
          vVal = hsv.v;
          a = rgb.a ?? 255;
          r = rgb.r;
          g = rgb.g;
          b = rgb.b;
          hexValue = trimmed;
          parsed = true;
        }
      }
      if (!parsed) {
        value = DEFAULT_VALUE;
        parseGradient(DEFAULT_VALUE);
        if (onchange) onchange(DEFAULT_VALUE);
      }
      updateColorCanvas();
      updateHueCanvas();
      updateAlphaCanvas();
      updateGradientCanvas();
      updatePointerFromHsv();
      color = value;
    }
  });

  function hexToRgb(hex: string) {
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

  function rgbToHsv(r: number, g: number, b: number) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    const d = max - min;
    let hVal = 0;
    const sVal = max === 0 ? 0 : d / max;
    const vValLocal = max;
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
      v: Math.round(vValLocal * 100),
    };
  }

  function hsvToRgb(h: number, s: number, v: number) {
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

  function rgbToHex(r: number, g: number, b: number, alpha?: number) {
    const toHex = (c: number) => c.toString(16).padStart(2, "0");
    let out = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    if (alpha !== undefined && alpha !== 255) out += toHex(alpha);
    return out;
  }

  function rgbToCss(r: number, g: number, b: number, alpha: number) {
    return `rgba(${r}, ${g}, ${b}, ${(alpha / 255).toFixed(2)})`;
  }

  function getGradientCssString() {
    const stops = [...gradientStops].sort((a, b) => a.pos - b.pos);
    const stopsStr = stops
      .map((st) => `${st.color} ${st.pos.toFixed(0)}%`)
      .join(", ");
    return gradientType === "linear"
      ? `linear-gradient(${gradientAngle}deg, ${stopsStr})`
      : `radial-gradient(circle, ${stopsStr})`;
  }

  function updateColorCanvas() {
    if (!colorCanvas) return;
    const ctx = colorCanvas.getContext("2d");
    if (!ctx) return;
    const w = colorCanvas.width,
      hValCanvas = colorCanvas.height;
    ctx.clearRect(0, 0, w, hValCanvas);
    ctx.fillStyle = `hsl(${h}, 100%, 50%)`;
    ctx.fillRect(0, 0, w, hValCanvas);
    const whiteGrad = ctx.createLinearGradient(0, 0, w, 0);
    whiteGrad.addColorStop(0, "rgba(255,255,255,1)");
    whiteGrad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = whiteGrad;
    ctx.fillRect(0, 0, w, hValCanvas);
    const blackGrad = ctx.createLinearGradient(0, 0, 0, hValCanvas);
    blackGrad.addColorStop(0, "rgba(0,0,0,0)");
    blackGrad.addColorStop(1, "rgba(0,0,0,1)");
    ctx.fillStyle = blackGrad;
    ctx.fillRect(0, 0, w, hValCanvas);
  }

  function updateHueCanvas() {
    if (!hueCanvas) return;
    const ctx = hueCanvas.getContext("2d");
    if (!ctx) return;
    const w = hueCanvas.width,
      hValHue = hueCanvas.height;
    ctx.clearRect(0, 0, w, hValHue);
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, "#ff0000");
    grad.addColorStop(0.17, "#ffff00");
    grad.addColorStop(0.33, "#00ff00");
    grad.addColorStop(0.5, "#00ffff");
    grad.addColorStop(0.67, "#0000ff");
    grad.addColorStop(0.83, "#ff00ff");
    grad.addColorStop(1, "#ff0000");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, hValHue);
  }

  function updateAlphaCanvas() {
    if (!alphaCanvas) return;
    const ctx = alphaCanvas.getContext("2d");
    if (!ctx) return;
    const w = alphaCanvas.width,
      hValAlpha = alphaCanvas.height;
    ctx.clearRect(0, 0, w, hValAlpha);
    const square = 8;
    for (let i = 0; i < w; i += square * 2) {
      for (let j = 0; j < hValAlpha; j += square * 2) {
        ctx.fillStyle = "#ccc";
        ctx.fillRect(i, j, square, square);
        ctx.fillRect(i + square, j + square, square, square);
      }
    }
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
    grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 1)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, hValAlpha);
  }

  function updateColorValue() {
    const rgb = hsvToRgb(h, s, vVal);
    r = rgb.r;
    g = rgb.g;
    b = rgb.b;
    hexValue = rgbToHex(r, g, b, a);
    if (activeGradientStop < 0 || activeGradientStop >= gradientStops.length) {
      activeGradientStop = 0;
    }
    gradientStops[activeGradientStop].color = hexValue;
    gradientStops = [...gradientStops];
    const gradientStr = getGradientCssString();
    color = gradientStr;
    value = gradientStr;
    if (onchange) onchange(value);
    updateAlphaCanvas();
  }

  function updateFromRgb() {
    const hsv = rgbToHsv(r, g, b);
    h = hsv.h;
    s = hsv.s;
    vVal = hsv.v;
    hexValue = rgbToHex(r, g, b, a);
    if (activeGradientStop < 0 || activeGradientStop >= gradientStops.length) {
      activeGradientStop = 0;
    }
    gradientStops[activeGradientStop].color = hexValue;
    gradientStops = [...gradientStops];
    const gradientStr = getGradientCssString();
    color = gradientStr;
    value = gradientStr;
    if (onchange) onchange(value);
    if (hueCanvas) huePosition = (h / 360) * hueCanvas.width;
    updatePointerFromHsv();
    updateColorCanvas();
    updateHueCanvas();
    updateAlphaCanvas();
  }

  function updateFromHex() {
    const rgb = hexToRgb(hexValue);
    if (rgb) {
      r = rgb.r;
      g = rgb.g;
      b = rgb.b;
      a = rgb.a ?? 255;
      if (alphaCanvas) alphaPosition = (a / 255) * alphaCanvas.width;
      updateFromRgb();
    }
  }

  function updatePointerFromHsv() {
    if (!colorCanvas) return;
    pointer.x = (s / 100) * colorCanvas.width;
    pointer.y = (1 - vVal / 100) * colorCanvas.height;
  }

  function updateHsvFromPointer() {
    if (!colorCanvas) return;
    s = Math.max(0, Math.min(100, (pointer.x / colorCanvas.width) * 100));
    vVal = Math.max(
      0,
      Math.min(100, 100 - (pointer.y / colorCanvas.height) * 100)
    );
    updateColorValue();
  }

  function handleColorCanvasMousedown(e: MouseEvent) {
    if (!colorCanvas) return;
    isDragging = true;
    colorRect = colorCanvas.getBoundingClientRect();
    handleColorCanvasMousemove(e);
  }

  function handleColorCanvasMousemove(e: MouseEvent) {
    if (!isDragging || !colorCanvas || !colorRect) return;
    let xPos = e.clientX - colorRect.left;
    let yPos = e.clientY - colorRect.top;
    xPos = Math.max(0, Math.min(colorRect.width, xPos));
    yPos = Math.max(0, Math.min(colorRect.height, yPos));
    pointer.x = xPos;
    pointer.y = yPos;
    updateHsvFromPointer();
  }

  function handleColorCanvasMouseup() {
    isDragging = false;
    colorRect = null;
  }

  function handleHueCanvasMousedown(e: MouseEvent) {
    isDraggingHue = true;
    handleHueCanvasMousemove(e);
  }

  function handleHueCanvasMousemove(e: MouseEvent) {
    if (!isDraggingHue || !hueCanvas) return;
    const rect = hueCanvas.getBoundingClientRect();
    let xPos = e.clientX - rect.left;
    xPos = Math.max(0, Math.min(rect.width, xPos));
    huePosition = xPos;
    let newH = (xPos / rect.width) * 360;
    if (newH >= 360) newH = 359.9999;
    h = newH;
    updateColorValue();
    updateColorCanvas();
    updateHueCanvas();
  }

  function handleHueCanvasMouseup() {
    isDraggingHue = false;
  }

  function handleAlphaCanvasMousedown(e: MouseEvent) {
    isDraggingAlpha = true;
    handleAlphaCanvasMousemove(e);
  }

  function handleAlphaCanvasMousemove(e: MouseEvent) {
    if (!isDraggingAlpha || !alphaCanvas) return;
    const rect = alphaCanvas.getBoundingClientRect();
    let xPos = e.clientX - rect.left;
    xPos = Math.max(0, Math.min(rect.width, xPos));
    alphaPosition = xPos;
    a = Math.round((xPos / rect.width) * 255);
    updateColorValue();
    updateAlphaCanvas();
  }

  function handleAlphaCanvasMouseup() {
    isDraggingAlpha = false;
  }

  function handleTouchStart(e: TouchEvent, type: "color" | "hue" | "alpha") {
    e.preventDefault();
    if (type === "color") {
      isDragging = true;
      colorRect = colorCanvas?.getBoundingClientRect() || null;
      handleTouchMove(e, "color");
    } else if (type === "hue") {
      isDraggingHue = true;
      handleTouchMove(e, "hue");
    } else if (type === "alpha") {
      isDraggingAlpha = true;
      handleTouchMove(e, "alpha");
    }
  }

  function handleTouchMove(e: TouchEvent, type: "color" | "hue" | "alpha") {
    e.preventDefault();
    if (e.touches.length > 0) {
      const t = e.touches[0];
      if (type === "color" && isDragging && colorRect) {
        let xPos = t.clientX - colorRect.left;
        let yPos = t.clientY - colorRect.top;
        xPos = Math.max(0, Math.min(colorRect.width, xPos));
        yPos = Math.max(0, Math.min(colorRect.height, yPos));
        pointer.x = xPos;
        pointer.y = yPos;
        updateHsvFromPointer();
      } else if (type === "hue" && isDraggingHue && hueCanvas) {
        const rect = hueCanvas.getBoundingClientRect();
        let xPos = t.clientX - rect.left;
        xPos = Math.max(0, Math.min(rect.width, xPos));
        huePosition = xPos;
        let newH = (xPos / rect.width) * 360;
        if (newH >= 360) newH = 359.9999;
        h = newH;
        updateColorValue();
        updateColorCanvas();
        updateHueCanvas();
      } else if (type === "alpha" && isDraggingAlpha && alphaCanvas) {
        const rect = alphaCanvas.getBoundingClientRect();
        let xPos = t.clientX - rect.left;
        xPos = Math.max(0, Math.min(rect.width, xPos));
        alphaPosition = xPos;
        a = Math.round((xPos / rect.width) * 255);
        updateColorValue();
        updateAlphaCanvas();
      }
    }
  }

  function handleTouchEnd() {
    isDragging = false;
    isDraggingHue = false;
    isDraggingAlpha = false;
    colorRect = null;
  }

  function updateGradientCanvas() {
    if (!gradientCanvas) return;
    const ctx = gradientCanvas.getContext("2d");
    if (!ctx) return;
    const w = gradientCanvas.width,
      hValGrad = gradientCanvas.height;
    ctx.clearRect(0, 0, w, hValGrad);
    const sorted = [...gradientStops].sort((a, b) => a.pos - b.pos);
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    sorted.forEach((stop) => {
      grad.addColorStop(stop.pos / 100, stop.color);
    });
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, hValGrad);
  }

  function handleGradientMousedown(e: MouseEvent) {
    if (!gradientCanvas) return;
    gradientRect = gradientCanvas.getBoundingClientRect();
    const x = e.clientX - gradientRect.left;
    const radius = 10;
    const existing = gradientStops.find((stop) => {
      const posX = (stop.pos / 100) * gradientRect!.width;
      return Math.abs(posX - x) < radius;
    });
    if (!existing && gradientStops.length < maxGradientColors) {
      let pos = (x / gradientRect.width) * 100;
      pos = Math.max(0, Math.min(100, pos));
      const newStop: GradientStop = {
        pos,
        color: gradientStops[activeGradientStop].color,
      };
      const stops = [...gradientStops, newStop].sort((a, b) => a.pos - b.pos);
      activeGradientStop = stops.findIndex(
        (stop) => stop.pos === newStop.pos && stop.color === newStop.color
      );
      gradientStops = stops;
      updateColorValue();
    }
  }

  function handleGradientPinMousedown(e: MouseEvent, index: number) {
    e.stopPropagation();
    gradientDraggingIndex = index;
    isDraggingGradient = true;
    if (gradientCanvas) gradientRect = gradientCanvas.getBoundingClientRect();
    activeGradientStop = index;
    // Set active color and update UI
    hexValue = gradientStops[index].color;
    updateFromHex();
  }

  function handleGradientMouseup() {
    isDraggingGradient = false;
    gradientDraggingIndex = null;
    gradientRect = null;
  }

  function calcGradientPinLeft(pos: number): number {
    if (!gradientCanvas) return 0;
    const raw = (pos / 100) * gradientCanvas.width;
    const halfPin = 9;
    return Math.max(halfPin, Math.min(gradientCanvas.width - halfPin, raw));
  }

  function deleteActiveStop() {
    if (gradientStops.length <= 2) return;
    gradientStops = gradientStops.filter((_, i) => i !== activeGradientStop);
    gradientStops = [...gradientStops].sort((a, b) => a.pos - b.pos);
    activeGradientStop = 0;
    updateColorValue();
  }

  function handleRgbInput(component: "r" | "g" | "b" | "a", val: number) {
    const c = Math.max(0, Math.min(val, 255));
    if (component === "r") r = c;
    else if (component === "g") g = c;
    else if (component === "b") b = c;
    else if (component === "a") a = c;
    if (component === "a" && alphaCanvas) {
      alphaPosition = (a / 255) * alphaCanvas.width;
    }
    updateFromRgb();
  }

  $effect(() => {
    resizeCanvases();
    const handleResize = () => resizeCanvases();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  $effect(() => {
    const handleGlobalMouseup = () => {
      isDragging = false;
      isDraggingHue = false;
      isDraggingAlpha = false;
      isDraggingGradient = false;
      gradientDraggingIndex = null;
      colorRect = null;
      gradientRect = null;
    };
    const handleGlobalMousemove = (e: MouseEvent) => {
      if (isDragging) handleColorCanvasMousemove(e);
      if (isDraggingHue) handleHueCanvasMousemove(e);
      if (isDraggingAlpha) handleAlphaCanvasMousemove(e);
      if (
        isDraggingGradient &&
        gradientDraggingIndex !== null &&
        gradientRect
      ) {
        const xPos = e.clientX - gradientRect.left;
        let newPos = (xPos / gradientRect.width) * 100;
        newPos = Math.max(0, Math.min(100, newPos));
        gradientStops[gradientDraggingIndex].pos = newPos;
        gradientStops = [...gradientStops].sort((a, b) => a.pos - b.pos);
        updateColorValue();
      }
    };
    document.addEventListener("mouseup", handleGlobalMouseup);
    document.addEventListener("mousemove", handleGlobalMousemove);
    return () => {
      document.removeEventListener("mouseup", handleGlobalMouseup);
      document.removeEventListener("mousemove", handleGlobalMousemove);
    };
  });

  function resizeCanvases() {
    if (colorCanvas) {
      const rc = colorCanvas.getBoundingClientRect();
      colorCanvas.width = rc.width;
      colorCanvas.height = rc.height;
      updateColorCanvas();
      updatePointerFromHsv();
    }
    if (hueCanvas) {
      const rc = hueCanvas.getBoundingClientRect();
      hueCanvas.width = rc.width;
      hueCanvas.height = rc.height;
      updateHueCanvas();
      huePosition = (h / 360) * hueCanvas.width;
    }
    if (alphaCanvas) {
      const rc = alphaCanvas.getBoundingClientRect();
      alphaCanvas.width = rc.width;
      alphaCanvas.height = rc.height;
      updateAlphaCanvas();
      alphaPosition = (a / 255) * alphaCanvas.width;
    }
    if (gradientCanvas) {
      const rc = gradientCanvas.getBoundingClientRect();
      gradientCanvas.width = rc.width;
      gradientCanvas.height = rc.height;
      updateGradientCanvas();
    }
  }
</script>

<div
  bind:this={containerEl}
  class="w-full rounded-md border border-gray-300 bg-card shadow-sm dark:border-gray-700"
>
  <div class="color-picker relative w-full">
    <canvas
      bind:this={colorCanvas}
      class="h-full w-full cursor-crosshair rounded-t-md"
      onmousedown={handleColorCanvasMousedown}
      onmouseup={handleColorCanvasMouseup}
      ontouchstart={(e) => handleTouchStart(e, "color")}
      ontouchmove={(e) => handleTouchMove(e, "color")}
      ontouchend={handleTouchEnd}
    ></canvas>
    <div
      class="pin"
      style="top: {pointer.y - 8}px; left: {pointer.x - 8}px;"
    ></div>
  </div>
  <div class="p-2 sm:p-3">
    <div class="mb-2 flex flex-wrap gap-2 sm:mb-3">
      <div class="ml-auto flex items-center">
        <div
          class="h-6 w-6 rounded border border-gray-300 dark:border-gray-600"
          style="background: {color};"
        ></div>
      </div>
    </div>
    <div class="mb-4">
      <div class="mb-2 flex items-center gap-2">
        <select
          bind:value={gradientType}
          class="rounded-md border border-gray-600 bg-transparent px-1.5 py-0.5 text-xs focus:outline-none"
          onchange={() => updateColorValue()}
        >
          <option value="linear">Linear</option>
          <option value="radial">Radial</option>
        </select>
        {#if gradientType === "linear"}
          <input
            type="number"
            min="0"
            max="360"
            bind:value={gradientAngle}
            oninput={() => updateColorValue()}
            class="w-16 rounded-md border border-gray-600 bg-transparent px-1.5 py-0.5 text-xs focus:outline-none"
          />
        {/if}
        {#if gradientStops.length > 2}
          <Button
            variant="destructive"
            onclick={deleteActiveStop}
            size="icon"
            class="h-5 w-5"
          >
            <IconTrash />
          </Button>
        {/if}
      </div>
      <div class="relative mb-2 h-4 w-full">
        <div class="absolute inset-0 overflow-hidden rounded-full">
          <canvas
            bind:this={gradientCanvas}
            class="h-full w-full cursor-pointer"
            onmousedown={handleGradientMousedown}
            onmouseup={handleGradientMouseup}
          ></canvas>
        </div>
        {#each gradientStops as stop, i}
          <div
            role="slider"
            tabindex="0"
            aria-valuenow={stop.pos}
            class="gradient-pin"
            style="left: {calcGradientPinLeft(
              stop.pos
            )}px; top: 50%; transform: translate(-50%, -50%); background-color: {stop.color}; border: {activeGradientStop ===
            i
              ? '4px solid blue'
              : '4px solid white'};"
            onmousedown={(e) => handleGradientPinMousedown(e, i)}
          ></div>
        {/each}
      </div>
    </div>
    <div class="mb-4">
      <div class="relative mb-2 h-4 w-full">
        <div class="absolute inset-0 overflow-hidden rounded-full">
          <canvas
            bind:this={hueCanvas}
            class="h-full w-full cursor-pointer"
            onmousedown={handleHueCanvasMousedown}
            onmouseup={handleHueCanvasMouseup}
            ontouchstart={(e) => handleTouchStart(e, "hue")}
            ontouchmove={(e) => handleTouchMove(e, "hue")}
            ontouchend={handleTouchEnd}
          ></canvas>
        </div>
        <div
          class="pin"
          style="left: {Math.max(
            0,
            Math.min(huePosition - 8, hueCanvas ? hueCanvas.width - 18 : 0)
          )}px; top: 50%; transform: translateY(-50%);"
        ></div>
      </div>
    </div>
    <div class="mb-4">
      <div class="relative mb-2 h-4 w-full">
        <div class="absolute inset-0 overflow-hidden rounded-full">
          <canvas
            bind:this={alphaCanvas}
            class="h-full w-full cursor-pointer"
            onmousedown={handleAlphaCanvasMousedown}
            onmouseup={handleAlphaCanvasMouseup}
            ontouchstart={(e) => handleTouchStart(e, "alpha")}
            ontouchmove={(e) => handleTouchMove(e, "alpha")}
            ontouchend={handleTouchEnd}
          ></canvas>
        </div>
        <div
          class="pin"
          style="left: {Math.max(
            0,
            Math.min(
              alphaPosition - 8,
              alphaCanvas ? alphaCanvas.width - 18 : 0
            )
          )}px; top: 50%; transform: translateY(-50%);"
        ></div>
      </div>
    </div>
    <div class="mt-3 grid grid-cols-2 gap-1 sm:grid-cols-6 sm:gap-2">
      <div class="col-span-2 flex flex-col">
        <input
          type="text"
          class="w-full rounded-md border border-gray-600 bg-transparent px-1.5 py-0.5 text-xs focus:outline-none"
          value={hexValue}
          oninput={(e) => {
            hexValue = (e.target as HTMLInputElement).value;
            updateFromHex();
          }}
        />
        <span class="mt-0.5 text-xs text-muted-foreground">HEX</span>
      </div>
      <div class="flex flex-col">
        <input
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          class="w-full rounded-md border border-gray-600 bg-transparent px-1.5 py-0.5 text-xs focus:outline-none"
          value={r}
          oninput={(e) => {
            handleRgbInput(
              "r",
              parseInt((e.target as HTMLInputElement).value) || 0
            );
          }}
        />
        <span class="mt-0.5 text-xs text-muted-foreground">R</span>
      </div>
      <div class="flex flex-col">
        <input
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          class="w-full rounded-md border border-gray-600 bg-transparent px-1.5 py-0.5 text-xs focus:outline-none"
          value={g}
          oninput={(e) => {
            handleRgbInput(
              "g",
              parseInt((e.target as HTMLInputElement).value) || 0
            );
          }}
        />
        <span class="mt-0.5 text-xs text-muted-foreground">G</span>
      </div>
      <div class="flex flex-col">
        <input
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          class="w-full rounded-md border border-gray-600 bg-transparent px-1.5 py-0.5 text-xs focus:outline-none"
          value={b}
          oninput={(e) => {
            handleRgbInput(
              "b",
              parseInt((e.target as HTMLInputElement).value) || 0
            );
          }}
        />
        <span class="mt-0.5 text-xs text-muted-foreground">B</span>
      </div>
      <div class="flex flex-col">
        <input
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          class="w-full rounded-md border border-gray-600 bg-transparent px-1.5 py-0.5 text-xs focus:outline-none"
          value={Math.round((a / 255) * 100)}
          oninput={(e) => {
            const alphaPct =
              parseInt((e.target as HTMLInputElement).value) || 0;
            const alphaVal = Math.round((alphaPct / 100) * 255);
            handleRgbInput("a", alphaVal);
          }}
        />
        <span class="mt-0.5 text-xs text-muted-foreground">A%</span>
      </div>
    </div>
  </div>
</div>

<style>
  .color-picker {
    position: relative;
    height: 200px;
    max-width: 100%;
  }
  @media (min-width: 640px) {
    .color-picker {
      height: 280px;
    }
  }
  .pin {
    position: absolute;
    width: 18px;
    height: 18px;
    border: 4px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    pointer-events: none;
    background: transparent;
    z-index: 10;
  }
  .gradient-pin {
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    z-index: 11;
    cursor: pointer;
  }
  @media (max-width: 639px) {
    input[type="text"] {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
    }
  }
  canvas {
    touch-action: none;
  }
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"] {
    appearance: textfield;
  }
</style>
