<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    label: string;
    children?: Snippet<[]>;
  }

  let { label, children }: Props = $props();
</script>

<div class="grid grid-cols-[40%_60%] items-center gap-x-3">
  <div class="text-foreground-muted text-sm">
    {label}
  </div>
  <div>
    {@render children?.()}
  </div>
</div>
