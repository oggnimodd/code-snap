<script lang="ts">
  import { windowStore } from "$lib/stores/editor.svelte";
  import * as Select from "$lib/components/ui/select/index.js";
  import LabeledRow from "./LabeledRow.svelte";
  import { getActiveLabel } from "$lib/utils/select";
  import Switch from "$lib/components/ui/switch/switch.svelte";

  const SHADOW_OPTIONS = [
    { label: "None", value: "none" },
    { label: "Small", value: "small" },
    { label: "Medium", value: "medium" },
    { label: "Large", value: "large" },
  ];
  const BORDER_OPTIONS = [
    { label: "None", value: "none" },
    { label: "Thin", value: "thin" },
    { label: "Normal", value: "normal" },
    { label: "Thick", value: "thick" },
  ];
</script>

<div class="flex flex-col gap-4">
  <h2 class="font-semibold text-foreground">Window Controls</h2>
  <div class="flex flex-col gap-4 px-2">
    <!-- Shadow Control -->
    <LabeledRow label="Shadow">
      <Select.Root
        name="window-shadow"
        bind:value={windowStore.shadow}
        items={SHADOW_OPTIONS}
        type="single"
      >
        <Select.Trigger
          >{getActiveLabel(windowStore.shadow, SHADOW_OPTIONS)}</Select.Trigger
        >
        <Select.Content>
          {#each SHADOW_OPTIONS as option}
            <Select.Item value={option.value}>
              {option.label}
            </Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </LabeledRow>
    <!-- Border Control -->
    <LabeledRow label="Border">
      <Select.Root
        name="window-border"
        bind:value={windowStore.border}
        items={BORDER_OPTIONS}
        type="single"
      >
        <Select.Trigger
          >{getActiveLabel(windowStore.border, BORDER_OPTIONS)}</Select.Trigger
        >
        <Select.Content>
          {#each BORDER_OPTIONS as option}
            <Select.Item value={option.value}>
              {option.label}
            </Select.Item>
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
