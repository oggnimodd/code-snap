<script lang="ts">
  import ColorPicker, { type ColorPickerProps } from "../color-picker.svelte";

  let { initialColor, value, onchange }: ColorPickerProps = $props();
</script>

<ColorPicker bind:value {initialColor} {onchange} />
