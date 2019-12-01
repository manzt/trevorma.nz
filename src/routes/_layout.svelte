<script>
	import { onMount } from 'svelte';
	import Nav from '../components/Nav.svelte';
	import BackgroundPaint from '../components/BackgroundPaint.svelte';
	export let segment;
	let mainHeight;
	let windowWidth;
	let windowHeight;
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

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight}/>

<div>
	<div class='background'>
		<BackgroundPaint 
			height={Math.max(mainHeight + 30, windowHeight)}
			width={windowWidth}
			imgSrc={"/lemon.png"}
			imgAlt={"Lemon sliced in half"}
			imgScale={0.7}
		/>
	</div>
	<div class="foreground" bind:offsetHeight={mainHeight}>
		<Nav {segment}/>
		<main>
			<slot></slot>
		</main>
	</div>
</div>