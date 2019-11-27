<script>
	import Nav from '../components/Nav.svelte';
	import BackgroundPaint from '../components/BackgroundPaint.svelte';
	export let segment;
</script>

<style>
	main {
		position: absolute;
		max-width: 40em;
		background-color: white;
		padding: 0 1em;
	}

	@media (min-width: 500px) {
		main {
			padding: 0 2em;
		}
	}
</style>

<Nav {segment}/>
<main>
	<BackgroundPaint/>
	<!-- <slot></slot> -->
</main>