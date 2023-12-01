<script lang="ts">
    import { AlertTriangle } from "lucide-svelte";
    import { Button, Dialog, Input, Label, Select } from "$lib";
    export let open = false;
    import { _ } from "svelte-i18n";
    import { config } from "$lib/store";
    import type { Section } from "$lib/interfaces";

    export let onClose = () => {open = false};

    let selected_section: Section | undefined;
    let selected_section_index: number;
    let w: number;
    let h: number;
    let x: number;
    let y: number;

    function onSelect(section: any) {
        selected_section_index = $config.sections.findIndex(
            (n) => n.name === section?.value,
        );
        selected_section = $config.sections.filter(
            (n) => n.name === section?.value,
        )[0];
        x = selected_section.x;
        y = selected_section.y;
        w = selected_section.w;
        h = selected_section.h;
    }

    function onCancel() {
        onClose();
    }

    function onSave() {
        if (!selected_section) return open = false;
        selected_section.active = true;
        $config.sections[selected_section_index] = selected_section;
        selected_section = undefined;
        onClose();
    }
</script>

<Dialog.Root
    {open}
    closeOnEscape={false}
    closeOnOutsideClick={false}
>
    <Dialog.Portal>
        <Dialog.Content class="sm:max-w-[600px]">
            <Dialog.Header>
                <Dialog.Title class="flex items-center">
                    <AlertTriangle class="w-6 mr-2" />{$_("add-section")} ?</Dialog.Title
                >
            </Dialog.Header>
            <div>
                {#if $config.sections.find((n) => n.active === false)}
                    <Select.Root
                        onSelectedChange={(section) => onSelect(section)}
                    >
                        <Select.Trigger class="w-[180px]">
                            <Select.Value placeholder="Select a section" />
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Group>
                                {#each $config.sections as section}
                                    {#if !section.active}
                                        <Select.Item
                                            value={section.name}
                                            label={section.name}
                                            inset>{section.name}</Select.Item
                                        >
                                    {/if}
                                {/each}
                            </Select.Group>
                        </Select.Content>
                        <Select.Input name="favoriteFruit" />
                    </Select.Root>
                {:else}
                    Toutes les sections sont déjà actives !
                {/if}
                {#if selected_section}
                    <div class="flex gap-2">
                        <div class="flex flex-col w-1/4 gap-1.5">
                            <Label for="x" class="text-md">X position</Label>
                            <Input
                                bind:value={selected_section.x}
                                type="number"
                                id="x"
                                placeholder="x position"
                                min={0}
                                max={$config.size.cols}
                            />
                        </div>

                        <div class="flex flex-col w-1/4 gap-1.5">
                            <Label for="y" class="text-md">Y position</Label>
                            <Input
                                bind:value={selected_section.y}
                                type="number"
                                id="y"
                                placeholder="y position"
                                min={0}
                                max={$config.size.rows}
                            />
                        </div>
                        <div class="flex flex-col w-1/4 gap-1.5">
                            <Label for="width" class="text-md">Width</Label>
                            <Input
                                bind:value={selected_section.w}
                                type="number"
                                id="width"
                                placeholder="width"
                                min={0}
                                max={$config.size.cols}
                            />
                        </div>
                        <div class="flex flex-col w-1/4 gap-1.5">
                            <Label for="height" class="text-md">Height</Label>
                            <Input
                                bind:value={selected_section.h}
                                type="number"
                                id="height"
                                placeholder="height"
                                min={0}
                                max={$config.size.rows}
                            />
                        </div>
                    </div>
                {/if}
            </div>
            <Dialog.Footer>
                <Button type="submit" variant="outline" on:click={onCancel}
                    >{$_("cancel")}</Button
                >
                <Button type="submit" on:click={onSave}>{$_("save")}</Button>
            </Dialog.Footer>
        </Dialog.Content>
    </Dialog.Portal>
</Dialog.Root>
