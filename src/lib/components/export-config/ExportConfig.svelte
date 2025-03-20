<script lang="ts">
  import {
    exportConfigStore,
    type ExportConfig,
  } from "$lib/stores/editor.svelte";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import { EXPORT_SCALE_OPTIONS, EXPORT_TYPE_OPTIONS } from "$lib/config";
  import Label from "../ui/label/label.svelte";
  import Button from "../ui/button/button.svelte";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import {
    downloadDataUrlAsImage,
    generateImageFromSnippet,
  } from "$lib/utils/export-image";
  import { toast } from "svelte-sonner";

  interface ExportConfigProps {
    showDownloadButton?: boolean;
  }

  let isExporting = $state(false);
  let { showDownloadButton = false }: ExportConfigProps = $props();

  const downloadImage = async () => {
    isExporting = true;
    try {
      const dataUrl = await generateImageFromSnippet(exportConfigStore);

      if (!dataUrl) {
        throw new Error("Data URL is empty");
      }

      downloadDataUrlAsImage(dataUrl, exportConfigStore);
    } catch (error) {
      toast.error("Image generation failed");
    } finally {
      isExporting = false;
    }
  };
</script>

<div class="flex flex-col">
  <span class="mb-4 flex text-lg font-medium">Export Settings</span>
  <div class="mb-4">
    <Label class="mb-2 flex text-sm">Image Type</Label>
    <Tabs.Root
      value={exportConfigStore.type}
      class="w-full"
      onValueChange={(value) => {
        exportConfigStore.type = value as ExportConfig["type"];
      }}
    >
      <Tabs.List class="grid grid-cols-3">
        {#each EXPORT_TYPE_OPTIONS as option}
          <Tabs.Trigger value={option.value}>{option.label}</Tabs.Trigger>
        {/each}
      </Tabs.List>
    </Tabs.Root>
  </div>

  <!-- Scale Control -->
  <div class="mb-4">
    <Label class="mb-2 flex text-sm">Scale</Label>
    <Tabs.Root
      value={String(exportConfigStore.scale)}
      class="w-full"
      onValueChange={(value) => {
        exportConfigStore.scale = parseInt(value, 10) as ExportConfig["scale"];
      }}
    >
      <Tabs.List class="grid grid-cols-4">
        {#each EXPORT_SCALE_OPTIONS as option}
          <Tabs.Trigger value={String(option.value)}
            >{option.label}</Tabs.Trigger
          >
        {/each}
      </Tabs.List>
    </Tabs.Root>
  </div>

  {#if showDownloadButton}
    <Button disabled={isExporting} onclick={downloadImage} class="ml-auto">
      {#if isExporting}
        <div class="flex items-center gap-2">
          <LoaderCircle class="animate-spin" />
          <span>Exporting...</span>
        </div>
      {:else}
        <span>Download</span>
      {/if}
    </Button>
  {/if}
</div>
