<script lang="ts">
  import AppSidebar from "$lib/components/sidebar/app-sidebar.svelte";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import Editor from "$lib/components/editor/Editor.svelte";
  import { exportToPng } from "$lib/utils/export-image";
  import { loadFonts } from "$lib/utils/fonts";
  import { onMount } from "svelte";

  onMount(() => {
    loadFonts();
  });
</script>

<Sidebar.Provider>
  <AppSidebar />
  <Sidebar.Inset class="flex h-full flex-col">
    <header class="flex h-16 w-full shrink-0 items-center gap-2 border-b px-4">
      <Sidebar.Trigger class="-ml-1" />
      <Button onclick={exportToPng} class="ml-auto">Export</Button>
    </header>
    <div class="relative flex-1 overflow-hidden">
      <div
        class="absolute inset-0 flex items-center justify-center overflow-auto"
      >
        <Editor />
      </div>
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>
