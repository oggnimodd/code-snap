<script lang="ts">
  import { editorStore } from "$lib/stores/editor.svelte";
  import * as Select from "$lib/components/ui/select/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import LabeledRow from "./LabeledRow.svelte";
  import { LANGUAGE_OPTIONS, THEME_OPTIONS } from "$lib/config";

  // Local reactive copies
  let languageStr = $state(editorStore.language);
  let themeStr = $state(editorStore.theme);
  let lineNumbers = $state(editorStore.lineNumbers);
  let lineNumberStart = $state(editorStore.lineNumberStart);

  // Sync language
  $effect(() => {
    if (languageStr !== editorStore.language) {
      editorStore.language = languageStr;
    }
  });
  $effect(() => {
    if (languageStr !== editorStore.language) {
      languageStr = editorStore.language;
    }
  });

  // Sync theme
  $effect(() => {
    if (themeStr !== editorStore.theme) {
      editorStore.theme = themeStr;
    }
  });
  $effect(() => {
    if (themeStr !== editorStore.theme) {
      themeStr = editorStore.theme;
    }
  });

  // Sync lineNumbers
  $effect(() => {
    if (lineNumbers !== editorStore.lineNumbers) {
      editorStore.lineNumbers = lineNumbers;
    }
  });
  $effect(() => {
    if (lineNumbers !== editorStore.lineNumbers) {
      lineNumbers = editorStore.lineNumbers;
    }
  });

  // Sync lineNumberStart
  $effect(() => {
    if (lineNumberStart <= 0) {
      lineNumberStart = 1; // Default to 1 if not positive
    }

    if (lineNumberStart !== editorStore.lineNumberStart) {
      editorStore.lineNumberStart = lineNumberStart;
    }
  });
  $effect(() => {
    if (lineNumberStart !== editorStore.lineNumberStart) {
      lineNumberStart = editorStore.lineNumberStart;
    }
  });
</script>

<div class="flex flex-col gap-4">
  <h2 class="font-semibold text-foreground">Editor Controls</h2>
  <div class="flex flex-col gap-4 px-2">
    <!-- Language Control -->
    <LabeledRow label="Language">
      <Select.Root
        name="editor-language"
        bind:value={languageStr}
        items={LANGUAGE_OPTIONS}
        type="single"
      >
        <Select.Trigger>
          {#each LANGUAGE_OPTIONS as option}
            {#if option.value === languageStr}{option.label}{/if}
          {/each}
        </Select.Trigger>
        <Select.Content>
          {#each LANGUAGE_OPTIONS as option}
            <Select.Item value={option.value}>{option.label}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </LabeledRow>

    <!-- Theme Control -->
    <LabeledRow label="Theme">
      <Select.Root
        name="editor-theme"
        bind:value={themeStr}
        items={THEME_OPTIONS}
        type="single"
      >
        <Select.Trigger>
          {#each THEME_OPTIONS as option}
            {#if option.value === themeStr}{option.label}{/if}
          {/each}
        </Select.Trigger>
        <Select.Content>
          {#each THEME_OPTIONS as option}
            <Select.Item value={option.value}>{option.label}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </LabeledRow>

    <!-- Line Numbers Control -->
    <LabeledRow label="Line Numbers">
      <Switch bind:checked={lineNumbers} />
    </LabeledRow>

    <!-- Line Start Control (hide unless lineNumbers is true) -->
    {#if lineNumbers}
      <LabeledRow label="Line Start">
        <Input min={1} type="number" bind:value={lineNumberStart} />
      </LabeledRow>
    {/if}
  </div>
</div>
