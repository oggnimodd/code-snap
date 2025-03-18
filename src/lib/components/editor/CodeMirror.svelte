<script lang="ts">
  import CodeMirror from "svelte-codemirror-editor";
  import { javascript } from "@codemirror/lang-javascript";

  let value = $state("");
</script>

<CodeMirror bind:value lang={javascript()} />
