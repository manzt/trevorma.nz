<script>
	/** @type {number} */
	export let width = 500;
	/** @type {number} */
	export let height = 500;

	/** @type {{ src: string, alt: string, scale: number }} */
	export let image;

	/** @type {HTMLCanvasElement} */
	let canvas;
	/** @type {HTMLImageElement} */
	let img;

	/** @type {boolean} */
	let interacting = false;

	/** @typedef {[x: number, y: number]} Coord */

	/** @type {Coord[]} */
	let cachedCoords = [];

	/** @param {MouseEvent} e */
	function onMouseEvent(e) {
		if (e.type === 'mousedown') interacting = true;
		if (e.type === 'mouseup') interacting = false;
		if (interacting) {
			/** @type {Coord} */
			const coord = [e.x, e.y + window.scrollY];
			// Keep track of x, y positions in case of resize event
			cachedCoords = [...cachedCoords, coord];
			// Add single layer to existing canvas
			drawCoord(coord);
		}
	}

	function reset() {
		cachedCoords = [];
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	/** @param {Coord} coord */
	function drawCoord([x, y]) {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.drawImage(img, x - img.width / 2, y - img.height / 2, img.width, img.height);
	}

	// https://github.com/observablehq/stdlib/blob/master/src/dom/context2d.js
	/** @param {{ width: number, height: number }} opts */
	function context2d({ width, height }) {
		const dpi = window.devicePixelRatio;
		canvas.width = width * dpi;
		canvas.height = height * dpi;
		canvas.style.width = width + 'px';
		canvas.style.height = height + 'px';
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.scale(dpi, dpi);
	}

	$: if (canvas) {
		// create new canvas if width or height changes
		context2d({ width, height });
		// re-render all cached points
		cachedCoords.forEach(drawCoord);
	}

	$: if (img) {
		img.width = img.width * image.scale;
		img.height = img.height * image.scale;
	}
</script>

<div>
	<img bind:this={img} src={image.src} alt={image.alt} />

	<canvas
		on:mousemove={onMouseEvent}
		on:mousedown={onMouseEvent}
		on:mouseup={onMouseEvent}
		bind:this={canvas}
	/>
</div>

{#if cachedCoords.length > 0}
	<button on:click={reset}>clear</button>
{/if}

<style>
	img {
		display: none;
	}

	button {
		font-family: inherit;
		position: fixed;
		bottom: 10px;
		right: 50px;
		font-size: 16px;
		text-decoration: underline;
		border: none;
		background: none;
		cursor: pointer;
	}

	button:hover {
		text-shadow: 2px 2px 4px #a9a9a9;
	}
</style>
