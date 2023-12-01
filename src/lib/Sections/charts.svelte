<script lang="ts">
    import { Card, Separator } from "$lib/index";
    import Chart, { Type } from "$lib/Components/Tools/Chart.svelte";
    import { _ } from "svelte-i18n";
    import { device, config, API } from "$lib/store";

    $: charts = [...$config.charts];
</script>

<Card.Root class="w-full h-full overflow-auto ">
    {#if $config.showTitles}
        <Card.Header class="pb-0">
            <Card.Title>{$_("charts")}</Card.Title>
           
        </Card.Header>
    {/if}
    <Card.Content class="px-3 py-2">
        {#key charts}
            {#each charts as chart}
                <Chart
                    title={chart.title.length > 0
                        ? chart.title
                        : chart.endpoint}
                    y_point={$device?.data[chart.endpoint]}
                    unit={API.getUnit(chart.endpoint)}
                />
                <Separator class="border-2 my-2" />
            {/each}
        {/key}
    </Card.Content>
</Card.Root>
