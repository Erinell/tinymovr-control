<script lang="ts">
    import { Button, Card } from "$lib/index";
    import { _ } from "svelte-i18n";
    import { config, macros } from "$lib/store";
    import { run } from "$lib/Macro/index";
    import type { Macro } from "$lib/interfaces";
    import { RotateCw, Play } from "lucide-svelte";
    import { console_visible } from "$lib/Components/Console";

    let running: string | null;

    async function execute(macro: Macro) {
        // console.log(code);
        $console_visible = true;
        running = macro.name;
        await run(macro.code);
        running = null;
    }
</script>

<Card.Root class="w-full h-full overflow-auto ">
    {#if $config.showTitles}
        <Card.Header class="pb-0">
            <Card.Title>{$_("macros")}</Card.Title>
        </Card.Header>
    {/if}
    <Card.Content class="px-3 py-2">
        <div class="grid gap-1.5 w-full grid-cols-2 mt-2">
            {#each $macros as macro}
                <Button
                    disabled={running != null}
                    on:click={() => execute(macro)}
                    class="justify-start"
                >
                    <div>
                        {#if running === macro.name}
                            <RotateCw class="w-5 h-5 mr-2 animate-spin" />
                        {:else}
                            <Play class="w-5 h-5 mr-2" />
                        {/if}
                    </div>
                    <div
                        class="overflow-hidden whitespace-nowrap text-ellipsis"
                    >
                        {macro.name}
                    </div>
                </Button>
            {/each}
        </div>
    </Card.Content>
</Card.Root>
