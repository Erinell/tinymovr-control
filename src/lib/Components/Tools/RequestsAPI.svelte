<script lang="ts">
  import { ChevronsUpDown, Check } from "lucide-svelte";
  import { Button, Command, Popover } from "$lib/index";
  import { tick } from "svelte";
  import { cn } from "$lib/utils";
  import { API } from "$lib/store";
  import { _ } from "svelte-i18n";

  export let value = "";

  let open = false;
  $: selectedValue = value.length > 0 ? value : $_("api-references");

  function closeAndFocusTrigger(triggerId: string) {
    open = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });
  }
</script>

<Popover.Root bind:open let:ids>
  <Popover.Trigger asChild let:builder>
    <Button
      builders={[builder]}
      variant="outline"
      role="combobox"
      aria-expanded={open}
      class="min-w-[14rem] justify-between"
    >
      {selectedValue}
      <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-fit p-0 overflow-y-auto h-5/6">
    <Command.Root class="overflow-auto h-auto">
      <Command.Input placeholder={$_("search-endpoint")} />
      <Command.Empty>{$_("no-endpoints-found")}</Command.Empty>

      {#each $API as line}
        <Command.Group>
          {#if line.childs.length === 0}
            <Command.Item
              value={line.name}
              onSelect={(currentValue) => {
                value = currentValue;
                closeAndFocusTrigger(ids.trigger);
              }}
            >
              <Check
                class={cn(
                  "mr-2 h-4 w-4",
                  value !== line.name && "text-transparent"
                )}
              />

              {line.name}
            </Command.Item>
          {:else}
            <Command.List class="ml-2">{line.name}</Command.List>
          {/if}

          {#each line.childs as endpoint}
            <Command.Item
              value={line.name + "." + endpoint.name}
              onSelect={(currentValue) => {
                value = currentValue;
                closeAndFocusTrigger(ids.trigger);
              }}
            >
              <Check
                class={cn(
                  "mr-2 h-4 w-4",
                  value !== line.name + "." + endpoint.name &&
                    "text-transparent"
                )}
              />
              {line.name + "." + endpoint.name}
            </Command.Item>
          {/each}
        </Command.Group>
      {/each}
    </Command.Root>
  </Popover.Content>
</Popover.Root>
