<script lang="ts">
  import Button, { buttonVariants } from "../ui/button/button.svelte";
  import IconDice from "@tabler/icons-svelte/icons/dice";
  import IconCopy from "@tabler/icons-svelte/icons/copy";
  import IconEye from "@tabler/icons-svelte/icons/eye";
  import IconAdjustments from "@tabler/icons-svelte/icons/adjustments";
  import { randomize } from "$lib/stores/editor.svelte";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import ExportConfig from "$lib/components/export-config/ExportConfig.svelte";
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
    Randomize
  </Button>
  <Button variant="secondary">
    <IconCopy />
    Copy to clipboard
  </Button>
  <Button variant="secondary">
    <IconEye />
    Open
  </Button>
</div>
