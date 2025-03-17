<script lang="ts">
  import AppSidebar from "$lib/components/sidebar/app-sidebar.svelte";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<Sidebar.Provider>
  <AppSidebar />
  <Sidebar.Inset>
    <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <Sidebar.Trigger class="-ml-1" />
      <Button class="ml-auto">Export</Button>
    </header>
    <div class="flex flex-1 flex-col gap-4 p-4">
      <div class="grid auto-rows-min gap-4 md:grid-cols-3">
        <div class="aspect-video rounded-xl bg-muted/50"></div>
        <div class="aspect-video rounded-xl bg-muted/50"></div>
        <div class="aspect-video rounded-xl bg-muted/50"></div>
      </div>
      <div
        class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"
      ></div>
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>
