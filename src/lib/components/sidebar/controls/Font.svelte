<script lang="ts">
  import { fontStore } from "$lib/stores/editor.svelte";
  import * as Select from "$lib/components/ui/select/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";
  import LabeledRow from "./LabeledRow.svelte";
  import { FONT_FAMILY_OPTIONS, FONT_WEIGHT_OPTIONS } from "$lib/config";
</script>

<div class="flex flex-col gap-4">
  <h2 class="font-semibold text-foreground">Font</h2>
  <div class="flex flex-col gap-4 px-2">
    <!-- Font Family Control -->
    <LabeledRow label="Font">
      <Select.Root
        name="font-family"
        bind:value={fontStore.family}
        items={FONT_FAMILY_OPTIONS}
        type="single"
      >
        <Select.Trigger>
          {#each FONT_FAMILY_OPTIONS as option}
            {#if option.value === fontStore.family}
              <span
                class="text-left"
                style="font-family: '{option.label}', monospace;"
              >
                {option.label}
              </span>
            {/if}
          {/each}
        </Select.Trigger>
        <Select.Content>
          {#each FONT_FAMILY_OPTIONS as option}
            <Select.Item value={option.value}>
              <span
                class="text-left"
                style="font-family: '{option.label}', monospace;"
              >
                {option.label}
              </span>
            </Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </LabeledRow>

    <!-- Font Weight Control -->
    <LabeledRow label="Font weight">
      <Select.Root
        name="font-weight"
        bind:value={fontStore.weight}
        items={FONT_WEIGHT_OPTIONS}
        type="single"
      >
        <Select.Trigger>
          {#each FONT_WEIGHT_OPTIONS as option}
            {#if option.value === fontStore.weight}
              {option.label}
            {/if}
          {/each}
        </Select.Trigger>
        <Select.Content>
          {#each FONT_WEIGHT_OPTIONS as option}
            <Select.Item value={option.value}>
              {option.label}
            </Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </LabeledRow>

    <!-- Ligatures Control -->
    <LabeledRow label="Ligatures">
      <Switch bind:checked={fontStore.ligatures} />
    </LabeledRow>
  </div>
</div>
