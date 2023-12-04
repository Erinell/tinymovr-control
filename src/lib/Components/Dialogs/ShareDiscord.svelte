<script lang="ts">
  import { Dialog, Button, Label } from "$lib";
  import { Copy, Share2 } from "lucide-svelte";
  import { config, device } from "$lib/store";
  export let open = false;
  import { _ } from "svelte-i18n";
  import { toastsStore } from "$lib/Components/ui/toast";
  import Highlight from "svelte-highlight";
  import json from "svelte-highlight/languages/json";
  import "svelte-highlight/styles/vs2015.css";

  let code_config: any;
  let code_data: any;
  let opened = false;
  
  $:{
    if (open && !opened){
      opened = true;
      code_config = JSON.stringify($config, null, 2);
      code_data = JSON.stringify($device?.data, null, 2);
    } 
  }
  export let onClose = () => {};

  function toDiscord(code: string) {
    return "```json\n" + code + "\n```";
  }

  function copy(code: string) {
    navigator.clipboard.writeText(toDiscord(code)).then(
      function () {
        toastsStore.success($_("data-copied-discord"));
      },
      function (err) {
        toastsStore.success(`${$_("unable-copy-data")}. ${err}`);
      }
    );
  }
</script>

<Dialog.Root
  {open}
  onOpenChange={(e) => {
    onClose();
    opened = open = false;
  }}
>
  <Dialog.Content class="max-w-max h-3/4 flex flex-col gap-0">
    <Dialog.Header>
      <Dialog.Title class="flex items-center">
        <Share2 class="w-6 mr-2" />{$_("share") + " on Discord"}</Dialog.Title
      >
    </Dialog.Header>
    <div class="flex h-full gap-2">
      <div class="flex flex-col">
        <Label class="m-2 mx-auto text-md">Configuration</Label>
        <div class="relative table h-full">
          <div class=" h-full rounded-xl overflow-x-hidden hide-scrollbar">
            <Highlight language={json} code={toDiscord(code_config)} />
          </div>
          <Button
            size="icon"
            variant="outline"
            class="w-9 h-9 absolute right-2 top-2"
            on:click={() => copy(code_config)}><Copy class="w-6 h-6" /></Button
          >
        </div>
      </div>
      {#if code_data}
        <div class="flex flex-col">
          <Label class="m-2 mx-auto text-md">Data</Label>
          <div class="relative table h-full">
            <div class="h-full rounded-xl overflow-x-hidden hide-scrollbar">
              <Highlight language={json} code={toDiscord(code_data || "")} />
            </div>
            <Button
              size="icon"
              variant="outline"
              class="w-9 h-9 absolute right-2 top-2"
              on:click={() => copy(code_data ?? "")}
              ><Copy class="w-6 h-6" /></Button
            >
          </div>
        </div>
      {/if}
    </div>
  </Dialog.Content>
</Dialog.Root>
