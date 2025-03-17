<script lang="ts">
  import { hexToRgb, rgbToHsv, hsvToRgb, rgbToHex } from "./utils";

  interface ColorPickerProps {
    value: string;
    initialColor?: string;
    onchange?: (color: string) => void;
    showColorPreviewBox?: boolean;
  }

  let {
    value = $bindable(),
    initialColor = "#000000",
    onchange,
    showColorPreviewBox = true,
  }: ColorPickerProps = $props();

  let color = $state(initialColor);
  let h = $state(0);
  let s = $state(100);
  let v = $state(100);
  let a = $state(255);
  let r = $state(0);
  let g = $state(0);
  let b = $state(0);
  let hexValue = $state(initialColor);

  let colorCanvas = $state<HTMLCanvasElement | null>(null);
  let hueCanvas = $state<HTMLCanvasElement | null>(null);
  let alphaCanvas = $state<HTMLCanvasElement | null>(null);

  let isDragging = $state(false);
  let isDraggingHue = $state(false);
  let isDraggingAlpha = $state(false);

  let pointer = $state({ x: 0, y: 0 });
  let huePosition = $state(0);
  let alphaPosition = $state(0);
  let colorRect: DOMRect | null = null;
  let inited = false;
  let containerEl = $state<HTMLDivElement | null>(null);

  $effect(() => {
    if (!inited && initialColor) {
      inited = true;
      const rgb = hexToRgb(initialColor);
      if (rgb) {
        const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
        h = hsv.h;
        s = hsv.s;
        v = hsv.v;
        a = rgb.a ?? 255;
        r = rgb.r;
        g = rgb.g;
        b = rgb.b;
        hexValue = initialColor;
        updateColorValue();
        updatePointerFromHsv();
        if (hueCanvas) huePosition = (h / 360) * hueCanvas.width;
        if (alphaCanvas) alphaPosition = (a / 255) * alphaCanvas.width;
      }
    }
  });

  function updateColorCanvas() {
    if (!colorCanvas) return;
    const ctx = colorCanvas.getContext("2d");
    if (!ctx) return;
    const w = colorCanvas.width,
      hVal = colorCanvas.height;
    ctx.clearRect(0, 0, w, hVal);
    ctx.fillStyle = `hsl(${h}, 100%, 50%)`;
    ctx.fillRect(0, 0, w, hVal);
    const whiteGrad = ctx.createLinearGradient(0, 0, w, 0);
    whiteGrad.addColorStop(0, "rgba(255,255,255,1)");
    whiteGrad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = whiteGrad;
    ctx.fillRect(0, 0, w, hVal);
    const blackGrad = ctx.createLinearGradient(0, 0, 0, hVal);
    blackGrad.addColorStop(0, "rgba(0,0,0,0)");
    blackGrad.addColorStop(1, "rgba(0,0,0,1)");
    ctx.fillStyle = blackGrad;
    ctx.fillRect(0, 0, w, hVal);
  }

  function updateHueCanvas() {
    if (!hueCanvas) return;
    const ctx = hueCanvas.getContext("2d");
    if (!ctx) return;
    const w = hueCanvas.width,
      hVal = hueCanvas.height;
    ctx.clearRect(0, 0, w, hVal);
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, "#ff0000");
    grad.addColorStop(0.17, "#ffff00");
    grad.addColorStop(0.33, "#00ff00");
    grad.addColorStop(0.5, "#00ffff");
    grad.addColorStop(0.67, "#0000ff");
    grad.addColorStop(0.83, "#ff00ff");
    grad.addColorStop(1, "#ff0000");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, hVal);
  }

  function updateAlphaCanvas() {
    if (!alphaCanvas) return;
    const ctx = alphaCanvas.getContext("2d");
    if (!ctx) return;
    const w = alphaCanvas.width,
      hVal = alphaCanvas.height;
    ctx.clearRect(0, 0, w, hVal);
    const square = 8;
    for (let i = 0; i < w; i += square * 2) {
      for (let j = 0; j < hVal; j += square * 2) {
        ctx.fillStyle = "#ccc";
        ctx.fillRect(i, j, square, square);
        ctx.fillRect(i + square, j + square, square, square);
      }
    }
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
    grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 1)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, hVal);
  }

  function updateColorValue() {
    const rgb = hsvToRgb(h, s, v);
    r = rgb.r;
    g = rgb.g;
    b = rgb.b;
    hexValue = rgbToHex(r, g, b, a);
    color = hexValue;
    value = hexValue;
    if (onchange) onchange(value);
    updateAlphaCanvas();
  }

  function updateFromRgb() {
    const hsv = rgbToHsv(r, g, b);
    h = hsv.h;
    s = hsv.s;
    v = hsv.v;
    hexValue = rgbToHex(r, g, b, a);
    color = hexValue;
    value = color;
    if (onchange) onchange(color);
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
    pointer.y = (1 - v / 100) * colorCanvas.height;
  }

  function updateHsvFromPointer() {
    if (!colorCanvas) return;
    s = Math.max(0, Math.min(100, (pointer.x / colorCanvas.width) * 100));
    v = Math.max(
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
      colorRect = null;
    };
    const handleGlobalMousemove = (e: MouseEvent) => {
      if (isDragging) handleColorCanvasMousemove(e);
      if (isDraggingHue) handleHueCanvasMousemove(e);
      if (isDraggingAlpha) handleAlphaCanvasMousemove(e);
    };
    document.addEventListener("mouseup", handleGlobalMouseup);
    document.addEventListener("mousemove", handleGlobalMousemove);
    return () => {
      document.removeEventListener("mouseup", handleGlobalMouseup);
      document.removeEventListener("mousemove", handleGlobalMousemove);
    };
  });

  $effect(() => {
    if (value !== color) {
      hexValue = value;
      updateFromHex();
      color = value;
    }
  });

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
    {#if showColorPreviewBox}
      <div class="mb-2 flex justify-end">
        <div
          class="h-6 w-6 rounded border border-gray-300 dark:border-gray-600"
          style="background: {color};"
        ></div>
      </div>
    {/if}
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
