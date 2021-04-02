<script>
	export let text;
	export let hasCursor = true;
	export let speed = 30;

	// https://svelte.dev/docs#transition_fn
	function typewriter(node, { speed }) {
		const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === 3;

		if (!valid) return {};

		const text = node.textContent;
		const duration = text.length * speed;

		return {
			duration,
			tick: (t, u) => {
				const i = ~~(text.length * t);
				node.textContent = text.slice(0, i);
			}
		};
	}
</script>

<span in:typewriter={{ speed: speed }}>{text}</span><span class="cursor"
	>{hasCursor ? '|' : ''}</span
>

<style>
	.cursor {
		animation: blinker 1s infinite;
	}

	@keyframes blinker {
		50% {
			opacity: 0;
		}
	}
</style>
