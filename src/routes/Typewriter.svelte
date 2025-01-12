<script lang="ts">
import { assert } from "$lib/utils.js";
import { onMount } from "svelte";

let { text } = $props();
let visible = $state(false);
let cursor = "|";
// let cursor = "█";

function typewriter(node: Node, { speed }: { speed: number }) {
	let valid =
		node.childNodes.length === 1 &&
		node.childNodes[0].nodeType === Node.TEXT_NODE;
	assert(
		valid,
		"typewriter transition only works with a single text node child",
	);
	let text = node.textContent ?? "";
	return {
		duration: text.length / (speed * 0.01),
		tick: (t: number) => {
			const i = Math.trunc(text.length * t);
			node.textContent = text.slice(0, i);
		},
	};
}

onMount(() => {
	setTimeout(() => {
		visible = true;
	});
});
</script>

<span class="mr-1">
	{#if visible}
		<span transition:typewriter={{ speed: 2 }}>{text}</span>
	{/if}
	<span class="cursor">{cursor}</span>
</span>

<style>
	.cursor {
		margin-left: -1rem;
		animation: blinker 1s infinite;
	}

	@keyframes blinker {
		50% {
			opacity: 0;
		}
	}
</style>
