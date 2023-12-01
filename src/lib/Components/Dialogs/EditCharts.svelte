<script lang="ts">
  import { Dialog, Table, Button, DropdownMenu, Card } from "$lib";
  import {
    LineChart,
    ChevronDown,
    ChevronUp,
    Trash,
    MoreHorizontal,
  } from "lucide-svelte";
  import { config } from "$lib/store";
  import { _ } from "svelte-i18n";
  import type { Chart } from "$lib/interfaces";

  export let onClose = () => {
    open = false;
  };
  export let open = false;

  $: charts = $config.charts;

  function move(endpoint: string, direction: number) {
    const targetIndex = charts.findIndex(
      (chart: Chart) => chart.endpoint === endpoint,
    );
    if (targetIndex === -1) return charts; // "Graphique introuvable";

    if (direction === 1 && targetIndex > 0) {
      charts[targetIndex].position--;
      charts[targetIndex - 1].position++;
    } else if (direction === -1 && targetIndex < charts.length - 1) {
      charts[targetIndex].position++;
      charts[targetIndex + 1].position--;
    }

    charts = charts.sort((a: Chart, b: Chart) => a.position - b.position);
  }

  function remove(endpoint: string) {
    charts = charts.filter((n: Chart) => n.endpoint !== endpoint);
  }

  function onCancel() {
    charts = $config.charts;
    onClose();
  }

  function onSave() {
    $config.charts = [...charts];
    onClose();
  }
</script>

<Dialog.Root {open} closeOnEscape={false} closeOnOutsideClick={false}>
  <Dialog.Portal>
    <Dialog.Content class="sm:max-w-[600px]">
      <Dialog.Header>
        <Dialog.Title class="flex items-center">
          <LineChart class="w-6 mr-2" />{$_("edit-charts")}</Dialog.Title
        >
      </Dialog.Header>
      <div>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head class="w-1/3">{$_("title")}</Table.Head>
              <Table.Head class="w-1/3">Endpoint</Table.Head>
              <Table.Head class="w-1/3" />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#each charts as chart}
              <Table.Row>
                <Table.Cell class="font-medium p-2">{chart.title}</Table.Cell>
                <Table.Cell class="p-2"
                  ><Card.Root class="px-2 py-1">{chart.endpoint}</Card.Root
                  ></Table.Cell
                >
                <Table.Cell
                  class="text-right p-2 flex  items-center gap-2 justify-end"
                >
                  <DropdownMenu.Root positioning={{ placement: "bottom-end" }}>
                    <DropdownMenu.Trigger asChild let:builder>
                      <Button
                        builders={[builder]}
                        variant="secondary"
                        size="sm"
                        aria-label="Open menu"
                      >
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content class="w-[200px]">
                      <DropdownMenu.Group>
                        <DropdownMenu.Label class="flex"
                          >Actions</DropdownMenu.Label
                        >
                        <DropdownMenu.Item
                          on:click={() => move(chart.endpoint, 1)}
                        >
                          <ChevronUp class="mr-2 h-4 w-4" />
                          {$_("move-up")}
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          on:click={() => move(chart.endpoint, -1)}
                        >
                          <ChevronDown class="mr-2 h-4 w-4" />
                          {$_("move-down")}
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator />
                        <DropdownMenu.Item
                          class="text-red-600"
                          on:click={() => remove(chart.endpoint)}
                        >
                          <Trash class="mr-2 h-4 w-4" />
                          {$_("remove")}
                        </DropdownMenu.Item>
                      </DropdownMenu.Group>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </Table.Cell>
              </Table.Row>
            {/each}
          </Table.Body>
        </Table.Root>
      </div>
      <Dialog.Footer>
        <Button type="submit" variant="outline" on:click={onCancel}
          >{$_("cancel")}</Button
        >
        <Button type="submit" on:click={onSave}>{$_("save")}</Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
