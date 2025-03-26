<script lang="ts">
import { assert } from "../lib/utils.js";

let { text } = $props();

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

let visible = $state(false);
$effect.pre(() => {
	text; // triggers effect any time it changes
	visible = false;
	setTimeout(() => {
		visible = true;
	}, 0);
});
</script>

{#if visible}
	<span in:typewriter={{ speed: 2 }}>{text}</span>
{/if}
<span class="animate-blink mr-1 -ml-0.2">|</span>

<style></style>
