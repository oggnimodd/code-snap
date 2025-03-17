<script lang="ts">
  import * as Popover from "$lib/components/ui/popover/index.js";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import IconX from "@tabler/icons-svelte/icons/x";
  import type {
    BackgroundType,
    BackgroundValue,
  } from "$lib/stores/editor.svelte";
  import {
    ColorPicker,
    GradientColorPicker,
  } from "$lib/components/ui/color-picker/index.js";
  import { onMount } from "svelte";

  interface BackgroundControlProps {
    type: BackgroundType;
    value: BackgroundValue;
    onChange: (value: { type: BackgroundType; value: BackgroundValue }) => void;
  }

  let { type, value }: BackgroundControlProps = $props();

  let isFirstRender = true;

  // Track local values for color pickers
  let solidColorValue = $state(type === "solid" ? value : "#000000");
  let gradientColorValue = $state(
    type === "gradient"
      ? value
      : "linear-gradient(-45deg, #4954de 0%, #49ddd8 100%)"
  );

  let activeTab = $state<"gradient" | "color" | "image">("gradient");

  const handleSolidColorChange = (color: string) => {
    solidColorValue = color;
  };

  const handleGradientColorChange = (color: string) => {
    gradientColorValue = color;
  };

  $effect(() => {
    if (isFirstRender) {
      if (type === "gradient") {
        activeTab = "gradient";
        gradientColorValue = value;
      } else if (type === "solid") {
        activeTab = "color";
        solidColorValue = value;
      }
    }
  });

  $effect(() => {
    if (activeTab === "gradient") {
      type = "gradient";
      value = gradientColorValue;
    } else if (activeTab === "color") {
      type = "solid";
      value = solidColorValue;
    }
  });

  onMount(() => {
    isFirstRender = false;
  });
</script>

<Popover.Root>
  <Popover.Trigger class="w-full">
    <!-- If the type is solid or gradient, show a box with the color -->
    {#if type === "solid" || type === "gradient"}
      <div class="h-5 w-full rounded-md" style="background: {value};"></div>
    {/if}
  </Popover.Trigger>
  <Popover.Content side="right" sideOffset={12}>
    <!-- Title -->
    <div class="mb-4 flex items-center justify-between">
      <h3 class="text-sm font-semibold">Background</h3>
      <Popover.Close>
        <IconX size={18} />
      </Popover.Close>
    </div>

    <Tabs.Root bind:value={activeTab} class="w-full">
      <Tabs.List class="grid w-full grid-cols-3 gap-2">
        <Tabs.Trigger value="gradient">Gradient</Tabs.Trigger>
        <Tabs.Trigger value="color">Color</Tabs.Trigger>
        <Tabs.Trigger value="image">Image</Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>

    <div class="mt-4"></div>

    {#if activeTab === "gradient"}
      <GradientColorPicker
        {value}
        initialColor={gradientColorValue}
        onchange={handleGradientColorChange}
      />
    {/if}

    {#if activeTab === "color"}
      <ColorPicker
        {value}
        initialColor={solidColorValue}
        onchange={handleSolidColorChange}
      />
    {/if}
  </Popover.Content>
</Popover.Root>
