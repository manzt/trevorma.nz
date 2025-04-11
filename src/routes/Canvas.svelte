<script lang="ts">
import { onMount } from "svelte";

type Point = { x: number; y: number };

let canvas: HTMLCanvasElement;
let {
	class: klass,
	pixels = $bindable([]),
	image = $bindable(),
	yOffset = 0,
}: {
	class: string;
	image?: HTMLImageElement;
	pixels?: Array<Point & { timestamp: number }>;
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

let tpixels: Array<Point> = $state(pixels);

function resolveAnimation(): (i: number, t: number) => Point {
	let fn = globalThis.api.fn;
	if (fn === "sine") {
		return (i, t) => ({ x: 0, y: Math.sin(i * 0.5 + t * 2) * 10 });
	}
	if (fn === "sawtooth") {
		return (i, t) => {
			let phase = i * 0.5 + t * 2;
			return {
				x: 0,
				y:
					2 * (phase / (2 * Math.PI) - Math.floor(0.5 + phase / (2 * Math.PI))),
			};
		};
	}
	if (fn === "jitter") {
		return (i, t) => ({
			x: 0,
			y: Math.sin(t * 10 + i * 1337) * Math.sin(t * 3 + i * 733) * 10,
		});
	}
	if (fn === "fastJitter") {
		return (i, t) => ({ x: 0, y: Math.sin(t * 40 + i * 5) * 10 });
	}
	if (fn === "orbit") {
		return (i, t) => ({
			x: Math.cos(t + i * 0.2) * 5,
			y: Math.sin(t + i * 0.2) * 5,
		});
	}
	if (typeof fn === "string") {
		console.error(`Unknown animation function: "${fn}"`);
		globalThis.api.fn = "sine";
		return () => ({ x: 0, y: 0 });
	}
	return fn;
}

onMount(() => {
	console.log(
		`%c
╭─────────────────────────────────── hi! ────────────────────────────────────╮
│                                                                            │
│ You can control the pixel animation via:                                   │
│                                                                            │
│   api.delay = 0                                                            │
│   api.fn = "jitter";                                                       │
│   api.fn = (i, t) => ({ x: Math.sin(i * 0.5 + t * 2) * 10, y: 0 });        │
│                                                                            │
│ Built-in animations: "sine", "sawtooth", "jitter", "fastJitter", "orbit".  │
╰────────────────────────────────────────────────────────────────────────────╯
`,
		"font-family: monospace;",
	);

	// @ts-expect-error
	globalThis.api ??= {};
	globalThis.api.fn = "sine";
	globalThis.api.delay = 5000;

	let loop = (now: number) => {
		let pixelDelayMs = 100;
		let fadeDurationMs = 700;

		tpixels = pixels.map((pixel, i) => {
			let firstTimestamp = pixels[0].timestamp;
			let globalStart = firstTimestamp + globalThis.api.delay;
			let pixelStart = pixel.timestamp + pixelDelayMs;
			let animStart = Math.max(globalStart, pixelStart);

			if (now < animStart) {
				return { x: pixel.x, y: pixel.y };
			}

			let fade = Math.min(1, (now - animStart) / fadeDurationMs);
			let t = (now - animStart) / 1000;

			let fn = resolveAnimation();
			let { x, y } = fn(i, t);

			return {
				x: pixel.x + x * fade,
				y: pixel.y + y * fade,
			};
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
