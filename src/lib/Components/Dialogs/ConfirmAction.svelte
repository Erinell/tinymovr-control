<script lang="ts">
    import { AlertTriangle} from "lucide-svelte";
    import { Dialog, Button } from "$lib";
    export let open = false;
    import { _ } from "svelte-i18n";

    export let onClose = () => {open = false};
    export let onValid = () => {};
</script>

<Dialog.Root
    {open}
    onOpenChange={(e) => {
        onClose();
        open = false;
    }}
    closeOnEscape={false}
    closeOnOutsideClick={false}
>
    <Dialog.Portal>
        <Dialog.Content class="sm:max-w-[600px]">
            <Dialog.Header>
                <Dialog.Title class="flex items-center">
                    <AlertTriangle class="w-6 mr-2"/>{$_("confirm")} ?</Dialog.Title
                >
            </Dialog.Header>
            <div><slot /></div>
            <Dialog.Footer>
                <Button
                    type="submit"
                    variant="outline"
                    on:click={onClose}>{$_("cancel")}</Button
                >
                <Button type="submit" variant="destructive" on:click={onValid}
                    >{$_("confirm")}</Button
                >
            </Dialog.Footer>
        </Dialog.Content>
    </Dialog.Portal>
</Dialog.Root>
