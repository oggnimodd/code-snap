<script lang="ts">
  import { windowStore } from "$lib/stores/editor.svelte";
  import * as Select from "$lib/components/ui/select/index.js";
  import LabeledRow from "./LabeledRow.svelte";
  import { getActiveLabel } from "$lib/utils/select";
  import Switch from "$lib/components/ui/switch/switch.svelte";

  // Shadow options
  const SHADOW_OPTIONS = [
    { label: "None", value: "none" },
    { label: "Small", value: "small" },
    { label: "Medium", value: "medium" },
    { label: "Large", value: "large" },
  ];

  // Border options
  const BORDER_OPTIONS = [
    { label: "None", value: "none" },
    { label: "Thin", value: "thin" },
    { label: "Normal", value: "normal" },
    { label: "Thick", value: "thick" },
  ];

  // Create reactive string states for shadow and border
  let shadowStr = $state(windowStore.shadow);
  let borderStr = $state(windowStore.border);

  // Synchronize the shadow string with the store value
  $effect(() => {
    if (shadowStr !== windowStore.shadow) {
      windowStore.shadow = shadowStr;
    }
  });

  $effect(() => {
    if (shadowStr !== windowStore.shadow) {
      shadowStr = windowStore.shadow;
    }
  });

  // Synchronize the border string with the store value
  $effect(() => {
    if (borderStr !== windowStore.border) {
      windowStore.border = borderStr;
    }
  });

  $effect(() => {
    if (borderStr !== windowStore.border) {
      borderStr = windowStore.border;
    }
  });
</script>

<div class="flex flex-col gap-4">
  <h2 class="font-semibold text-foreground">Window Controls</h2>

  <div class="flex flex-col gap-4 px-2">
    <!-- Shadow Control -->
    <LabeledRow label="Shadow">
      <Select.Root
        name="window-shadow"
        bind:value={shadowStr}
        items={SHADOW_OPTIONS}
        type="single"
      >
        <Select.Trigger
          >{getActiveLabel(shadowStr, SHADOW_OPTIONS)}</Select.Trigger
        >
        <Select.Content>
          {#each SHADOW_OPTIONS as option}
            <Select.Item value={option.value}>{option.label}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </LabeledRow>

    <!-- Border Control -->
    <LabeledRow label="Border">
      <Select.Root
        name="window-border"
        bind:value={borderStr}
        items={BORDER_OPTIONS}
        type="single"
      >
        <Select.Trigger>
          {getActiveLabel(borderStr, BORDER_OPTIONS)}
        </Select.Trigger>
        <Select.Content>
          {#each BORDER_OPTIONS as option}
            <Select.Item value={option.value}>{option.label}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </LabeledRow>

    <!-- Reflection Control -->
    <LabeledRow label="Reflection">
      <Switch bind:checked={windowStore.reflection} />
    </LabeledRow>
  </div>
</div>
