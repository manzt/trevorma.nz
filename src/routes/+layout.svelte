<script lang="ts">
import Header from "./Header.svelte";
import "../app.css";
import Canvas from "./Canvas.svelte";
let { children } = $props();
</script>

<div
	class="relative flex flex-col min-h-lvh font-mono p-5 max-w-xl lg:max-w-3xl"
>
	<Header class="realative z-10 pointer-events-auto" />
	<main
		class="relative z-10 mt-5 flex-1 flex flex-col prose prose-blog text-lg pointer-events-none"
	>
		<div class="pointer-events-auto">
			{@render children()}
		</div>
	</main>
	<Canvas class="absolute inset-0 h-screen w-screen pointer-events-auto" />
</div>
