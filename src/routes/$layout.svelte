<script>
	import Nav from '$lib/Nav.svelte';
	import BackgroundPaint from '$lib/BackgroundPaint.svelte';
	import '../app.css';

	export let segment;
	let mainHeight;
	let windowWidth;
	let windowHeight;
</script>

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight} />

<div>
	<div class="background">
		<BackgroundPaint
			height={Math.max(mainHeight + 30, windowHeight)}
			width={windowWidth}
			imgSrc={'/lemon.webp'}
			imgAlt={'Lemon sliced in half'}
			imgScale={0.7}
		/>
	</div>
	<div class="foreground" bind:offsetHeight={mainHeight}>
		<Nav {segment} />
		<main>
			<slot />
		</main>
	</div>
</div>

<style>
	main {
		position: relative;
		max-width: 40em;
		padding: 0 1em;
	}

	@media (min-width: 500px) {
		main {
			padding: 0 2em;
		}
	}

	.background {
		position: absolute;
		width: 100%;
		height: auto;
		z-index: 0;
	}

	.foreground {
		position: absolute;
		z-index: 1;
		pointer-events: none;
	}
</style>
