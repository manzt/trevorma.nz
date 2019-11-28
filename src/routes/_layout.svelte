<script>
	import Nav from '../components/Nav.svelte';
	import BackgroundPaint from '../components/BackgroundPaint.svelte';
	export let segment;
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
		height: 100%;
		z-index: 0;
	}

	.foreground {
		position: absolute;
		z-index: 100;
		pointer-events:none;
	}


</style>

<div>
	<div class='background'>
		<BackgroundPaint/>
	</div>
	<div class='foreground'>
		<Nav {segment}/>
		<main>
			<slot></slot>
		</main>
	</div>
</div>