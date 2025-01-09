<script lang="ts">
import Header from "./Header.svelte";
import Typewriter from "./Typewriter.svelte";
import "../app.css";

let { children } = $props();
</script>

<div class="flex flex-col min-h-lvh font-mono mx-5">
	<Header />

	<main class="flex-1 flex flex-col p-1 w-full max-w-6xl box-border my-2">
		{@render children()}
	</main>

	<footer class="flex flex-col justify-center items-center p-2 sm:py-3">
		<p>© 2025 Trevor Manz</p>
	</footer>
</div>
