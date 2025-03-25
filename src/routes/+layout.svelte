<script lang="ts">
import Header from "./Header.svelte";
import "../app.css";

let { children } = $props();
let year = new Date().getFullYear();
</script>

<div class="flex flex-col min-h-lvh font-mono p-5 max-w-xl lg:max-w-3xl">
	<Header />

	<main class="mt-5 flex-1 flex flex-col prose prose-blog text-lg">
		{@render children()}
	</main>
</div>
