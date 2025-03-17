- Do not try tro create these components from scratch, just import them from src/components/ui

For example if you want to use button you can do it like this

```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<Button href="/dashboard">Dashboard</Button>
```

Here are all the shadcn ui components that can be imported from src/components/ui accordion,calendar,dialog,menubar,select,table,alert,card,drawer,pagination,separator,tabs,alert-dialog,carousel,dropdown-menu,popover,sheet,textarea,aspect-ratio,checkbox,form,progress,sidebar,toggle,avatar,collapsible,hover-card,radio-group,skeleton,toggle-group,badge,command,input,range-calendar,slider,tooltip,breadcrumb,context-menu,input-otp,resizable,sonner,button,data-table,label,scroll-area,switch

- Do not add unncessary comments, in svelte html tag part you can add comments like this. Use `<!--COMMENT-->` syntax and not `{* comment *}` syntax, this is svelte

```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<!-- Correct way of doing comment -->
<Button href="/dashboard">Dashboard</Button>
```

- DO NOT BREAK EXISTING CODE, keep the previous code intact, ONLY CHANGE WHAT IS NECESSARY

- When importing icon from `@tabler/icons-svelte` use this syntax

```svelte
import IconCopy from "@tabler/icons-svelte/icons/copy";
```

INSTEAD OF THIS

```svelte
import {Copy} from "@tabler/icons-svelte";
```

This is for better tree-shaking

IN SVELTE 5 WHEN REFERENCING A STATE NO NEED TO USE `$` SIGN AS THE PREFIX

```svelte
const reactiveValue = $state("gemini");


// Instead of this
<Component state={$reactiveValue}>

just do
<Component state={reactiveValue}>

```

- FOr styling please read tailwind.config.js and src/app.css and match the color and styling to this config and variables
