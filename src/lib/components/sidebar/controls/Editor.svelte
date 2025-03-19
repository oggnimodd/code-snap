<script lang="ts">
  import { editorStore } from "$lib/stores/editor.svelte";
  import * as Select from "$lib/components/ui/select/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import LabeledRow from "./LabeledRow.svelte";
  import { THEME_OPTIONS } from "$lib/config";
  import { SUPPORTED_LANGUAGES } from "$lib/config/language-support";

  const formattedLanguages = SUPPORTED_LANGUAGES.map((lang) => ({
    label: lang.label,
    value: lang.id,
  }));
</script>

<div class="flex flex-col gap-4">
  <h2 class="font-semibold text-foreground">Editor Controls</h2>
  <div class="flex flex-col gap-4 px-2">
    <!-- Language Control -->
    <LabeledRow label="Language">
      <Select.Root
        name="editor-language"
        bind:value={editorStore.language}
        items={formattedLanguages}
        type="single"
      >
        <Select.Trigger>
          {#each formattedLanguages as option}
            {#if option.value === editorStore.language}
              {option.label}
            {/if}
          {/each}
        </Select.Trigger>
        <Select.Content>
          {#each formattedLanguages as option}
            <Select.Item value={option.value}>
              {option.label}
            </Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </LabeledRow>
    <!-- Theme Control -->
    <LabeledRow label="Theme">
      <Select.Root
        name="editor-theme"
        bind:value={editorStore.theme}
        items={THEME_OPTIONS}
        type="single"
      >
        <Select.Trigger>
          {#each THEME_OPTIONS as option}
            {#if option.value === editorStore.theme}
              {option.label}
            {/if}
          {/each}
        </Select.Trigger>
        <Select.Content>
          {#each THEME_OPTIONS as option}
            <Select.Item value={option.value}>
              {option.label}
            </Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </LabeledRow>
    <!-- Line Numbers Control -->
    <LabeledRow label="Line Numbers">
      <Switch bind:checked={editorStore.lineNumbers} />
    </LabeledRow>
    <!-- Line Start Control (visible only if lineNumbers is true) -->
    {#if editorStore.lineNumbers}
      <LabeledRow label="Line Start">
        <Input min={1} type="number" bind:value={editorStore.lineNumberStart} />
      </LabeledRow>
    {/if}
  </div>
</div>
