<script lang="ts">
import * as utils from "$lib/utils.ts";
import type { PageData } from "./$types.ts";

let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>blog | trevor manz</title>
	<meta name="description" content="trevor's blog" />
</svelte:head>

<section class="mx-1 text-gray-700 dark:text-gray-300">
	<ul class="space-y-4 divide-y divide-gray-200 dark:divide-gray-600">
		{#each data.posts as { slug, frontmatter }}
			<li class="pb-4">
				<article>
					<h2 class="text-xl font-bold">
						<a
							class="hover:underline underline-offset-2"
							href={`/blog/${slug}`}>{frontmatter.title}</a
						>
					</h2>
					<dl class="mt-1">
						<dt class="sr-only">Published on</dt>
						<dd class="text-sm text-gray-400 dark:text-gray-500">
							<time datetime={frontmatter.date.toString()}
								>{utils.formatDate(frontmatter.date)}</time
							>
						</dd>
					</dl>
					<p
						class="mt-6 prose max-w-none text-gray-500 dark:text-gray-400"
					>
						{frontmatter.excerpt}
					</p>
				</article>
			</li>
		{/each}
	</ul>
</section>
