<script lang="ts">
  import { Select } from "$lib";
    import { ip_addresses } from "$lib/store";
  import Input from "../ui/input/input.svelte";
  export let value = "";

  $: filteredIP = $ip_addresses.filter((r) => r.includes(value));
</script>

<Select.Root
  onSelectedChange={(e) => {
    value = String(e?.value);
  }}
>
  <Select.Trigger class="w-[180px]" asChild let:builder cursor={false}>
    <div use:builder.action {...builder}>
      <Input class="w-36" bind:value placeholder="IP address"></Input>
    </div>
  </Select.Trigger>
  {#if filteredIP.length > 0}
    <Select.Content>
      {#each filteredIP as ip}
        <Select.Item value={ip}>{ip}</Select.Item>
      {/each}
    </Select.Content>
  {/if}
</Select.Root>
