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
  import { Input } from "$lib/components/ui/input/index.js";
  import {
    SOLID_COLOR_PRESETS,
    GRADIENT_COLOR_PRESETS,
  } from "$lib/config/colors";

  export interface BackgroundControlProps {
    type: BackgroundType;
    value: BackgroundValue;
    onChange: (value: { type: BackgroundType; value: string }) => void;
  }

  let { type, value, onChange }: BackgroundControlProps = $props();

  // Initialize state based on props
  let popoverOpen = $state(false);
  let solidColorValue = $state(type === "solid" ? value : "#000000");
  let gradientColorValue = $state(
    type === "gradient"
      ? value
      : "linear-gradient(-45deg, #4954de 0%, #49ddd8 100%)"
  );
  let imageValue = $state(type === "image" ? value : "");

  // Set active tab based on type
  let activeTab = $state<"gradient" | "color" | "image">(
    type === "solid" ? "color" : type === "image" ? "image" : "gradient"
  );

  // Watch for external prop changes
  $effect.root(() => {
    if (type === "solid") {
      solidColorValue = value;
    } else if (type === "gradient") {
      gradientColorValue = value;
    } else if (type === "image") {
      imageValue = value;
    }
  });

  // Handle solid color changes
  function handleSolidColorChange(color: string) {
    solidColorValue = color;
    if (activeTab === "color") {
      onChange({ type: "solid", value: color });
    }
  }

  // Handle gradient color changes
  function handleGradientColorChange(color: string) {
    gradientColorValue = color;
    if (activeTab === "gradient") {
      onChange({ type: "gradient", value: color });
    }
  }

  // Handle image upload
  function handleImageChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        imageValue = result;
        if (activeTab === "image") {
          onChange({ type: "image", value: result });
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // Handle image removal
  function removeImage() {
    imageValue = "";
    activeTab = "gradient";
    onChange({ type: "gradient", value: gradientColorValue });
  }

  // Handle tab changes
  function handleTabChange(newTab: "gradient" | "color" | "image") {
    activeTab = newTab;

    if (newTab === "gradient") {
      onChange({ type: "gradient", value: gradientColorValue });
    } else if (newTab === "color") {
      onChange({ type: "solid", value: solidColorValue });
    } else if (newTab === "image" && imageValue) {
      onChange({ type: "image", value: imageValue });
    } else if (newTab === "image" && !imageValue) {
      // Do nothing until an image is uploaded
    }
  }

  // When popover closes with image tab but no image
  function onPopoverClose() {
    if (!popoverOpen && activeTab === "image" && !imageValue) {
      activeTab = "gradient";
      onChange({ type: "gradient", value: gradientColorValue });
    }
  }

  $effect(() => {
    if (!popoverOpen) {
      onPopoverClose();
    }
  });
</script>

<Popover.Root bind:open={popoverOpen}>
  <Popover.Trigger class="w-full">
    {#if (type === "solid" || type === "gradient") && value}
      <div class="h-5 w-full rounded-md" style="background: {value};"></div>
    {/if}
    {#if type === "image" && imageValue}
      <div class="h-5 w-full overflow-hidden rounded-md">
        <img
          src={imageValue}
          alt="Background image"
          class="h-full w-full object-cover"
        />
      </div>
    {/if}
  </Popover.Trigger>
  <Popover.Content
    side="right"
    sideOffset={12}
    class="max-h-screen overflow-y-auto"
  >
    <div class="mb-4 flex items-center justify-between">
      <h3 class="text-sm font-semibold">Background</h3>
      <Popover.Close>
        <IconX size={18} />
      </Popover.Close>
    </div>
    <Tabs.Root value={activeTab} class="w-full">
      <Tabs.List class="grid w-full grid-cols-3 gap-2">
        <Tabs.Trigger
          value="gradient"
          onclick={() => handleTabChange("gradient")}>Gradient</Tabs.Trigger
        >
        <Tabs.Trigger value="color" onclick={() => handleTabChange("color")}
          >Color</Tabs.Trigger
        >
        <Tabs.Trigger value="image" onclick={() => handleTabChange("image")}
          >Image</Tabs.Trigger
        >
      </Tabs.List>
    </Tabs.Root>
    <div class="mt-4"></div>
    {#if activeTab === "gradient"}
      <GradientColorPicker
        value={gradientColorValue}
        initialColor={gradientColorValue}
        onchange={handleGradientColorChange}
        showColorPreviewBox={false}
      />
      <div class="mt-2 grid grid-cols-6 gap-2">
        {#each GRADIENT_COLOR_PRESETS as preset}
          <button
            aria-label="gradient-color-preset"
            type="button"
            onclick={() => handleGradientColorChange(preset)}
            class="aspect-square h-full rounded-full border border-gray-200 focus:outline-none"
            style="background: {preset};"
          ></button>
        {/each}
      </div>
    {:else if activeTab === "color"}
      <ColorPicker
        value={solidColorValue}
        initialColor={solidColorValue}
        onchange={handleSolidColorChange}
        showColorPreviewBox={false}
      />
      <div class="mt-2 grid grid-cols-6 gap-2">
        {#each SOLID_COLOR_PRESETS as preset}
          <button
            aria-label="solid-color-preset"
            type="button"
            onclick={() => handleSolidColorChange(preset)}
            class="aspect-square h-full rounded-full border border-gray-200 focus:outline-none"
            style="background: {preset};"
          ></button>
        {/each}
      </div>
    {:else if activeTab === "image"}
      <div class="flex flex-col gap-2">
        <Input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          onchange={handleImageChange}
          class="max-w-xs"
        />
        {#if imageValue}
          <img src={imageValue} alt="" class="max-w-xs rounded-md border" />
          <button
            type="button"
            onclick={removeImage}
            class="text-sm text-red-500"
          >
            Remove Image
          </button>
        {/if}
      </div>
    {/if}
  </Popover.Content>
</Popover.Root>
