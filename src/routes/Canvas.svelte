<script lang="ts">
import { onMount } from "svelte";

let canvas: HTMLCanvasElement;
let {
	class: klass,
	pixels = $bindable([]),
	image = $bindable(),
	yOffset = 0,
}: {
	class: string;
	image?: HTMLImageElement;
	pixels?: Array<{ x: number; y: number; timestamp: number }>;
	yOffset?: number;
} = $props();

let width = $state(0);
let height = $state(0);

function position(e: MouseEvent) {
	let rect = canvas.getBoundingClientRect();
	return {
		x: e.clientX - rect.left,
		y: e.clientY - rect.top,
		timestamp: performance.now(),
	};
}

// unselect any text if we are drawing
function unselect() {
	let selection = globalThis.getSelection();
	if (selection && !selection.isCollapsed) {
		selection.removeAllRanges();
	}
}

let tpixels: Array<{ x: number; y: number }> = $state(pixels);

onMount(() => {
	let loop = (now: number) => {
		let globalDelayMs = 5000;
		let pixelDelayMs = 300;
		let fadeDurationMs = 700;

		tpixels = pixels.map(({ x, y, timestamp }, i) => {
			let firstTimestamp = pixels[0].timestamp;
			let globalStart = firstTimestamp + globalDelayMs;
			let pixelStart = timestamp + pixelDelayMs;
			let animStart = Math.max(globalStart, pixelStart);

			if (now < animStart) {
				return { x, y };
			}

			let fade = Math.min(1, (now - animStart) / fadeDurationMs);
			let timeSinceAnim = (now - animStart) / 1000;

			let phase = i * 0.5 + timeSinceAnim * 2;
			let offset = Math.sin(phase) * fade * 10;

			return { x, y: y + offset };
		});

		requestAnimationFrame(loop);
	};

	requestAnimationFrame(loop);
});

$effect(() => {
	let ctx = canvas.getContext("2d");
	if (!ctx || !image) {
		return;
	}
	canvas.width = width;
	canvas.height = height;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#000";
	for (let { x, y } of tpixels) {
		ctx.drawImage(image, x - image.width, y - image.height + yOffset);
	}
});
</script>

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
