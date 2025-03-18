<script lang="ts">
  import { frameStore } from "$lib/stores/editor.svelte";
  const { children } = $props();
</script>

<div class="relative" style="border-radius: {frameStore.radius}px;">
  <!-- Checkered background layer (not exportable) -->
  <div
    class="bg-checkered absolute inset-0"
    style="border-radius: {frameStore.radius}px;"
  ></div>

  <!-- Exportable wrapper with background and content -->
  <div
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
</div>

<style>
  /* Darker checkered pattern */
  .bg-checkered {
    background-image: linear-gradient(45deg, #121212 25%, transparent 25%),
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
</style>
