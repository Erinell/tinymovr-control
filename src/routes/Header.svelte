<script context="module">
  import { WebSocketManager } from "$lib/WebSocket";
  export let websocket = new WebSocketManager();
</script>

<script lang="ts">
  import {
    Sun,
    Moon,
    SendHorizontal,
    Loader2,
    ChevronRightSquare,
  } from "lucide-svelte";
  import { Button, Separator, Input, Switch, Label, Tooltip } from "$lib/index";
  import Menu from "$lib/Components/Tools/Menu.svelte";
  import { device, ip_addresses } from "$lib/store";
  import { toggleTheme, currentTheme } from "$lib/DarkMode";
  import RequestsApi from "$lib/Components/Tools/RequestsAPI.svelte";
  import { _ } from "svelte-i18n";
  import { toastsStore } from "$lib/Components/ui/toast";
  import { console_visible } from "$lib/Components/Console";
  import IpAddress from "$lib/Components/Tools/IPAddress.svelte";
  $: theme = currentTheme;
  let apiMode = true;
  let cmd = "";
  let value: number;
  let ip: string;

  export let connecting: boolean;
  export let connected: boolean;
  export let close = () => {};

  function toggleMode() {
    toggleTheme();
    theme = currentTheme;
  }
</script>

<header>
  <div class="flex justify-between">
    <div class="header_left">
      <a href="http://tinymovr.com" class="contents" target="_blank">
        <img
          class="rounded-full w-10 h-10 aspect-square mx-4 hover:scale-110 duration-150"
          src="https://avatars.githubusercontent.com/u/88620461?s=48&v=4"
          referrerpolicy="no-referrer"
          alt="brand-icon"
        />
      </a>
      <Menu />

      {#if connected}
        <Separator orientation="vertical" />
        <div class="flex items-center space-x-2">
          <Switch
            id="API"
            checked={apiMode}
            onCheckedChange={(checked) => (apiMode = checked)}
          />
          <Label for="API">API</Label>
        </div>

        {#if apiMode}
          <RequestsApi bind:value={cmd} />
        {:else}
          <Input
            placeholder={$_("request-placeholder")}
            bind:value={cmd}
            class="w-56 font-medium pb-2.5"
          />
        {/if}
        <form class="flex">
          <Input
            placeholder={$_("value")}
            type="text"
            bind:value
            class="w-32 font-medium pb-2.5 mr-4"
          />
          <Button
            type="submit"
            on:click={() => {
              $device?.send(cmd, value, (res) => {
                toastsStore.info(
                  `${value ? `${cmd} → ${value}` : `${cmd} : ${res}`}`,
                );
              });
            }}><SendHorizontal class="h-5 w-5 mr-2" />{$_("send")}</Button
          >
        </form>
      {/if}
    </div>

    <div class="header_right">
      {#if connected}
        <Button
          on:click={() => {
            close();
          }}
          variant="destructive">{$_("disconnect")}</Button
        >
      {:else}
        <Tooltip.Root>
          <Tooltip.Trigger asChild let:builder>
            <form class="flex w-full max-w-min items-center gap-2">
              <IpAddress bind:value={ip} />
              <Button
                builders={[builder]}
                on:click={() => {
                  if (
                    ip &&
                    !ip.match(
                      /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}|localhost$/,
                    )
                  )
                    return toastsStore.error("Invalid IP address");
                  connecting = true;
                  websocket.connect(ip).then(() => {
                    if (!$ip_addresses.includes(ip))
                      $ip_addresses = [ip, ...$ip_addresses];
                    if ($ip_addresses.length >= 10) $ip_addresses.pop();
                  });
                }}
                disabled={connecting}
                type="submit"
              >
                {#if connecting}
                  <Loader2 class="mr-2 h-6 w-6 animate-spin" />
                {/if}
                {$_("connection")}
              </Button>
            </form>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <p>
              Connect to the server <br />(default ip:
              <strong>localhost</strong>)
            </p>
          </Tooltip.Content>
        </Tooltip.Root>
      {/if}

      <Tooltip.Root>
        <Tooltip.Trigger asChild let:builder>
          <Button
            builders={[builder]}
            variant="outline"
            size="icon"
            on:click={() => ($console_visible = !$console_visible)}
          >
            <ChevronRightSquare />
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <p>Console</p>
        </Tooltip.Content>
      </Tooltip.Root>

      <Tooltip.Root>
        <Tooltip.Trigger asChild let:builder>
          <Button
            builders={[builder]}
            variant="outline"
            size="icon"
            on:click={toggleMode}
          >
            {#if $currentTheme === "light"}
              <Sun />
            {:else}
              <Moon />
            {/if}
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>
          {#if $currentTheme === "light"}
            <p>Light mode</p>
          {:else}
            <p>Dark mode</p>
          {/if}
        </Tooltip.Content>
      </Tooltip.Root>
    </div>
  </div>

  <Separator class="absolute bottom-0 left-0" />
</header>
