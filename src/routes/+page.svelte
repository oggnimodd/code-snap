<script lang="ts">
  import AppSidebar from "$lib/components/sidebar/app-sidebar.svelte";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import Editor from "$lib/components/editor/Editor.svelte";
  import { loadFonts } from "$lib/utils/fonts";
  import { onMount } from "svelte";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import ExportConfig from "$lib/components/export-config/ExportConfig.svelte";

  let showExportDialog = $state(false);

  const openExportDialog = () => {
    showExportDialog = true;
  };

  onMount(() => {
    loadFonts();
  });
</script>

<Dialog.Root
  open={showExportDialog}
  onOpenChange={(open) => (showExportDialog = open)}
>
  <Dialog.Content>
    <ExportConfig showDownloadButton />
  </Dialog.Content>
</Dialog.Root>

<Sidebar.Provider>
  <AppSidebar />
  <Sidebar.Inset class="flex h-full flex-col">
    <header class="flex h-16 w-full shrink-0 items-center gap-2 border-b px-4">
      <Sidebar.Trigger class="-ml-1" />
      <Button onclick={openExportDialog} class="ml-auto">Export</Button>
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
