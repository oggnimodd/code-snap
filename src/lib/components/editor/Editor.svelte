<script lang="ts">
  import CodeMirror from "./CodeMirror.svelte";
  import Frame from "./Frame.svelte";
</script>

<div class="h-full w-full overflow-hidden">
  <div class="flex h-full w-full w-full overflow-auto">
    <div class="m-auto my-auto w-fit w-full p-20">
      <Frame>
        <CodeMirror />
      </Frame>
    </div>
  </div>
</div>
