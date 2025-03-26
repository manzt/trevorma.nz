<script lang="ts">
let canvas: HTMLCanvasElement;
let image: HTMLImageElement;
let yOffset = 68; // hard-coded for this peach image

let pixels: Array<{ x: number; y: number }> = $state([]);

let { class: klass }: { class: string } = $props();

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

$effect(() => {
	let ctx = canvas.getContext("2d");
	if (!ctx || !image) {
		return;
	}
	canvas.width = width;
	canvas.height = height;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#000";
	for (let { x, y } of pixels) {
		ctx.drawImage(image, x - image.width, y - image.height + yOffset);
	}
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
