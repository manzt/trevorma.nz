<script lang="ts">
	import { untrack } from "svelte";

	let canvas: HTMLCanvasElement;
	let image: HTMLImageElement;
	let yOffset = 68; // hard-coded for this peach image

	let {
		class: klass,
		pixels = $bindable([]),
	}: {
		class: string;
		pixels?: Array<{ x: number; y: number }>;
	} = $props();

	let width = $state(0);
	let height = $state(0);

	function position(e: MouseEvent) {
		let rect = canvas.getBoundingClientRect();
		return { x: e.clientX - rect.left, y: e.clientY - rect.top };
	}

	// unselect any text if we are drawing
	function unselect() {
		let selection = globalThis.getSelection();
		if (selection && !selection.isCollapsed) {
			selection.removeAllRanges();
		}
	}

	// Draw the latest.
	$effect(() => {
		let ctx = canvas.getContext("2d");
		let last = pixels.at(-1);
		if (!ctx || !last || !image) {
			return;
		}
		ctx.drawImage(
			image,
			last.x - image.width,
			last.y - image.height + yOffset,
		);
	});

	$effect(() => {
		let ctx = canvas.getContext("2d");
		if (!ctx) {
			return;
		}
		if (pixels.length === 0) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}
	});

	// Redraw entire canvas with saved pixels when resized.
	$effect(() => {
		let ctx = canvas.getContext("2d");
		if (!ctx || !image) {
			return;
		}
		canvas.width = width;
		canvas.height = height;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "#000";
		untrack(() => {
			for (let { x, y } of pixels) {
				ctx.drawImage(
					image,
					x - image.width,
					y - image.height + yOffset,
				);
			}
		});
	});
</script>

<img
	src="/peach.webp"
	alt=""
	aria-hidden="true"
	bind:this={image}
	style="display: none;"
/>

<canvas
	class={klass}
	bind:this={canvas}
	bind:clientWidth={width}
	bind:clientHeight={height}
	onmouseup={unselect}
	onmousedown={(e) => {
		unselect();
		pixels.push(position(e));
	}}
	onmousemove={(e) => {
		// left clicking
		if (e.buttons === 1) {
			pixels.push(position(e));
		}
	}}
></canvas>

{#if pixels.length}
	<button
		class="fixed z-10 right-5 bottom-5 cursor-pointer text-lg hover:underline"
		onclick={() => (pixels = [])}>clear</button
	>
{/if}
