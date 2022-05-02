<script>
	import Nav from '$lib/Nav.svelte';
	import Canvas from '$lib/Canvas.svelte';
	import '../app.css';

	/** @type {number} */
	let innerWidth;

	/** @type {number} */
	let innerHeight;
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div>
	<div class="background">
		<Canvas
			height={innerHeight}
			width={innerWidth}
			image={{
				src: 'lemon.webp',
				alt: 'Lemon sliced in half',
				scale: 0.8
			}}
		/>
	</div>
	<div class="foreground">
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
	}

	.background {
		position: absolute;
		height: 100vh;
		z-index: 0;
		overflow: hidden;
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
