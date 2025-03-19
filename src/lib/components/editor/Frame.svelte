<script lang="ts">
  import { frameStore } from "$lib/stores/editor.svelte";
  const { children } = $props();
  let exportableRef: HTMLElement | null = $state(null);
  let isResizing = $state(false);
  let startX: number = $state(0);
  let startWidth: number = $state(0);
  let currentWidth: number = $state(0);

  // Tracks which edge handle was touched: "start" (left) or "end" (right)
  let activeEdge: "start" | "end" | null = $state(null);
  function handleMouseMove(event: MouseEvent) {
    if (!isResizing || !activeEdge || !exportableRef) return;
    const delta = event.clientX - startX;
    // For left handle, invert delta; for right handle, use delta as is
    const effectiveDelta = activeEdge === "start" ? -delta : delta;
    const newWidth = startWidth + effectiveDelta;
    // Enforce a minimum width of 50px
    if (newWidth < 50) return;
    exportableRef.style.minWidth = newWidth + "px";
  }

  function handleMouseDown(options: {
    event: MouseEvent;
    edge: "start" | "end";
  }) {
    const { event, edge } = options;
    isResizing = true;
    activeEdge = edge;
    startX = event.clientX;
    startWidth = exportableRef
      ? exportableRef.getBoundingClientRect().width
      : 0;
    currentWidth = startWidth;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }

  function handleMouseUp() {
    isResizing = false;
    activeEdge = null;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }
</script>

<div class="flex justify-center" style="width: 100%;">
  <div
    class="relative inline-block"
    style="border-radius: {frameStore.radius}px;"
  >
    <!-- Resize handles -->
    <button
      aria-label="Resize start"
      class="resize-handle left-handle"
      onmousedown={(event) => handleMouseDown({ event, edge: "start" })}
    ></button>
    <button
      aria-label="Resize end"
      class="resize-handle right-handle"
      onmousedown={(event) => handleMouseDown({ event, edge: "end" })}
    ></button>
    <!-- Checkered background layer (not exportable) -->
    <div
      class="bg-checkered absolute inset-0"
      style="border-radius: {frameStore.radius}px;"
    ></div>
    <!-- Exportable wrapper with background and content -->
    <div
      bind:this={exportableRef}
      bind:clientWidth={currentWidth}
      id="exportable-content"
      class="relative"
      style="border-radius: {frameStore.radius}px;"
    >
      <!-- Actual background with opacity -->
      <div
        class="absolute inset-0"
        style="
           background: {frameStore.background.value};
           opacity: {frameStore.visible ? frameStore.opacity : 0};
           border-radius: {frameStore.radius}px;
         "
      ></div>
      <!-- Content with smooth transition for dimensions -->
      <div
        class="relative z-10 transition-all duration-300 ease-in-out"
        style="padding: {frameStore.padding}px; border-radius: {frameStore.radius}px;"
      >
        {@render children()}
      </div>
    </div>

    <!-- Width counter - only visible when resizing -->
    {#if isResizing}
      <div
        class="width-counter absolute -bottom-20 flex h-8 w-full items-center justify-between"
      >
        <div class="flex h-full w-[40%] items-center">
          <div class="h-full w-[2px] bg-white/60"></div>
          <div class="h-[2px] w-full bg-white/60"></div>
        </div>

        <div
          class="w-[20%] min-w-[5rem] px-4 text-center text-sm font-semibold"
        >
          {Math.round(currentWidth)} px
        </div>

        <div class="flex h-full w-[40%] items-center">
          <div class="h-[2px] w-full bg-white/60"></div>
          <div class="h-full w-[2px] bg-white/60"></div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .bg-checkered {
    background-image:
      linear-gradient(45deg, #121212 25%, transparent 25%),
      linear-gradient(-45deg, #121212 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #121212 75%),
      linear-gradient(-45deg, transparent 75%, #121212 75%);
    background-size: 20px 20px;
    background-position:
      0 0,
      0 10px,
      10px -10px,
      -10px 0px;
    background-color: #1e1e1e;
  }
  .resize-handle {
    position: absolute;
    top: 50%;
    width: 12px;
    height: 12px;
    background: #fff;
    border-radius: 50%;
    cursor: ew-resize;
    z-index: 20;
    transform-origin: center;
    transform: translateY(-50%);
    transition: transform 0.3s ease-in-out;
  }
  .resize-handle:hover {
    transform: translateY(-50%) scale(1.8);
  }
  .left-handle {
    left: -6px;
  }
  .right-handle {
    right: -6px;
  }
  /* Slide in animation for the width counter container */
  .width-counter {
    animation: slideIn 0.4s ease-out forwards;
  }

  @keyframes slideIn {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
</style>
