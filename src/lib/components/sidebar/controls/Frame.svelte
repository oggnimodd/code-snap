<script lang="ts">
  import { frameStore } from "$lib/stores/editor.svelte";
  import * as Select from "$lib/components/ui/select/index.js";
  import { Slider } from "$lib/components/ui/slider/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";
  import LabeledRow from "./LabeledRow.svelte";

  const FRAME_PADDING_OPTIONS = [
    { label: "16", value: "16" },
    { label: "32", value: "32" },
    { label: "64", value: "64" },
    { label: "128", value: "128" },
  ];

  const FRAME_RADIUS_OPTIONS = [
    { label: "0", value: "0" },
    { label: "8", value: "8" },
    { label: "16", value: "16" },
    { label: "24", value: "24" },
  ];

  const ASPECT_RATIO_OPTIONS = [
    { label: "Auto", value: "auto" },
    { label: "16:9", value: "16:9" },
    { label: "4:3", value: "4:3" },
    { label: "1:1", value: "1:1" },
  ];

  // Create reactive string states for padding and radius.
  let paddingStr = $state(frameStore.padding.toString());
  let radiusStr = $state(frameStore.radius.toString());

  // Synchronize the padding string with the store value.
  $effect(() => {
    const parsed = parseInt(paddingStr, 10);
    if (!isNaN(parsed) && parsed !== frameStore.padding) {
      frameStore.padding = parsed;
    }
  });

  $effect(() => {
    const storeValStr = frameStore.padding.toString();
    if (paddingStr !== storeValStr) {
      paddingStr = storeValStr;
    }
  });

  // Synchronize the radius string with the store value.
  $effect(() => {
    const parsed = parseInt(radiusStr, 10);
    if (!isNaN(parsed) && parsed !== frameStore.radius) {
      frameStore.radius = parsed;
    }
  });

  $effect(() => {
    const storeValStr = frameStore.radius.toString();
    if (radiusStr !== storeValStr) {
      radiusStr = storeValStr;
    }
  });
</script>

<div class="flex flex-col gap-4">
  <h2 class="font-semibold text-foreground">Frame Controls</h2>

  <div class="flex flex-col gap-4 px-2">
    <!-- Padding Control -->
    <LabeledRow label="Padding">
      <Select.Root
        name="frame-padding"
        bind:value={paddingStr}
        items={FRAME_PADDING_OPTIONS}
        type="single"
      >
        <Select.Trigger>{paddingStr}</Select.Trigger>
        <Select.Content>
          {#each FRAME_PADDING_OPTIONS as option}
            <Select.Item value={option.value}>{option.label}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </LabeledRow>

    <!-- Radius Control -->
    <LabeledRow label="Radius">
      <Select.Root
        name="frame-radius"
        bind:value={radiusStr}
        items={FRAME_RADIUS_OPTIONS}
        type="single"
      >
        <Select.Trigger>{radiusStr}</Select.Trigger>
        <Select.Content>
          {#each FRAME_RADIUS_OPTIONS as option}
            <Select.Item value={option.value}>{option.label}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </LabeledRow>

    <!-- Visible Control -->
    <LabeledRow label="Visible">
      <Switch bind:checked={frameStore.visible} />
    </LabeledRow>

    {#if frameStore.visible}
      <!-- Opacity Control -->
      <LabeledRow label="Opacity">
        <Slider
          type="single"
          min={0}
          max={1}
          step={0.01}
          bind:value={frameStore.opacity}
        />
      </LabeledRow>

      <!-- Aspect Ratio Control -->
      <LabeledRow label="Aspect Ratio">
        <Select.Root
          name="aspect-ratio"
          bind:value={frameStore.aspectRatio}
          items={ASPECT_RATIO_OPTIONS}
          type="single"
        >
          <Select.Trigger>{frameStore.aspectRatio}</Select.Trigger>
          <Select.Content>
            {#each ASPECT_RATIO_OPTIONS as option}
              <Select.Item value={option.value}>{option.label}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </LabeledRow>
    {/if}
  </div>
</div>
