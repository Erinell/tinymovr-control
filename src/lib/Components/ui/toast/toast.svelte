<script context="module" lang="ts">
    export enum Type {
        INFO,
        SUCCESS,
        DANGER,
        ERROR,
    }
</script>

<script lang="ts">
    import { Card } from "$lib";
    import { Info } from "lucide-svelte";
    import { toastsStore, type IToast } from "./index";
    import { fly } from "svelte/transition";

    export const type: Type = Type.SUCCESS;
    let toasts: Array<IToast> = [];

    toastsStore.subscribe((state: any) => {
        toasts = state;
    });

    const titles = ["Info", "Success", "Warning", "Error"];

    let color = [
        "border-primary text-primary",
        "border-green-500 text-green-600 dark:border-green-700 dark:text-green-500",
        "border-amber-500 text-amber-600 dark:border-amber-700 dark:text-amber-600",
        "border-destructive text-destructive",
    ];
</script>

<div class={`toasts ${toasts.length === 0 ? "pointer-events-none" : ""}`}>
    {#each toasts as toast}
        <div transition:fly={{ y: -15 }} on:click={()=>toastsStore.remove(toast.id)}>
            <Card.Root class={`z-50 border-2 ${color[toast.type]}`} >
                <Card.Header>
                    <Card.Title class="flex items-center gap-3">
                        <Info />{titles[toast.type]}
                    </Card.Title>
                    <Card.Description
                        class={`${color[toast.type]} font-semibold`}
                    >
                        {@html toast.message.replaceAll(/(?:\r\n|\r|\n)/g, '<br>')}
                    </Card.Description>
                </Card.Header>
            </Card.Root>
        </div>
    {/each}
</div>

<style>
    .toasts {
        position: absolute;
        width: 24rem;
        height: 4rem;
        right: 0.75rem;
        top: 4rem;
        z-index: 99;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 0.5em;
    }
</style>
