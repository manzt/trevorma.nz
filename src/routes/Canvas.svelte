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

let methods = {
	sine(i: number, t: number, phase: number) {
		return Math.sin(phase);
	},
	sawtooth(i: number, t: number, phase: number) {
		return (
			2 * (phase / (2 * Math.PI) - Math.floor(0.5 + phase / (2 * Math.PI)))
		);
	},
	jitter(i: number, t: number, phase: number) {
		return Math.sin(t * 10 + i * 1337) * Math.sin(t * 3 + i * 733);
	},
	fastJitter(i: number, t: number, phase: number) {
		return Math.sin(t * 40 + i * 5);
	},
} as const;

onMount(() => {
	let params = new URLSearchParams(location.search);
	let delay = params.has("delay") ? Number(params.get("delay")) : 5000;
	let waveFn =
		methods[(params.get("wave") ?? "sine") as keyof typeof methods] ??
		methods.sine;

	let loop = (now: number) => {
		let pixelDelayMs = 100;
		let fadeDurationMs = 700;

		tpixels = pixels.map(({ x, y, timestamp }, i) => {
			let firstTimestamp = pixels[0].timestamp;
			let globalStart = firstTimestamp + delay;
			let pixelStart = timestamp + pixelDelayMs;
			let animStart = Math.max(globalStart, pixelStart);

			if (now < animStart) return { x, y };

			let fade = Math.min(1, (now - animStart) / fadeDurationMs);
			let t = (now - animStart) / 1000;
			let phase = i * 0.5 + t * 2;

			let offset = waveFn(i, t, phase) * fade * 10;

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
