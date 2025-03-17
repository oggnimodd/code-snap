<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";

  import Button from "./button.svelte";
  import type { ButtonVariant } from "./button.svelte";

  const { Story } = defineMeta({
    component: Button,
  });

  const variants: ButtonVariant[] = [
    "default",
    "outline",
    "secondary",
    "ghost",
    "link",
    "destructive",
  ];
</script>

<Story name="Default">
  {#snippet children(args)}
    <!-- Loop the shit -->
    <div class="flex gap-2">
      {#each variants as variant}
        <Button {...args} {variant}>{variant}</Button>
      {/each}
    </div>
  {/snippet}
</Story>
