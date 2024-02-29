<script lang="ts">
  import { Button, Card, Tabs } from "$lib/index";
  import { onDestroy, onMount } from "svelte";
  import {
    devices_store,
    device,
    API,
    config,
    editable_sections,
    remove_sections,
    macros,
    loop,
    ip_addresses,
    current_lang,
  } from "$lib/store";
  import Header, { websocket } from "./Header.svelte";
  import { _ } from "svelte-i18n";
  import Grid, { GridItem } from "svelte-grid-extended";
  import { applyTheme } from "$lib/DarkMode";
  import { formatAPI } from "$lib/utils";
  import { browser } from "$app/environment";
  import Charts from "$lib/Sections/charts.svelte";
  import Modes from "$lib/Sections/modes.svelte";
  import Infos from "$lib/Sections/infos.svelte";
  import Macros from "$lib/Sections/macros.svelte";
  import { Toast, toastsStore } from "$lib/Components/ui/toast";
  import "../app.postcss";
  import { X } from "lucide-svelte";
  import Console from "$lib/Components/Console/Console.svelte";

  let connected = false;
  let connecting = false;
  let sections: any = {
    charts: Charts,
    modes: Modes,
    infos: Infos,
    macros: Macros,
  };

  config.subscribe((config) => {
    if (!browser) return;
    localStorage.setItem("config", JSON.stringify(config));
  });

  macros.subscribe((v) => {
    if (!browser) return;
    localStorage.setItem("macros", JSON.stringify(v));
  });

  ip_addresses.subscribe((ip) => {
    if (!browser) return;
    localStorage.setItem("ip", JSON.stringify(ip));
  });

  current_lang.subscribe((lang) => {
    if(!browser) return;
    localStorage.setItem("lang", lang);
  })

  onMount(() => {
    applyTheme();

    websocket.onConnectHandler = () => {
      connected = true;
      connecting = false;
      websocket.send("definitions", null, (res: any) => {
        API.set(formatAPI(JSON.parse(res)["remote_attributes"]));
      });

      websocket.send("devices", null, (names: Array<string>) => {
        names.forEach((name: string) => {
          devices_store.add(name, websocket);

          selectDevice(name);
        });
      });
    };

    websocket.onCloseHandler = () => {
      close();
      connecting = false;
      connected = false;
    };

    websocket.onErrorHandler = () => {
      if (connecting) {
        toastsStore.error(
          $_("connection-unable") + ` ${websocket.url}:${websocket.port}`,
          2000,
        );
      }
      connecting = false;
    };

    websocket.onUpdateHandler = (data) => {
      if (data === "DEVICE_NOT_FOUND") {
        if (devices_store.size() > 1 && $device) {
          devices_store.remove($device.id);
          selectDevice();
        } else {
          toastsStore.danger($_("no-devices-found"));
          close();
        }
      } else {
        if ($device) $device = $device;
      }
    };
  });

  function selectDevice(device_name?: string) {
    device.set(devices_store.select(device_name));
    if ($device) {
      $device.data = $device.fetchDataOnce($API);
    }
    loop.activeAll();
    loop.run(0, 1000);
    loop.run(1, 50);
  }

  onDestroy(() => {
    close();
  });

  function close() {
    loop.stopAll();

    connecting = false;
    connected = false;
    $editable_sections = false;

    devices_store.reset();
    device.set(null);
    websocket.close(1000);
  }
</script>

<Toast />
<Console />
<Header {close} bind:connecting bind:connected />

<div class="content">
  <div class="relative sidebar w-24">
    <Card.Root class="h-full pt-2 overflow-hidden rounded-none border-none">
      {#if $device && $devices_store.length > 0}
        <Tabs.Root value={$devices_store[0].id} class="w-full px-2">
          <Tabs.List class="flex flex-col w-full h-full mx-0">
            {#each $devices_store as device}
              <Tabs.Trigger
                value={device.id}
                class="w-full"
                on:click={(e) => {
                  selectDevice(e.detail.currentTarget.textContent);
                }}
              >
                {device.id}
              </Tabs.Trigger>
            {/each}
          </Tabs.List>
        </Tabs.Root>
      {/if}
      <div class="font-medium text-sm w-full text-center bottom-2 absolute">
        1.2.5
      </div>
    </Card.Root>
  </div>

  <div class="container overflow-auto flex flex-col !p-0">
    {#if $device && Object.keys($device.data).length > 0}
      <Grid
        cols={$config.size.cols}
        rows={$config.size.rows}
        readOnly={!$editable_sections}
        class={$editable_sections ? "grid-container" : ""}
      >
        {#each $config.sections as section}
          {#if section.active}
            <GridItem
              bind:x={section.x}
              bind:y={section.y}
              bind:w={section.w}
              bind:h={section.h}
              min={{ w: section.limit[0], h: section.limit[1] }}
              class={$editable_sections ? "grid-item" : ""}
              activeClass="grid-item-active"
              previewClass="bg-primary rounded-lg opacity-60"
              resizerClass={"grid-resizer"}
              resizable
              movable
            >
              {#if $remove_sections}
                <div class="absolute right-2 top-2 z-50">
                  <Button
                    size="icon"
                    variant="ghost"
                    class="w-8 h-8"
                    on:click={() => {
                      let sectionIndex = $config.sections.findIndex(
                        (n) => n.name === section.name,
                      );
                      $config.sections[sectionIndex].active = false;
                    }}
                  >
                    <X class="w-6 h-6 text-primary" />
                  </Button>
                </div>
              {/if}
              <svelte:component this={sections[section.name]} />
            </GridItem>
          {/if}
        {/each}
      </Grid>
    {/if}
  </div>
</div>

<style>
</style>
