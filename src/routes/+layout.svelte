<script lang="ts">
import Header from "./Header.svelte";
import "../app.css";
import Canvas from "./Canvas.svelte";
let { children } = $props();

let image: undefined | HTMLImageElement = $state(undefined);
let pixels: Array<{ x: number; y: number; timestamp: number }> = $state([]);
</script>

<img
	src="/peach.webp"
	alt=""
	aria-hidden="true"
	onload={(e) => (image = e.target as HTMLImageElement)}
	style="display: none;"
/>

<div
	class="relative flex flex-col min-h-lvh font-mono p-5 max-w-xl lg:max-w-3xl"
>
	<Header class="realative z-10 pointer-events-auto" />
	<main
		class="relative z-10 mt-5 flex-1 flex flex-col pointer-events-none"
	>
		<div class="pointer-events-auto">
			{@render children()}
		</div>
	</main>
	<Canvas
		bind:pixels
		bind:image
		yOffset={/* hard coded for this image */ 68}
		class="absolute inset-0 h-screen w-screen pointer-events-auto"
	/>
</div>

{#if pixels.length}
	<button
		class="absolute z-10 right-5 bottom-5 cursor-pointer text-lg hover:underline"
		onclick={() => (pixels = [])}>clear</button
	>
{/if}
