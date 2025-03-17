<script lang="ts">
  import { editorStore } from "$lib/stores/editor.svelte";
  import * as Select from "$lib/components/ui/select/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import LabeledRow from "./LabeledRow.svelte";

  // Language options (value is the actual stored string)
  const LANGUAGE_OPTIONS = [
    { label: "Javascript", value: "javascript" },
    { label: "Typescript", value: "typescript" },
    { label: "Css", value: "css" },
    { label: "Html", value: "html" },
    { label: "C", value: "c" },
    { label: "C#", value: "csharp" },
    { label: "C++", value: "cpp" },
    { label: "Dart", value: "dart" },
    { label: "Dockerfile", value: "dockerfile" },
    { label: "Go", value: "go" },
    { label: "Java", value: "java" },
    { label: "JSON", value: "json" },
    { label: "Kotlin", value: "kotlin" },
    { label: "Less", value: "less" },
    { label: "Markdown", value: "markdown" },
    { label: "Pascal", value: "pascal" },
    { label: "PHP", value: "php" },
    { label: "Plain Text", value: "plaintext" },
    { label: "Protobuf", value: "protobuf" },
    { label: "Python", value: "python" },
    { label: "Ruby", value: "ruby" },
    { label: "Rust", value: "rust" },
    { label: "Scala", value: "scala" },
    { label: "Scss", value: "scss" },
    { label: "Shell", value: "shell" },
    { label: "SQL", value: "sql" },
    { label: "Swift", value: "swift" },
    { label: "Visual Basic", value: "vb" },
    { label: "XML", value: "xml" },
    { label: "Yaml", value: "yaml" },
  ];

  // Theme options (value is the actual stored string)
  const THEME_OPTIONS = [
    { label: "Fleet Dark", value: "fleet-dark" },
    { label: "VSCode Dark", value: "vscode-dark" },
    { label: "XCode Dark", value: "xcode-dark" },
    { label: "Night Owl", value: "night-owl" },
    { label: "GitHub Dark", value: "github-dark" },
    { label: "GitHub Dark Dimmed", value: "github-dark-dimmed" },
    { label: "Dracula", value: "dracula" },
    { label: "XCode Light", value: "xcode-light" },
    { label: "Material Ocean", value: "material-ocean" },
    { label: "Synthwave '84", value: "synthwave-84" },
    { label: "Poimandres", value: "poimandres" },
    { label: "Material Volcano", value: "material-volcano" },
    { label: "One dark", value: "one-dark" },
    { label: "Panda", value: "panda" },
    { label: "Aura Dark", value: "aura-dark" },
    { label: "One light", value: "one-light" },
    { label: "Material Palenight", value: "material-palenight" },
    { label: "GitHub Light", value: "github-light" },
    { label: "Moonlight", value: "moonlight" },
    { label: "Vitesse Dark", value: "vitesse-dark" },
    { label: "Duotone Sea", value: "duotone-sea" },
    { label: "Duotone Dark", value: "duotone-dark" },
    { label: "Shades Of Purple", value: "shades-of-purple" },
    { label: "Coldark Cold", value: "coldark-cold" },
    { label: "Coldark Dark", value: "coldark-dark" },
    { label: "Material Light", value: "material-light" },
  ];

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
        <Input type="number" bind:value={lineNumberStart} />
      </LabeledRow>
    {/if}
  </div>
</div>
