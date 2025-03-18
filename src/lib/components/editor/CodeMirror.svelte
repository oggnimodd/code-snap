<script lang="ts">
  import CodeMirror from "svelte-codemirror-editor";
  import { javascript } from "@codemirror/lang-javascript";
  import { editorStore, fontStore } from "$lib/stores/editor.svelte";
  import { EditorView, lineNumbers as cmLineNumbers } from "@codemirror/view";
  import { Compartment } from "@codemirror/state";
  import type { Extension } from "@codemirror/state";
  import { FONT_FAMILY_OPTIONS } from "$lib/config";

  let value = $state("");
  let view: EditorView | null = $state(null);
  let currentTheme = $state<Extension | null>(null);
  const lineNumbersCompartment = new Compartment();
  const themeCache = $state(new Map<string, Extension>());

  async function getThemeExtension(
    themeName: string
  ): Promise<Extension | null> {
    if (themeCache.has(themeName)) {
      return themeCache.get(themeName)!;
    }
    try {
      const allThemes = await import("@uiw/codemirror-themes-all");
      const themeModule = allThemes as unknown as Record<
        string,
        Extension | undefined
      >;
      const theme = themeModule[themeName];
      if (!theme) {
        throw new Error(`Theme "${themeName}" not found in themes package`);
      }
      themeCache.set(themeName, theme);
      return theme;
    } catch (error) {
      if (themeName !== "dracula") {
        console.warn(`Theme "${themeName}" not found, falling back to dracula`);
        return getThemeExtension("dracula");
      }
      console.error("Failed to load theme:", error);
      return null;
    }
  }

  $effect.pre(() => {
    loadTheme(editorStore.theme);
  });

  function loadTheme(themeName: string) {
    getThemeExtension(themeName).then((theme) => {
      currentTheme = theme;
    });
  }

  let baseExtensions = $derived.by(() => [
    lineNumbersCompartment.of(
      editorStore.lineNumbers
        ? cmLineNumbers({
            formatNumber: (n: number) =>
              String(n + editorStore.lineNumberStart - 1),
          })
        : EditorView.theme({ ".cm-gutters": { display: "none" } })
    ),
  ]);

  $effect(() => {
    if (view) {
      view.dispatch({
        effects: lineNumbersCompartment.reconfigure(
          editorStore.lineNumbers
            ? cmLineNumbers({
                formatNumber: (n: number) =>
                  String(n + editorStore.lineNumberStart - 1),
              })
            : EditorView.theme({ ".cm-gutters": { display: "none" } })
        ),
      });
    }
  });

  $effect(() => {
    loadTheme(editorStore.theme);
  });

  // Compute the correct font family string using the label from FONT_FAMILY_OPTIONS
  let computedFontFamily = $derived.by(() => {
    const option = FONT_FAMILY_OPTIONS.find(
      (opt) => opt.value === fontStore.family
    );
    return option
      ? `"${option.label}", monospace`
      : `"IBM Plex Mono", monospace`;
  });

  // Map the fontStore.weight to a numeric value so CSS receives a valid weight.
  let computedFontWeight = $derived.by(() => {
    const mapping: Record<string, string> = {
      regular: "400",
      medium: "500",
      bold: "700",
      light: "300",
    };
    return mapping[fontStore.weight] || "400";
  });
</script>

<div
  style="--editor-font-family: {computedFontFamily}; --editor-font-weight: {computedFontWeight}; 
  --editor-font-feature-settings: {fontStore.ligatures
    ? '\"liga\" 1, \"clig\" 1, \"calt\" 1'
    : '\"liga\" 0, \"clig\" 0, \"calt\" 0'}; 
  --editor-font-variant-ligatures: {fontStore.ligatures
    ? 'common-ligatures'
    : 'none'}"
>
  <CodeMirror
    class="w-auto"
    on:ready={(e) => {
      view = e.detail;
    }}
    bind:value
    lang={javascript()}
    extensions={baseExtensions}
    theme={currentTheme}
  />
</div>

<style>
  :global(.cm-activeLine),
  :global(.cm-activeLineGutter) {
    @apply bg-transparent !important;
  }
  :global(.cm-activeLineGutter) {
    @apply text-inherit !important;
  }
  :global(.cm-gutters) {
    @apply border-r-0 bg-transparent !important;
  }
  :global(.cm-editor) {
    @apply rounded-xl px-4 py-3 text-lg;
  }
  :global(.cm-content) {
    font-family: var(
      --editor-font-family,
      "IBM Plex Mono, monospace"
    ) !important;
    font-weight: var(--editor-font-weight, normal) !important;
    font-feature-settings: var(
      --editor-font-feature-settings,
      normal
    ) !important;
    font-variant-ligatures: var(
      --editor-font-variant-ligatures,
      normal
    ) !important;
  }
</style>
