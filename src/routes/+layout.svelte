<script lang="ts">
import Header from "./Header.svelte";
import Typewriter from "./Typewriter.svelte";
import "../app.css";

let { children } = $props();
let year = new Date().getFullYear();
</script>

<div class="flex flex-col min-h-lvh font-mono mx-5">
	<Header />

	<main class="flex-1 flex flex-col p-1 w-full max-w-xl box-border my-2">
		{@render children()}
	</main>

	<footer class="flex flex-col justify-center items-center p-2 sm:py-3">
		<p>© {year} trevor manz</p>
	</footer>
</div>
