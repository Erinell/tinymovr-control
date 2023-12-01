<script lang="ts">
  import { SendHorizontal } from "lucide-svelte";
  import {
    Card,
    Tabs,
    Switch,
    Label,
    Input,
    Button,
    Separator,
    Slider,
  } from "$lib/index";
  import { _ } from "svelte-i18n";
  import { device, config } from "$lib/store";

  $: position_mode = $device
    ? $device.data["controller.state"] === 2 &&
      $device.data["controller.mode"] === 2
    : false;
  $: velocity_mode = $device
    ? $device.data["controller.state"] === 2 &&
      $device.data["controller.mode"] === 1
    : false;
  $: current_mode = $device
    ? $device.data["controller.state"] === 2 &&
      $device.data["controller.mode"] === 0
    : false;

  let position_setpoint: number | null;
  let velocity_setpoint: number | null;
  let limit: number | null;
  let p_gain: number | null;
  let velocity_p_gain: number | null;
  let i_gain: number | null;
  let deadband: number | null;
  let increment: number | null;
</script>

<Card.Root class="w-full h-full overflow-hidden ">
  {#if $config.showTitles}
    <Card.Header class="pb-0">
      <Card.Title>Modes</Card.Title>
    </Card.Header>
  {/if}
  <Card.Content>
    <Tabs.Root value="position" class="w-full ">
      <Tabs.List class="grid w-full grid-cols-3">
        <Tabs.Trigger value="position">{$_("position")}</Tabs.Trigger>
        <Tabs.Trigger value="velocity">{$_("velocity")}</Tabs.Trigger>
        <Tabs.Trigger value="current">{$_("current")}</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="position">
        <Card.Root>
          <Card.Content>
            <div class="flex items-center space-x-3 justify-center">
              <Label for="position-mode">{$_("idle")}</Label>
              <Switch
                id="position-mode"
                onCheckedChange={(checked) => {
                  if (!$device) return;
                  if (!checked) return $device?.send("controller.idle");
                  $device?.send("controller.position_mode");
                  // position_mode = checked;
                }}
                checked={position_mode}
              />
              <Label for="position-mode">{$_("position")}</Label>
            </div>
            <Separator class="my-2" />

            <div class="flex">
              <form class="flex items-center space-x-2 flex-row">
                <Input
                  class="max-w-[8rem]"
                  placeholder="setpoint"
                  type="number"
                  bind:value={position_setpoint}
                />
                <Button
                  size="icon"
                  class="aspect-square"
                  on:click={() => {
                    $device?.send(
                      "controller.position.setpoint",
                      position_setpoint,
                    );
                    position_setpoint = null;
                  }}
                >
                  <SendHorizontal class="w-5 h-5" />
                </Button>
              </form>
              <h3 class="mx-4 w-16 text-primary">
                {parseInt($device?.data["controller.position.setpoint"] ?? "0")}
              </h3>
            </div>

            <div class="flex mt-2">
              <form class="flex items-center space-x-2 flex-row">
                <Input
                  class="max-w-[8rem]"
                  placeholder="p_gain"
                  type="number"
                  bind:value={p_gain}
                />
                <Button
                  size="icon"
                  class="aspect-square"
                  on:click={() => {
                    $device?.send("controller.position.p_gain", p_gain);
                    p_gain = null;
                  }}
                >
                  <SendHorizontal class="w-5 h-5" />
                </Button>
              </form>
              <h3 class="mx-4 min-w-[4rem] text-primary">
                {parseFloat($device?.data["controller.position.p_gain"] ?? "0")}
              </h3>
            </div>
          </Card.Content>
        </Card.Root>
      </Tabs.Content>
      <Tabs.Content value="velocity">
        <Card.Root>
          <Card.Content class="space-y-2">
            <div class="flex items-center space-x-3 justify-center">
              <Label for="airplane-mode">{$_("idle")}</Label>
              <Switch
                id="airplane-mode"
                onCheckedChange={(checked) => {
                  if (!$device) return;
                  if (!checked) return $device?.send("controller.idle");
                  $device?.send("controller.velocity_mode", null, () => {
                    velocity_mode = checked;
                  });
                }}
                checked={velocity_mode}
              />
              <Label for="airplane-mode">{$_("velocity")}</Label>
            </div>
            <Separator class="my-2" />

            <div class="flex" id="velocity_setpoint">
              <form class="flex items-center space-x-2 flex-row">
                <Input
                  class="max-w-[8rem]"
                  placeholder="setpoint"
                  type="number"
                  bind:value={velocity_setpoint}
                />
                <Button
                  size="icon"
                  class="aspect-square"
                  on:click={() => {
                    $device?.send(
                      "controller.velocity.setpoint",
                      velocity_setpoint,
                    );
                    velocity_setpoint = null;
                  }}
                >
                  <SendHorizontal class="w-5 h-5" />
                </Button>
              </form>
              <h3 class="mx-4 w-16 text-primary">
                {parseInt($device?.data["controller.velocity.setpoint"] ?? "0")}
              </h3>
            </div>

            <div class="flex mt-2" id="velocity_limit">
              <form class="flex items-center space-x-2 flex-row">
                <Input
                  class="max-w-[8rem]"
                  placeholder="limit"
                  type="number"
                  bind:value={limit}
                />
                <Button
                  size="icon"
                  class="aspect-square"
                  on:click={() => {
                    $device?.send("controller.velocity.limit", limit);
                    limit = null;
                  }}
                >
                  <SendHorizontal class="w-5 h-5" />
                </Button>
              </form>
              <h3 class="mx-4 min-w-[4rem] text-primary">
                {parseFloat($device?.data["controller.velocity.limit"] ?? "0")}
              </h3>
            </div>

            <!-- <div class="flex mt-2 w-3/4" id="velocity_limit">
              <form class="flex w-full items-center space-x-2 flex-row">
                <Slider value={[50]} max={$device?.data["controller.velocity.limit"]} step={100} class="max-w-[8rem]"/>
              </form>
              <h3 class="mx-4 min-w-[4rem] text-primary">
                {parseFloat($device?.data["controller.velocity.limit"] ?? "0")}
              </h3>
            </div> -->

            <div class="flex mt-2" id="velocity_p_gain">
              <form class="flex items-center space-x-2 flex-row" novalidate>
                <Input
                  class="max-w-[8rem]"
                  placeholder="p_gain"
                  type="number"
                  bind:value={velocity_p_gain}
                />
                <Button
                  size="icon"
                  class="aspect-square"
                  on:click={() => {
                    $device?.send(
                      "controller.velocity.p_gain",
                      velocity_p_gain,
                    );
                    velocity_p_gain = null;
                  }}
                >
                  <SendHorizontal class="w-5 h-5" />
                </Button>
              </form>
              <h3 class="mx-4 min-w-[4rem] text-primary">
                {parseFloat($device?.data["controller.velocity.p_gain"] ?? "0")}
              </h3>
            </div>

            <div class="flex mt-2" id="velocity_i_gain">
              <form class="flex items-center space-x-2 flex-row" novalidate>
                <Input
                  class="max-w-[8rem]"
                  placeholder="i_gain"
                  type="number"
                  bind:value={i_gain}
                />
                <Button
                  size="icon"
                  class="aspect-square"
                  on:click={() => {
                    $device?.send("controller.velocity.i_gain", i_gain);
                    i_gain = null;
                  }}
                >
                  <SendHorizontal class="w-5 h-5" />
                </Button>
              </form>
              <h3 class="mx-4 min-w-[4rem] text-primary">
                {parseFloat($device?.data["controller.velocity.i_gain"] ?? "0")}
              </h3>
            </div>

            <div class="flex mt-2" id="velocity_deadband">
              <form class="flex items-center space-x-2 flex-row" novalidate>
                <Input
                  class="max-w-[8rem]"
                  placeholder="deadband"
                  type="number"
                  bind:value={deadband}
                />
                <Button
                  size="icon"
                  class="aspect-square"
                  on:click={() => {
                    $device?.send("controller.velocity.deadband", deadband);
                    deadband = null;
                  }}
                >
                  <SendHorizontal class="w-5 h-5" />
                </Button>
              </form>
              <h3 class="mx-4 min-w-[4rem] text-primary">
                {parseFloat(
                  $device?.data["controller.velocity.deadband"] ?? "0",
                )}
              </h3>
            </div>

            <div class="flex mt-2" id="velocity_increment">
              <form class="flex items-center space-x-2 flex-row" novalidate>
                <Input
                  class="max-w-[8rem]"
                  placeholder="increment"
                  type="number"
                  bind:value={increment}
                />
                <Button
                  size="icon"
                  class="aspect-square"
                  on:click={() => {
                    $device?.send("controller.velocity.increment", increment);
                    increment = null;
                  }}
                >
                  <SendHorizontal class="w-5 h-5" />
                </Button>
              </form>
              <h3 class="mx-4 min-w-[4rem] text-primary">
                {parseFloat(
                  $device?.data["controller.velocity.increment"] ?? "0",
                )}
              </h3>
            </div>
          </Card.Content>
        </Card.Root>
      </Tabs.Content>
      <Tabs.Content value="current">
        <Card.Root>
          <Card.Content class="space-y-2">
            <div class="flex items-center space-x-3 justify-center">
              <Label for="airplane-mode">{$_("idle")}</Label>
              <Switch
                id="airplane-mode"
                onCheckedChange={(checked) => {
                  if (!$device) return;
                  if (!checked) return $device?.send("controller.idle");
                  $device?.send("controller.current_mode", null, () => {
                    current_mode = checked;
                  });
                }}
                checked={current_mode}
              />
              <Label for="airplane-mode">{$_("current")}</Label>
            </div>
            <Separator class="my-2" />
            Iq_setpoint Id_setpoint Iq_limit bandwidth Iq_p_gain max_Ibus_regen max_Ibrake
            // infos Iq_estimate
          </Card.Content>
        </Card.Root>
      </Tabs.Content>
    </Tabs.Root>
  </Card.Content>
</Card.Root>
