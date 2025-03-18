<script lang="ts">
  import { fontStore } from "$lib/stores/editor.svelte";
  import * as Select from "$lib/components/ui/select/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";
  import LabeledRow from "./LabeledRow.svelte";
  import { FONT_FAMILY_OPTIONS, FONT_WEIGHT_OPTIONS } from "$lib/config";

  // Local reactive copies
  let family = $state(fontStore.family);
  let weight = $state(fontStore.weight);
  let ligatures = $state(fontStore.ligatures);

  // Sync family
  $effect(() => {
    if (family !== fontStore.family) {
      fontStore.family = family;
    }
  });
  $effect(() => {
    if (family !== fontStore.family) {
      family = fontStore.family;
    }
  });

  // Sync weight
  $effect(() => {
    if (weight !== fontStore.weight) {
      fontStore.weight = weight;
    }
  });
  $effect(() => {
    if (weight !== fontStore.weight) {
      weight = fontStore.weight;
    }
  });

  // Sync ligatures
  $effect(() => {
    if (ligatures !== fontStore.ligatures) {
      fontStore.ligatures = ligatures;
    }
  });
  $effect(() => {
    if (ligatures !== fontStore.ligatures) {
      ligatures = fontStore.ligatures;
    }
  });
</script>

<div class="flex flex-col gap-4">
  <h2 class="font-semibold text-foreground">Font Controls</h2>
  <div class="flex flex-col gap-4 px-2">
    <!-- Font Family Control -->
    <LabeledRow label="Font">
      <Select.Root
        name="font-family"
        bind:value={family}
        items={FONT_FAMILY_OPTIONS}
        type="single"
      >
        <Select.Trigger>
          {#each FONT_FAMILY_OPTIONS as option}
            {#if option.value === family}{option.label}{/if}
          {/each}
        </Select.Trigger>
        <Select.Content>
          {#each FONT_FAMILY_OPTIONS as option}
            <Select.Item value={option.value}>{option.label}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </LabeledRow>

    <!-- Font Weight Control -->
    <LabeledRow label="Font weight">
      <Select.Root
        name="font-weight"
        bind:value={weight}
        items={FONT_WEIGHT_OPTIONS}
        type="single"
      >
        <Select.Trigger>
          {#each FONT_WEIGHT_OPTIONS as option}
            {#if option.value === weight}{option.label}{/if}
          {/each}
        </Select.Trigger>
        <Select.Content>
          {#each FONT_WEIGHT_OPTIONS as option}
            <Select.Item value={option.value}>{option.label}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </LabeledRow>

    <!-- Ligatures Control -->
    <LabeledRow label="Ligatures">
      <Switch bind:checked={ligatures} />
    </LabeledRow>
  </div>
</div>
