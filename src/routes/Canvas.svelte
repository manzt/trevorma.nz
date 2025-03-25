<script lang="ts">
import { untrack } from "svelte";

let canvas: HTMLCanvasElement;
let props: { class: string } = $props();

let width = $state(0);
let height = $state(0);
let pixels: Array<{ x: number; y: number }> = $state([]);

function position(e: MouseEvent) {
	let rect = canvas.getBoundingClientRect();
	return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

// Draw the latest.
$effect(() => {
	let ctx = canvas.getContext("2d");
	let last = pixels.at(-1);
	if (!ctx || !last) {
		return;
	}
	ctx.fillRect(last.x, last.y, 5, 5);
});

// Redraw entire canvas with saved pixels when resized.
$effect(() => {
	let ctx = canvas.getContext("2d");
	if (!ctx) {
		return;
	}
	canvas.width = width;
	canvas.height = height;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#000";
	untrack(() => {
		for (let { x, y } of pixels) {
			ctx.fillRect(x, y, 2, 2);
		}
	});
});
</script>

<canvas
	class={props.class}
	bind:this={canvas}
	bind:clientWidth={width}
	bind:clientHeight={height}
	onmousemove={(e) => {
		let LEFT_BUTTON = 1;
		if (e.buttons === LEFT_BUTTON) {
			pixels.push(position(e));
		}
	}}
></canvas>
