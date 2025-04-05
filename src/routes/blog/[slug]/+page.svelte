<script lang="ts">
import * as utils from "$lib/utils.ts";
import type { PageData } from "./$types.ts";
let { data }: { data: PageData } = $props();
let { title, frontmatter, content } = data;
</script>

<svelte:head>
	<title>blog | {title}</title>
	<meta name="description" content={frontmatter.description} />
</svelte:head>

<section class="prose mx-1">
	<div class="flex justify-between items-start w-full">
		<div>
			<h1 class="text-xl">{title}</h1>
			<time class="text-gray-400 dark:text-gray-500"
				>{utils.formatDate(frontmatter.date)}</time
			>
		</div>
		<a
			href="/blog"
			class="inline-block mb-4 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-200"
		>
			← back
		</a>
	</div>
	<article>
		{@html content}
	</article>
</section>
