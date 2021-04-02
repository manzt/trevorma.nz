<script>
	import Nav from '$lib/Nav.svelte';
	import Canvas from '$lib/Canvas.svelte';
	import '../app.css';

	let mainHeight;
	let innerWidth;
	let innerHeight;
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div>
	<div class="background">
		<Canvas
			height={Math.max(mainHeight + 30, innerHeight)}
			width={innerWidth}
			image={{
				src: '/lemon.webp',
				alt: 'Lemon sliced in half',
				scale: 0.8
			}}
		/>
	</div>
	<div class="foreground" bind:offsetHeight={mainHeight}>
		<Nav />
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

	@media (min-width: 500px) {
		main {
			padding: 0 2em;
		}
	}
</style>
