<script lang="ts">
import Header from "./Header.svelte";
import "../app.css";

let { children } = $props();
let year = new Date().getFullYear();
</script>

<div class="flex flex-col min-h-lvh font-mono p-5 max-w-xl lg:max-w-2xl">
	<Header />

	<main class="flex-1 flex flex-col prose md:prose-lg lg:prose-xl">
		{@render children()}
	</main>

	<footer class="flex flex-col justify-center items-start p-2 sm:py-3">
		<p>© {year} trevor manz</p>
	</footer>
</div>
