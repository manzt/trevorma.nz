<script lang="ts">
	import Typewriter from "../Typewriter.svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
	let less = $state(true);
</script>

<svelte:head>
	<title>blog</title>
	<meta name="description" content="trevor's blog" />
</svelte:head>

<h1 class="text-3xl font-semibold">
	<Typewriter text="blog" />trevor manz
</h1>

<ul>
	{#each data.posts as post}
		<li>{post.slug}</li>
	{/each}
</ul>
