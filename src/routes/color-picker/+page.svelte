<script lang="ts">
  import { ColorPicker } from "$lib/components/ui/color-picker";

  let selectedColor = $state("#122f63");
</script>

<div class="min-h-screen" style="background: {selectedColor};">
  Color : {selectedColor}
  <div class="flex flex-wrap gap-10">
    <div class="mx-auto w-4/5 w-72 py-20">
      <ColorPicker
        bind:value={selectedColor}
        initialColor={selectedColor}
        initialMode="solid"
      />
    </div>
    <div class="mx-auto w-4/5 w-72 py-20">
      <ColorPicker
        bind:value={selectedColor}
        initialColor={selectedColor}
        initialMode="solid"
      />
    </div>
  </div>
</div>
