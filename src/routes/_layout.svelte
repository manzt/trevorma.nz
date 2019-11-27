<script>
	import Nav from '../components/Nav.svelte';

	export let segment;
</script>

<style>
	main {
		position: relative;
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
	<slot></slot>
</main>