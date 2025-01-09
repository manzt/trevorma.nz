<script lang="ts">
import Header from "./Header.svelte";
import Typewriter from "./Typewriter.svelte";
import "../app.css";

let { children } = $props();
</script>

<div class="flex flex-col min-h-lvh font-mono m-5">
	<Header />

	<main class="flex-1 flex flex-col p-1 w-full max-w-6xl box-border my-2">
		{@render children()}
	</main>

	<footer class="flex flex-col justify-center items-center p-2">
		<p>© 2025 trevor manz</p>
	</footer>
</div>

<style>
	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
