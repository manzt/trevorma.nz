<script lang="ts">
	import Typewriter from "../Typewriter.svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>blog</title>
	<meta name="description" content="trevor's blog" />
</svelte:head>

<h1 class="text-3xl font-semibold">
	<Typewriter text="blog" />trevor manz
</h1>

<section class="mt-5">
	<ul class="list-disc pl-5">
		{#each data.posts as { slug }}
			<li>
				<a href={`/blog/${slug}`} class="text-blue-500 hover:underline"
					>{slug}</a
				>
			</li>
		{/each}
	</ul>
</section>
