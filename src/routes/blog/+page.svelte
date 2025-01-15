<script lang="ts">
import Typewriter from "../Typewriter.svelte";
import type { PageData } from "./$types";

let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>blog | trevor manz</title>
	<meta name="description" content="trevor's blog" />
</svelte:head>

<section>
	<ul class="list-disc">
		{#each data.posts as { slug }}
			<li>
				<a href={`/blog/${slug}`}>{slug}</a>
			</li>
		{/each}
	</ul>
</section>
