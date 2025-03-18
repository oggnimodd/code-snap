<script lang="ts">
  import CodeMirror from "svelte-codemirror-editor";
  import { javascript } from "@codemirror/lang-javascript";
  import { editorStore } from "$lib/stores/editor.svelte";
  import { EditorView, lineNumbers as cmLineNumbers } from "@codemirror/view";
  import { Compartment } from "@codemirror/state";
  import type { Extension } from "@codemirror/state";

  let value = $state("");
  let view: EditorView | null = $state(null);
  let currentTheme = $state<Extension | null>(null);
  const lineNumbersCompartment = new Compartment();

  // Theme cache - using Map to strongly type the keys and values
  const themeCache = $state(new Map<string, Extension>());

  // Dynamically import themes and handle typing properly
  async function getThemeExtension(
    themeName: string
  ): Promise<Extension | null> {
    // Return from cache if available
    if (themeCache.has(themeName)) {
      return themeCache.get(themeName)!;
    }

    try {
      // Dynamic import the themes package with proper typing
      const allThemes = await import("@uiw/codemirror-themes-all");

      console.log(allThemes);

      // Type assertion to allow indexing with string
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
      // Fallback to dracula theme if requested theme doesn't exist
      if (themeName !== "dracula") {
        console.warn(`Theme "${themeName}" not found, falling back to dracula`);
        return getThemeExtension("dracula");
      }

      // If even dracula fails, return null
      console.error("Failed to load theme:", error);
      return null;
    }
  }

  // Initialize theme - use proper non-async $effect.pre
  $effect.pre(() => {
    loadTheme(editorStore.theme);
  });

  // Handle theme loading separately to avoid async $effect
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

  // Watch for theme changes from editorStore
  $effect(() => {
    loadTheme(editorStore.theme);
  });
</script>

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

<style>
  /* Remove background highlighting */
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
</style>
