<script lang="ts">
	import { Select as SelectPrimitive } from "bits-ui";
	import { ChevronDown } from "lucide-svelte";
	import { cn } from "$lib/utils";
	interface SelectTriggerProps extends SelectPrimitive.TriggerProps {
		cursor?: boolean;
	}

	type $$Props = SelectTriggerProps;
	type $$Events = SelectPrimitive.TriggerEvents;

	let className: SelectTriggerProps["class"] = undefined;
	export { className as class };
	export let cursor = true;
</script>

<SelectPrimitive.Trigger
	class={cn(
		"flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
		className,
	)}
	{...$$restProps}
	let:builder
	on:click
	on:keydown
>
	<slot {builder} />
	{#if cursor}
		<div>
			<ChevronDown class="h-4 w-4 opacity-50" />
		</div>
	{/if}
</SelectPrimitive.Trigger>
