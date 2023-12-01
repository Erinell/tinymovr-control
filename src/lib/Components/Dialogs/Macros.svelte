<script lang="ts">
    import { FileTerminal, Pencil, Plus, Trash } from "lucide-svelte";
    import { Dialog, Button, Table, Input } from "$lib";
    import Editor from "./Editor.svelte";
    export let open = false;
    import { _ } from "svelte-i18n";
    import type { Macro } from "$lib/interfaces";
    import ConfirmAction from "./ConfirmAction.svelte";
    import { macros } from "$lib/store";

    export let onClose = () => {
        open = false;
    };

    $: new_name = "";
    let selected_macro: Macro;

    let confirm_delete = false;
    let editor = false;
    let name_error = false;

    function edit(name: string) {
        let macroIndex = $macros.findIndex((m: Macro) => m.name === name);
        if (macroIndex === -1) return;

        selected_macro = $macros[macroIndex];
        editor = true;
    }
</script>

<Dialog.Root {open} closeOnEscape={false} closeOnOutsideClick={false}>
    <Dialog.Portal>
        <Dialog.Content class="sm:max-w-[600px]">
            <Dialog.Header>
                <Dialog.Title class="flex items-center">
                    <FileTerminal class="w-6 mr-2" />{$_(
                        "macros",
                    )}</Dialog.Title
                >
            </Dialog.Header>
            <div>
                <div class="flex gap-4 w-1/2 mb-2">
                    <Input
                        bind:value={new_name}
                        placeholder="name"
                        class={name_error ? " border-destructive" : " "}
                    />
                    <Button
                        type="submit"
                        class="gap-2"
                        on:click={() => (
                            (name_error = macros.add(new_name, "")),
                            (new_name = "")
                        )}
                    >
                        <Plus class="w-5 h-5" />
                        {$_("add")}
                    </Button>
                </div>

                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.Head class="w-1/3">{$_("title")}</Table.Head>
                            <Table.Head class="w-1/3">{$_("size")}</Table.Head>
                            <Table.Head class="w-1/3"></Table.Head>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {#each $macros as macro}
                            <Table.Row>
                                <Table.Cell class="font-medium p-2 text-lg">
                                    {macro.name}
                                </Table.Cell>
                                <Table.Cell class="p-2">
                                    {new TextEncoder().encode(macro.code)
                                        .length + " bytes"}
                                </Table.Cell>
                                <Table.Cell class="p-2">
                                    <Button
                                        variant="outline"
                                        class="gap-2 mr-2"
                                        on:click={() => edit(macro.name)}
                                    >
                                        <Pencil class="w-4 h-4" />
                                        {$_("edit")}
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        on:click={() => {
                                            (selected_macro = macro),
                                                (confirm_delete = true);
                                        }}
                                    >
                                        <Trash class="w-4 h-4" />
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        {/each}
                    </Table.Body>
                </Table.Root>
            </div>
            <Dialog.Footer>
                <Button
                    variant="outline"
                    type="submit"
                    on:click={onClose}>{$_("cancel")}</Button
                >
                <Button type="submit" on:click={onClose}
                    >{$_("save")}</Button
                >
            </Dialog.Footer>
        </Dialog.Content>
    </Dialog.Portal>
</Dialog.Root>

<ConfirmAction
    open={confirm_delete}
    onClose={() => (confirm_delete = false)}
    onValid={() => (
        (confirm_delete = false), macros.remove(selected_macro.name)
    )}
>
    {$_("confirm-delete-macro")}
    <strong>"{selected_macro.name}"</strong>.
</ConfirmAction>

{#if editor}
    <Editor
        open={editor}
        onClose={() => (editor = false)}
        onSave={(name, code) => {
            macros.save(name, code);
            $macros = $macros;
        }}
        macro={selected_macro}
    />
{/if}
