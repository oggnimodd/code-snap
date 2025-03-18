<script lang="ts">
  import { frameStore } from "$lib/stores/editor.svelte";
  const { children } = $props();
</script>

<div
  style="
  background: {frameStore.background.value}; 
  padding: {frameStore.padding}px;
  border-radius: {frameStore.radius}px;
  "
>
  {@render children()}
</div>
