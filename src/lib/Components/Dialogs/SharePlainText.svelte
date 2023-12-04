<script lang="ts">
  import { Dialog, Button } from "$lib";
  import { Copy, Share2 } from "lucide-svelte";
  import { config } from "$lib/store";
  export let open = false;
  import { _ } from "svelte-i18n";
  import { toastsStore } from "$lib/Components/ui/toast";
  import Highlight from "svelte-highlight";
  import json from "svelte-highlight/languages/json";
  import "svelte-highlight/styles/vs2015.css";

  let code: any;
  let opened = false;

  $:{
    if (open && !opened){
      opened = true;
      code = JSON.stringify($config, null, 2);
    } 
  }

  export let onClose = () => {};

  function copy() {
    navigator.clipboard.writeText(code).then(
      function () {
        toastsStore.success($_("config-copied"));
      },
      function (err) {
        toastsStore.success(`${$_("unable-copy-config")}. ${err}`);
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
  <Dialog.Content class="w-4/5 h-3/4 flex flex-col">
    <Dialog.Header>
      <Dialog.Title class="flex items-center">
        <Share2 class="w-6 mr-2" />{$_("share") +
          " " +
          $_("plain-text")}</Dialog.Title
      >
    </Dialog.Header>
    <div class="relative table h-full">
      <div
        class="h-full rounded-xl overflow-x-hidden overflow-y-auto hide-scrollbar"
      >
        <Highlight language={json} {code} />
      </div>
      <Button
        size="icon"
        variant="outline"
        class="w-9 h-9 absolute right-2 top-2"
        on:click={copy}><Copy class="w-6 h-6" /></Button
      >
    </div>
  </Dialog.Content>
</Dialog.Root>
