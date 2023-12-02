<script lang="ts">
    import { Home } from "lucide-svelte";
    import { Dialog, Button } from "$lib";
    export let open = false;
    import { _ } from "svelte-i18n";

    export let onClose = () => {
        open = false;
    };

    function onCancel() {
        onClose();
    }

    function onSave() {
        onClose();
    }
</script>

<Dialog.Root {open} closeOnEscape={false} closeOnOutsideClick={false}>
    <Dialog.Portal>
        <Dialog.Content class="sm:max-w-[600px]">
            <Dialog.Header>
                <Dialog.Title class="flex items-center">
                    <Home class="w-6 mr-2" />{$_("homing")}</Dialog.Title
                >
            </Dialog.Header>
            <div>
                Work in progress...
                <!-- max_homing_t, velocity, retract_dist, warnings,
                stall_detect.velocity, stall_detect.delta_pos, stall_detect.t,
                home()
                <Button>HOME</Button> -->
            </div>
            <Dialog.Footer>
                <Button variant="outline" type="submit" on:click={onCancel}
                    >{$_("cancel")}</Button
                >
                <Button type="submit" on:click={onSave}>{$_("save")}</Button>
            </Dialog.Footer>
        </Dialog.Content>
    </Dialog.Portal>
</Dialog.Root>
