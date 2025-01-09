<script lang="ts">
	import { assert } from "$lib/utils.js";

	function typewriter(node: Node, { speed = 1 }: { speed?: number }) {
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

	let text = $state("");
	setTimeout(() => {
		text = "Hi my name is trevor and I like to party";
	}, 1000);
</script>

<p transition:typewriter>{text}</p>
