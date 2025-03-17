<script lang="ts">
  import { ColorPicker } from "$lib/components/ui/color-picker";

  let selectedColor = $state("#122f63");
</script>

<div class="min-h-screen" style="background: {selectedColor};">
  Color : {selectedColor}
  <div class="mx-auto w-4/5 py-20 sm:w-72">
    <ColorPicker
      bind:value={selectedColor}
      initialColor={selectedColor}
      initialMode="solid"
    />
  </div>
  <div class="mx-auto w-4/5 py-20 sm:w-72">
    <ColorPicker
      bind:value={selectedColor}
      initialColor={selectedColor}
      initialMode="solid"
    />
  </div>
</div>
