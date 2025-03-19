<script lang="ts">
  import { frameStore } from "$lib/stores/editor.svelte";
  import * as Select from "$lib/components/ui/select/index.js";
  import { Slider } from "$lib/components/ui/slider/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";
  import BackgroundControl from "./BackgroundControl.svelte";
  import LabeledRow from "./LabeledRow.svelte";
  import { FRAME_PADDING_OPTIONS, FRAME_RADIUS_OPTIONS } from "$lib/config";

  // Local reactive string states for numeric values (for use with select options)
  let paddingStr = $state(frameStore.padding.toString());
  let radiusStr = $state(frameStore.radius.toString());

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
            <Select.Item value={option.value}>
              {option.label}
            </Select.Item>
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
            <Select.Item value={option.value}>
              {option.label}
            </Select.Item>
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
      <!-- Background Control -->
      <LabeledRow label="Background">
        <BackgroundControl
          type={frameStore.background.type}
          value={frameStore.background.value}
          onChange={(value) => {
            frameStore.background = value;
          }}
        />
      </LabeledRow>
    {/if}
  </div>
</div>
