<script lang="ts">
import * as utils from "$lib/utils.ts";
import type { PageData } from "./$types.ts";

let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>blog | trevor manz</title>
	<meta name="description" content="trevor's blog" />
</svelte:head>

<section>
	<ul class="divide-y divide-gray-200 dark:divide-gray-200/5">
		{#each [...data.posts, ...data.posts] as { slug, frontmatter }}
			<li class="py-6">
				<article
					class="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline"
				>
					<dl>
						<dt class="sr-only">Published on</dt>
						<dd class="text-sm text-gray-500 dark:text-gray-300">
							<time datetime={frontmatter.date.toString()}
								>{utils.formatDate(frontmatter.date)}</time
							>
						</dd>
					</dl>
					<div class="space-y-2 xl:col-span-3">
						<div class="space-y-2">
							<h2 class="text-lg leading-8 font-bold">
								<a
									class="text-gray-900 dark:text-white hover:underline underline-offset-2"
									href={`/blog/${slug}`}
									>{frontmatter.title}</a
								>
							</h2>
							<div
								class="max-w-none text-gray-500 dark:text-gray-300"
							>
								<p>{frontmatter.excerpt}</p>
							</div>
						</div>
					</div>
				</article>
			</li>
		{/each}
	</ul>
</section>
