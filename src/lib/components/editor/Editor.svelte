<script lang="ts">
  import ActionBar from "../action-bar/ActionBar.svelte";
  import CodeMirror from "./CodeMirror.svelte";
  import Frame from "./Frame.svelte";
</script>

<div class="h-full w-full overflow-hidden">
  <div class="flex h-full w-full w-full overflow-auto">
    <div class="m-auto my-auto w-fit p-20">
      <Frame>
        <CodeMirror />
      </Frame>

      <div class="absolute bottom-4 left-1/2 z-[99999] -translate-x-1/2">
        <ActionBar />
      </div>
    </div>
  </div>
</div>
