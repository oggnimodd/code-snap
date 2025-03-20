<script lang="ts">
  import Button from "../ui/button/button.svelte";
  import IconDice from "@tabler/icons-svelte/icons/dice";
  import IconCopy from "@tabler/icons-svelte/icons/copy";
  import IconEye from "@tabler/icons-svelte/icons/eye";
  import { randomize } from "$lib/stores/editor.svelte";
</script>

<div class="flex items-center justify-between gap-x-2 rounded-lg">
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
