<script lang="ts">
  import CodeMirror from "svelte-codemirror-editor";
  import {
    editorStore,
    fontStore,
    windowStore,
  } from "$lib/stores/editor.svelte";
  import { EditorView, lineNumbers as cmLineNumbers } from "@codemirror/view";
  import { Compartment } from "@codemirror/state";
  import type { Extension } from "@codemirror/state";
  import { FONT_FAMILY_OPTIONS } from "$lib/config";
  import { SUPPORTED_LANGUAGES } from "$lib/config/language-support";
  import type { LanguageSupport } from "@codemirror/language";
  import { DEFAULT_EDITOR_CONTENT } from "$lib/config/editor";
  import type { Settings } from "@uiw/codemirror-themes";
  import { hexToRGBA } from "../ui/color-picker/utils";

  let value = $state(DEFAULT_EDITOR_CONTENT);
  let currentTheme = $state<Extension | null>(null);
  const lineNumbersCompartment = new Compartment();
  const themeCache = $state(new Map<string, Extension>());
  const themeDefaultSettingsCache = $state(new Map<string, Settings>());
  let backgroundColor = $state("");
  let backgroundColorWithOpacity = $state("");

  async function getThemeExtension(themeName: string): Promise<{
    theme: Extension | null;
    themeDefaultSettings: Settings;
  } | null> {
    if (themeCache.has(themeName) && themeDefaultSettingsCache.has(themeName)) {
      return {
        theme: themeCache.get(themeName)!,
        themeDefaultSettings: themeDefaultSettingsCache.get(themeName)!,
      };
    }
    try {
      const allThemes = await import("@uiw/codemirror-themes-all");
      const themeModule = allThemes as unknown as Record<
        string,
        Extension | undefined
      >;
      const theme = themeModule[themeName];

      const themeNameCapitalized =
        themeName.charAt(0).toUpperCase() + themeName.slice(1);

      const themeDefaultSettings = themeModule[
        `defaultSettings${themeNameCapitalized}`
      ] as Settings;

      if (!theme) {
        throw new Error(`Theme "${themeName}" not found in themes package`);
      }
      themeCache.set(themeName, theme);
      themeDefaultSettingsCache.set(themeName, themeDefaultSettings);
      return {
        theme,
        themeDefaultSettings: themeDefaultSettings,
      };
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
      const { theme: themeExtension, themeDefaultSettings: defaultSettings } =
        theme!;
      currentTheme = themeExtension;

      if (defaultSettings.background) {
        backgroundColor = defaultSettings.background;
        backgroundColorWithOpacity = hexToRGBA(
          defaultSettings.background,
          0.93
        );
      }
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
    if (editorStore.editorView) {
      editorStore.editorView.dispatch({
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

  let computedFontFamily = $derived.by(() => {
    const option = FONT_FAMILY_OPTIONS.find(
      (opt) => opt.value === fontStore.family
    );
    return option
      ? `"${option.label}", monospace`
      : `"IBM Plex Mono", monospace`;
  });

  let computedFontWeight = $derived.by(() => {
    const mapping: Record<string, string> = {
      regular: "400",
      medium: "500",
      bold: "700",
      light: "300",
    };
    return mapping[fontStore.weight] || "400";
  });

  let computedBoxShadow = $derived.by(() => {
    switch (windowStore.shadow) {
      case "none":
        return "none";
      case "small":
        return "0px 10px 20px rgba(0, 0, 0, 0.15), 0px 6px 10px rgba(0, 0, 0, 0.12)";
      case "medium":
        return "0px 20px 40px rgba(0, 0, 0, 0.2), 0px 10px 20px rgba(0, 0, 0, 0.15)";
      case "large":
        return "0px 40px 80px rgba(0, 0, 0, 0.25), 0px 20px 40px rgba(0, 0, 0, 0.2)";
      default:
        return "none";
    }
  });

  let computedBorder = $derived.by(() => {
    switch (windowStore.border) {
      case "none":
        return "none";
      case "thin":
        return "1px solid #ccc";
      case "normal":
        return "2px solid #ccc";
      case "thick":
        return "4px solid #ccc";
      default:
        return "none";
    }
  });

  function focusEditor() {
    if (editorStore.editorView) {
      editorStore.editorView.focus();
    }
  }

  let currentLangExtension = $state<LanguageSupport | null>(null);
  async function loadLanguage(languageId: string) {
    const langDef = SUPPORTED_LANGUAGES.find((lang) => lang.id === languageId);
    if (langDef) {
      currentLangExtension = (await langDef.plugin()) as LanguageSupport;
    }
  }
  $effect(() => {
    loadLanguage(editorStore.language);
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="relative overflow-hidden rounded-xl"
  onclick={focusEditor}
  style="
    --editor-background-color: {windowStore.transparency
    ? backgroundColorWithOpacity
    : backgroundColor};
    --editor-font-family: {computedFontFamily}; 
    --editor-font-weight: {computedFontWeight}; 
    --editor-font-feature-settings: {fontStore.ligatures
    ? '\"liga\" 1, \"clig\" 1, \"calt\" 1'
    : '\"liga\" 0, \"clig\" 0, \"calt\" 0'}; 
    --editor-font-variant-ligatures: {fontStore.ligatures
    ? 'common-ligatures'
    : 'none'};
    box-shadow: {computedBoxShadow};
    border: {computedBorder};
  "
>
  <CodeMirror
    class="w-auto"
    on:ready={(e) => {
      editorStore.editorView = e.detail;
      setTimeout(() => {
        editorStore.isReady = true;
      }, 400);
    }}
    bind:value
    lang={currentLangExtension}
    extensions={baseExtensions}
    theme={currentTheme}
  />

  {#if windowStore.reflection}
    <!-- Reflection overlay -->
    <div class="reflection"></div>
  {/if}
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
    font-family: var(
      --editor-font-family,
      "IBM Plex Mono, monospace"
    ) !important;
    @apply select-none border-r-0 bg-transparent !important;
  }
  :global(.cm-editor) {
    background: var(--editor-background-color);
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
  :global(.cm-gutter.cm-foldGutter) {
    visibility: hidden;
    pointer-events: none;
    user-select: none;
  }

  /* Reflection styles */
  .reflection {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 50%; /* Adjust the height as desired */
    transform: skewX(-18deg) translateX(-55%);
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.035) 35%,
      rgba(255, 255, 255, 0) 100%
    );
    pointer-events: none;
    /* Inherit rounded corners on the bottom */
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
    z-index: 100;
  }
</style>
