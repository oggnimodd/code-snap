<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import type { ComponentProps } from "svelte";

  import Frame from "$lib/components/sidebar/controls/Frame.svelte";
  import Window from "$lib/components/sidebar/controls/Window.svelte";
  import Editor from "$lib/components/sidebar/controls/Editor.svelte";
  import Font from "$lib/components/sidebar/controls/Font.svelte";

  let {
    ref = $bindable(null),
    ...restProps
  }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root {...restProps} bind:ref>
  <Sidebar.Header></Sidebar.Header>
  <Sidebar.Content>
    <div class="flex flex-col gap-10 p-4">
      <Frame />
      <Window />
      <Editor />
      <Font />
    </div>
  </Sidebar.Content>
  <Sidebar.Rail />
</Sidebar.Root>
