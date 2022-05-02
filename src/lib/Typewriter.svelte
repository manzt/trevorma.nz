<script>
	/** @type {string} */
	export let text;
	export let cursor = true;
	export let speed = 30;

	/**
	 * @param {Node} node
	 * @param {{ speed: number }} options
	 *
	 * https://svelte.dev/docs#transition_fn
	 */
	function typewriter(node, { speed }) {
		const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;
		if (!valid) return {};
		const text = node.textContent;
		if (!text) return {};
		const duration = text.length * speed;
		return {
			duration,
			tick: (/** @type {number} */ t) => {
				const i = ~~(text.length * t);
				node.textContent = text.slice(0, i);
			}
		};
	}
</script>

<span in:typewriter={{ speed }}>{text}</span><span class="cursor">{cursor ? '|' : ''}</span>

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
