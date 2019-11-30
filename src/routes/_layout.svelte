<script>
	import { onMount } from 'svelte';
	import Nav from '../components/Nav.svelte';
	import BackgroundPaint from '../components/BackgroundPaint.svelte';
	export let segment;
	let foreground;
	let h = 100;

	onMount(() => {
		new ResizeObserver(() => h = foreground.offsetHeight).observe(foreground)
	});
</script>

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
		pointer-events:none;
	}
</style>

<div>
	<div class='background'>
		<BackgroundPaint containerHeight={h}/>
	</div>
	<div class="foreground" bind:this={foreground}>
		<Nav {segment}/>
		<main>
			<slot></slot>
		</main>
	</div>
</div>