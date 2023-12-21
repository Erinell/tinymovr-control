<script lang="ts">
  import {
    Waypoints,
    Info,
    Trash,
    MoreHorizontal,
    ChevronDown,
    ChevronUp,
  } from "lucide-svelte";
  import {
    Dialog,
    Button,
    Input,
    Label,
    Tabs,
    Tooltip,
    Table,
    DropdownMenu,
    Card,
    Switch,
  } from "$lib";
  import { _ } from "svelte-i18n";
  import { device, config } from "$lib/store";
  // import PreviewTraj from "./PreviewTraj.svelte";
  import { current_index, current_mode, actions, loop } from "./index";
  export let open = false;
  export let onClose = () => {};

  let max_acc: number;
  let max_dec: number;
  let max_vel: number;
  let t_accel: number;
  let t_decel: number;
  let t_total: number;
  let opened = false;
  let move_to: number;
  let delay: number = 5000;

  $: {
    if (open && !opened) {
      opened = true;
      max_acc = parseInt($device?.data["traj_planner.max_accel"]);
      max_dec = parseInt($device?.data["traj_planner.max_decel"]);
      max_vel = parseInt($device?.data["traj_planner.max_vel"]);
      t_accel = parseFloat($device?.data["traj_planner.t_accel"]);
      t_decel = parseFloat($device?.data["traj_planner.t_decel"]);
      t_total = parseFloat($device?.data["traj_planner.t_total"]);
    }
  }
  $: trajectories = $actions;

  function onCancel() {
    actions.set($config.traj_planner);
    onClose();
  }

  function onSave() {
    $config.traj_planner = trajectories;
    onClose();
  }
</script>

<Dialog.Root {open} closeOnEscape={false} closeOnOutsideClick={false}>
  <Dialog.Portal>
    <Dialog.Content class="sm:max-w-[850px]">
      <Dialog.Header>
        <Dialog.Title class="flex items-center">
          <Waypoints class="w-6 mr-2" />{$_("trajectory-planner")}</Dialog.Title
        >
      </Dialog.Header>
      <div>
        <Tabs.Root bind:value={$current_mode} class="w-full">
          <Tabs.List>
            <Tabs.Trigger value="velocity_limited"
              >Velocity limited</Tabs.Trigger
            >
            <Tabs.Trigger value="time_limited">Time limited</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="velocity_limited">
            <div class="flex gap-4">
              <div class="flex flex-col w-1/3 gap-1.5">
                <Label for="max_accel" class="text-md flex gap-1.5">
                  Max acceleration
                  <Tooltip.Root>
                    <Tooltip.Trigger><Info class="w-4 h-4" /></Tooltip.Trigger>
                    <Tooltip.Content>
                      <p>
                        The max allowed acceleration of the generated
                        trajectory. (tick / second)
                      </p>
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Label>
                <Input
                  bind:value={max_acc}
                  type="number"
                  id="max_accel"
                  placeholder="traj_planner.max_accel"
                />
              </div>
              <div class="flex flex-col w-1/3 gap-1.5">
                <Label for="max_decel" class="text-md flex gap-1.5">
                  Max deceleration
                  <Tooltip.Root>
                    <Tooltip.Trigger><Info class="w-4 h-4" /></Tooltip.Trigger>
                    <Tooltip.Content>
                      <p>
                        The max allowed deceleration of the generated
                        trajectory. (tick / second ** 2)
                      </p>
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Label>
                <Input
                  bind:value={max_dec}
                  type="number"
                  id="max_decel"
                  placeholder="traj_planner.max_decel"
                />
              </div>
              <div class="flex flex-col w-1/3 gap-1.5">
                <Label for="max_vel" class="text-md flex gap-1.5">
                  Max velocity
                  <Tooltip.Root>
                    <Tooltip.Trigger class=""
                      ><Info class="w-4 h-4" /></Tooltip.Trigger
                    >
                    <Tooltip.Content>
                      <p>
                        The max allowed cruise velocity of the generated
                        trajectory. (tick / second)
                      </p>
                    </Tooltip.Content>
                  </Tooltip.Root>
                </Label>
                <Input
                  bind:value={max_vel}
                  type="number"
                  id="max_vel"
                  placeholder="traj_planner.max_vel"
                />
              </div>
            </div>
          </Tabs.Content>
          <Tabs.Content value="time_limited">
            <div class="flex gap-4">
              <div class="flex flex-col w-1/3 gap-1.5">
                <Label for="t_accel" class="text-md"
                  >Time acceleration (s)</Label
                >
                <Input
                  bind:value={t_accel}
                  type="number"
                  id="t_accel"
                  placeholder="traj_planner.t_accel"
                />
              </div>
              <div class="flex flex-col w-1/3 gap-1.5">
                <Label for="max_accel" class="text-md">
                  Time deceleration (s)
                </Label>
                <Input
                  bind:value={t_decel}
                  type="number"
                  id="t_decel"
                  placeholder="traj_planner.t_decel"
                />
              </div>
              <div class="flex flex-col w-1/3 gap-1.5">
                <Label for="max_accel" class="text-md">Total time (s)</Label>
                <Input
                  bind:value={t_total}
                  type="number"
                  id="t_total"
                  placeholder="traj_planner.t_total"
                />
              </div>
            </div>
          </Tabs.Content>
        </Tabs.Root>

        <div class="flex items-end gap-4 pt-1.5">
          {#if $current_mode == "velocity_limited"}
            <div class="flex flex-col w-1/5 gap-1.5">
              <Label for="delay" class="text-md flex gap-1.5">
                Delay
                <Tooltip.Root>
                  <Tooltip.Trigger class=""
                    ><Info class="w-4 h-4" /></Tooltip.Trigger
                  >
                  <Tooltip.Content>
                    <p>Time before the next action. (ms)</p>
                  </Tooltip.Content>
                </Tooltip.Root>
              </Label>

              <Input
                bind:value={delay}
                type="number"
                id="delay"
                placeholder="delay"
              />
            </div>
          {/if}
          <div class="flex flex-col w-1/5 gap-1.5">
            <Label for="move_to" class="text-md flex gap-1.5">
              Move to
              <Tooltip.Root>
                <Tooltip.Trigger><Info class="w-4 h-4" /></Tooltip.Trigger>
                <Tooltip.Content>
                  <p>
                    Move at this position in {t_total} second(s)
                  </p>
                </Tooltip.Content>
              </Tooltip.Root>
            </Label>
            <Input
              type="number"
              id="move_to"
              placeholder="pos_setpoint"
              bind:value={move_to}
            />
          </div>
          <Button
            on:click={() =>
              actions.add({
                max_acc,
                max_dec,
                max_vel,
                t_accel,
                t_decel,
                t_total,
                move_to,
                delay,
              })}>Add</Button
          >
        </div>
        <Table.Root class="mt-2">
          <!-- <Table.Caption>Liste des graphiques.</Table.Caption> -->
          <Table.Header>
            <Table.Row>
              <Table.Head />
              <Table.Head class="w-1/5">Move to</Table.Head>
              <Table.Head class="w-1/5">Acceleration</Table.Head>
              <Table.Head class="w-1/5">Velocity / Time</Table.Head>
              <Table.Head class="w-1/5">Deceleration</Table.Head>
              <Table.Head class="w-1/5">Delay</Table.Head>
              <Table.Head class="w-1/5" />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#each trajectories as action, id}
              <Table.Row
                class={$current_index === id ? "dark:bg-green-900" : null}
              >
                <Table.Cell class="p-2">#{id + 1}</Table.Cell>
                <Table.Cell class="p-2"
                  ><Card.Root class="px-2 py-1 font-medium"
                    >{action.move_to}</Card.Root
                  ></Table.Cell
                >
                <Table.Cell class="p-2"
                  >{action.acc}
                  {action.mode === "time_limited"
                    ? "sec"
                    : "tick/s²"}</Table.Cell
                >
                <Table.Cell class="p-2"
                  >{action.vel}
                  {action.mode === "time_limited"
                    ? "sec"
                    : "tick/s"}</Table.Cell
                >
                <Table.Cell class="p-2"
                  >{action.acc}
                  {action.mode === "time_limited"
                    ? "sec"
                    : "tick/s²"}</Table.Cell
                >

                <Table.Cell class="p-2">{action.delay} ms</Table.Cell>

                <Table.Cell
                  class="text-right p-2 flex  items-center gap-2 justify-end"
                >
                  <DropdownMenu.Root positioning={{ placement: "bottom-end" }}>
                    <DropdownMenu.Trigger asChild let:builder>
                      <Button
                        builders={[builder]}
                        variant="ghost"
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
                          on:click={() => actions.move(action, 1)}
                        >
                          <ChevronUp class="mr-2 h-4 w-4" />
                          {$_("move-up")}
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          on:click={() => actions.move(action, -1)}
                        >
                          <ChevronDown class="mr-2 h-4 w-4" />
                          {$_("move-down")}
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator />

                        <DropdownMenu.Item
                          class="text-red-600"
                          on:click={() => actions.remove(action)}
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
        <div class="flex items-center space-x-2 w-full">
          <Switch id="loop" bind:checked={$loop} />
          <Label for="loop" class="text-md">Loop mode</Label>
        </div>

        <Button variant="outline" on:click={onCancel}>{$_("cancel")}</Button>
        <!-- <Button on:click={() => (preview_traj = true)}>preview</Button> -->
        <Button type="submit" on:click={() => actions.execute()}
          >{$_("execute")}</Button
        >
        <Button type="submit" on:click={onSave}>{$_("save")}</Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
<!-- <PreviewTraj open={preview_traj} onClose={() => (preview_traj = false)}
></PreviewTraj> -->
