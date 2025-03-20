<script lang="ts">
  import Button, { buttonVariants } from "../ui/button/button.svelte";
  import IconDice from "@tabler/icons-svelte/icons/dice";
  import IconCopy from "@tabler/icons-svelte/icons/copy";
  import IconAdjustments from "@tabler/icons-svelte/icons/adjustments";
  import IconExternalLink from "@tabler/icons-svelte/icons/external-link";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import { randomize } from "$lib/stores/editor.svelte";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import ExportConfig from "$lib/components/export-config/ExportConfig.svelte";
  import {
    copyImageToClipboard,
    generateImageFromSnippet,
    dataURLtoBlob,
  } from "$lib/utils/export-image";
  import { exportConfigStore } from "$lib/stores/editor.svelte";

  let isCopying = $state(false);
  let isOpening = $state(false);

  async function handleCopy() {
    isCopying = true;
    try {
      const dataUrl = await generateImageFromSnippet(exportConfigStore);
      if (!dataUrl) {
        throw new Error("Empty data URL");
      }
      const success = await copyImageToClipboard(dataUrl);
      if (!success) {
        throw new Error("Copy failed");
      }
    } catch (error) {
      console.error(error);
    } finally {
      isCopying = false;
    }
  }

  async function handleOpen() {
    isOpening = true;
    try {
      const dataUrl = await generateImageFromSnippet(exportConfigStore);
      if (!dataUrl) {
        throw new Error("Empty data URL");
      }
      // Convert dataURL to Blob
      const blob = dataURLtoBlob(dataUrl);
      // Create a blob URL
      const blobUrl = URL.createObjectURL(blob);
      // Open the blob URL in a new tab
      window.open(blobUrl, "_blank");
    } catch (error) {
      console.error(error);
    } finally {
      isOpening = false;
    }
  }
</script>

<div class="flex items-center justify-between gap-x-2 rounded-lg">
  <Popover.Root>
    <Popover.Trigger class={buttonVariants({ variant: "secondary" })}>
      <IconAdjustments />
    </Popover.Trigger>
    <Popover.Content>
      <ExportConfig />
    </Popover.Content>
  </Popover.Root>

  <Button onclick={randomize} variant="secondary">
    <IconDice />
    <span class="hidden sm:inline">Randomize</span>
  </Button>

  <Button onclick={handleCopy} variant="secondary" disabled={isCopying}>
    {#if isCopying}
      <LoaderCircle class="animate-spin" />
      <span class="hidden sm:inline">Copying...</span>
    {:else}
      <IconCopy />
      <span class="hidden sm:inline">Copy to clipboard</span>
    {/if}
  </Button>

  <Button onclick={handleOpen} variant="secondary" disabled={isOpening}>
    {#if isOpening}
      <LoaderCircle class="animate-spin" />
      <span class="hidden sm:inline">Opening...</span>
    {:else}
      <IconExternalLink />
      <span class="hidden sm:inline">Open</span>
    {/if}
  </Button>
</div>
