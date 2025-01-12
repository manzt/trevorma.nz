<script lang="ts">
import Header from "./Header.svelte";
import "../app.css";

let { children } = $props();
let year = new Date().getFullYear();
</script>

<div class="flex flex-col min-h-lvh font-mono mx-5">
	<Header />

	<main
		class="flex-1 flex flex-col max-w-xl lg:max-w-2xl mt-3 md:mt-5 lg:mt-6 prose md:prose-lg lg:prose-xl"
	>
		{@render children()}
	</main>

	<footer class="flex flex-col justify-center items-center p-2 sm:py-3">
		<p>© {year} trevor manz</p>
	</footer>
</div>
