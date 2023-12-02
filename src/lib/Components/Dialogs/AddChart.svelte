<script lang="ts">
  import { Dialog, Label, Input, Button, Popover, Command } from "$lib";
  import { LineChart, ChevronsUpDown, Check } from "lucide-svelte";
  import { API, config } from "$lib/store";
  export let open = false;
  import { cn } from "$lib/utils";
  import { tick } from "svelte";
  import { _ } from "svelte-i18n";
  import { toastsStore } from "$lib/Components/ui/toast";

  export let onClose = () => {
    open = false;
  };

  let endpoints: Array<string> = [];
  let title = "";
  let endpoint = "";
  let interval = 1000;

  let endpoint_error = false;

  API.subscribe(() => {
    endpoints = API.toEndpoints();
  });

  let open_api = false;
  $: selectedValue = endpoint.length > 0 ? endpoint : $_("api-references");

  function closeAndFocusTrigger(triggerId: string) {
    open_api = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });
  }

  function onCancel() {
    onClose();
  }

  function onSave() {
    if (title.length === 0) title = endpoint;
    if (endpoint.length === 0)
      return (
        (endpoint_error = true), toastsStore.danger($_("api-required"))
      );
    endpoint_error = false;

    $config.charts = [
      ...$config.charts,
      { endpoint, title, position: config.sizeCharts() },
    ];

    onClose();
  }
</script>

<Dialog.Root {open} closeOnEscape={false} closeOnOutsideClick={false}>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title class="flex items-center">
        <LineChart class="w-6 mr-2" />{$_("add-chart")}</Dialog.Title
      >
    </Dialog.Header>
    <div class="grid gap-4 py-4">
      <div class="grid grid-cols-4 items-center gap-4">
        <Label>API</Label>

        <Popover.Root bind:open={open_api} let:ids>
          <Popover.Trigger asChild let:builder>
            <Button
              builders={[builder]}
              variant="outline"
              role="combobox"
              aria-expanded={open_api}
              class={`col-span-3 justify-between ${
                endpoint_error ? " border-destructive" : " "
              }`}
            >
              {selectedValue}
              <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </Popover.Trigger>
          <Popover.Content class="w-fit p-0 overflow-y-auto h-5/6">
            <Command.Root class="overflow-auto h-auto">
              <Command.Input placeholder={$_("search-endpoint")} />
              <Command.Empty>{$_("no-endpoints-found")}</Command.Empty>
              <Command.Group>
                {#each endpoints as _endpoint}
                  <Command.Item
                    value={_endpoint}
                    onSelect={(currentValue) => {
                      endpoint = currentValue;
                      closeAndFocusTrigger(ids.trigger);
                    }}
                  >
                    <Check
                      class={cn(
                        "mr-2 h-4 w-4",
                        endpoint !== _endpoint && "text-transparent",
                      )}
                    />
                    {_endpoint}
                  </Command.Item>
                {/each}
              </Command.Group>
            </Command.Root>
          </Popover.Content>
        </Popover.Root>
      </div>
      <div class="grid grid-cols-4 items-center gap-4">
        <Label>{$_("title")}</Label>
        <Input
          id="title"
          placeholder={endpoint}
          bind:value={title}
          class="col-span-3"
        />
      </div>
    </div>
    <Dialog.Footer>
      <Button type="submit" variant="outline" on:click={onCancel}
        >{$_("cancel")}</Button
      >
      <Button type="submit" on:click={onSave}>{$_("add")}</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
