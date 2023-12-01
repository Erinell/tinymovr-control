<script lang="ts">
    import { Button, Card } from "$lib";
    import { ChevronRightSquare, X } from "lucide-svelte";
    import { afterUpdate } from "svelte";
    import { console_lines, console_visible } from ".";
    let element: any;

    $: innerWidth = 0;
    $: innerHeight = 0;

    let moving = false;
    $: left = innerWidth / 2;
    let top = 60;

    afterUpdate(() => {
        if ($console_lines && $console_visible) scrollToBottom(element);
    });

    $: if ($console_lines && element) {
        scrollToBottom(element);
    }

    const scrollToBottom = async (node: any) => {
        node.scroll({ top: node.scrollHeight, behavior: "smooth" });
    };

    function onMouseDown() {
        moving = true;
    }

    function onMouseMove(e: any) {
        if (moving) {
            left = left >= 0 ? left + e.movementX : 0;
            left = left > innerWidth ? innerWidth : left;
            top = top >= 0 ? top + e.movementY : 0;
            top = top > innerHeight - 0 ? innerHeight - 0 : top;
        }
    }

    function onMouseUp() {
        moving = false;
    }
</script>

<svelte:window
    bind:innerWidth
    bind:innerHeight
    on:mouseup={onMouseUp}
    on:mousemove={onMouseMove}
/>

{#if $console_visible}
    <Card.Root
        class={`w-5/6 md:w-3/4 lg:w-2/3 xl:w-1/2 2xl:w-1/3 absolute z-50 m-auto top-4 -translate-x-1/2`}
        style="left: {left}px; top: {top}px;"
    >
        <div on:mousedown={onMouseDown} tabindex="0" role="button">
            <Card.Header class="pb-0 cursor-move">
                <div class="absolute right-4">
                    <Button
                        size="icon"
                        variant="outline"
                        class="w-8 h-8"
                        on:click={() => ($console_visible = false)}
                    >
                        <X class="w-5" />
                    </Button>
                </div>
                <Card.Title class="flex items-center">
                    <ChevronRightSquare class="mr-2" /> Console
                </Card.Title>
            </Card.Header>
        </div>
        <Card.Content>
            <div class="h-56 overflow-auto bg-secondary" bind:this={element}>
                {#each $console_lines as line, i}
                    <pre
                        class="whitespace-normal border-t-[1px] py-1 px-2 bg-secondary border-background">
                        {line}
                    </pre>
                {/each}
            </div>
        </Card.Content>
    </Card.Root>
{/if}
