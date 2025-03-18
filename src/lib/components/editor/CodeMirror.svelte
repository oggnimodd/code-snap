<script lang="ts">
  import CodeMirror from "svelte-codemirror-editor";
  import { javascript } from "@codemirror/lang-javascript";
  import { editorStore } from "$lib/stores/editor.svelte";
  import { EditorView, lineNumbers as cmLineNumbers } from "@codemirror/view";
  import { Compartment } from "@codemirror/state";

  let value = $state("");
  let view: EditorView | null = $state(null);

  const lineNumbersCompartment = new Compartment();

  let baseExtensions = $derived.by(() => {
    return [
      lineNumbersCompartment.of(
        editorStore.lineNumbers
          ? cmLineNumbers({
              formatNumber: (n: number) =>
                String(n + editorStore.lineNumberStart - 1),
            })
          : EditorView.theme({ ".cm-gutters": { display: "none" } })
      ),
    ];
  });

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
    if (view) {
      console.log(view);
    }
  });
</script>

<CodeMirror
  on:ready={(e) => {
    view = e.detail;
  }}
  bind:value
  lang={javascript()}
  extensions={baseExtensions}
/>
