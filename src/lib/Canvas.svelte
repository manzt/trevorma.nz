<script>
	export let width = 500;
	export let height = 500;
	export let image = {};

	let canvas;
	let img;

	let interacting = false;
	let cachedCoords = [];

	function onMouseEvent(e) {
		if (e.type === 'mousedown') interacting = true;
		if (e.type === 'mouseup') interacting = false;
		if (interacting) {
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
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	function drawCoord([x, y]) {
		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, x - img.width / 2, y - img.height / 2, img.width, img.height);
	}

	function drawAllCoords() {
		cachedCoords.forEach(drawCoord);
	}

	// https://github.com/observablehq/stdlib/blob/master/src/dom/context2d.js
	function context2d(w, h) {
		const dpi = window.devicePixelRatio;
		canvas.width = w * dpi;
		canvas.height = h * dpi;
		canvas.style.width = w + 'px';
		canvas.style.height = h + 'px';
		const ctx = canvas.getContext('2d');
		ctx.scale(dpi, dpi);
	}

	$: if (canvas) {
		// create new canvas if width or height changes
		context2d(width, height);
		// re-render all cached points
		drawAllCoords();
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
