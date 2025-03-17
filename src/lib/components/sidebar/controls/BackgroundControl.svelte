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
  import { Input } from "$lib/components/ui/input/index.js";

  export interface BackgroundControlProps {
    type: BackgroundType;
    value: BackgroundValue;
    onChange: (value: { type: BackgroundType; value: string }) => void;
  }

  let { type, value, onChange }: BackgroundControlProps = $props();

  let isFirstRender = true;

  // Local state for each background variant
  let solidColorValue = $state(type === "solid" ? value : "#000000");
  let gradientColorValue = $state(
    type === "gradient"
      ? value
      : "linear-gradient(-45deg, #4954de 0%, #49ddd8 100%)"
  );
  let imageValue = $state(type === "image" ? value : "");

  let activeTab = $state<"gradient" | "color" | "image">("gradient");

  const handleSolidColorChange = (color: string) => {
    solidColorValue = color;
  };

  const handleGradientColorChange = (color: string) => {
    gradientColorValue = color;
  };

  const handleImageChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        imageValue = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    imageValue = "";
    activeTab = "gradient";
  };

  $effect(() => {
    if (isFirstRender) {
      if (type === "gradient") {
        activeTab = "gradient";
        gradientColorValue = value;
      } else if (type === "solid") {
        activeTab = "color";
        solidColorValue = value;
      } else if (type === "image") {
        activeTab = "image";
        imageValue = value;
      }
    }
  });

  $effect(() => {
    if (activeTab === "gradient") {
      onChange({ type: "gradient", value: gradientColorValue });
    } else if (activeTab === "color") {
      onChange({ type: "solid", value: solidColorValue });
    } else if (activeTab === "image") {
      onChange({ type: "image", value: imageValue });
    }
  });

  onMount(() => {
    isFirstRender = false;
  });

  const solidColorPresets = [
    "#9B5DE5",
    "#F15BB5",
    "#FEE440",
    "#00BBF9",
    "#00F5D4",
    "#FF6B6B",
    "#F06595",
    "#7950F2",
    "#FCC419",
    "#82C91E",
    "#1ABC9C",
    "#E74C3C",
  ];

  const gradientColorPresets = [
    "linear-gradient(135deg, #9B5DE5 0%, #F15BB5 50%, #FEE440 100%)",
    "linear-gradient(160deg, #00BBF9 0%, #00F5D4 40%, #FF6B6B 100%)",
    "linear-gradient(45deg, #E0C3FC 0%, #8EC5FC 50%, #FBC2EB 100%)",
    "linear-gradient(120deg, #F53844 0%, #42378F 40%, #25aae1 100%)",
    "linear-gradient(135deg, #f6d365 0%, #fda085 50%, #f46b45 100%)",
    "linear-gradient(160deg, #667eea 0%, #764ba2 40%, #d9a7c7 100%)",
    "linear-gradient(210deg, #ff9966 0%, #ff5e62 40%, #ffc371 100%)",
    "linear-gradient(135deg, #FEE140 0%, #FA709A 50%, #ED213A 100%)",
    "linear-gradient(140deg, #3C8CE7 0%, #00EAFF 40%, #29ffc6 100%)",
    "linear-gradient(135deg, #11998e 0%, #38ef7d 50%, #43e97b 100%)",
    "linear-gradient(150deg, #1ABC9C 0%, #E74C3C 100%)",
    "linear-gradient(90deg, #FF8C00 0%, #FFD700 100%)",
  ];
</script>

<Popover.Root>
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
        showColorPreviewBox={false}
      />
      <div class="mt-2 grid grid-cols-6 gap-2">
        {#each gradientColorPresets as preset}
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
        {value}
        initialColor={solidColorValue}
        onchange={handleSolidColorChange}
        showColorPreviewBox={false}
      />
      <div class="mt-2 grid grid-cols-6 gap-2">
        {#each solidColorPresets as preset}
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
