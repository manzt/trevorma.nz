<script lang="ts">
import * as utils from "$lib/utils.ts";
import type { PageData } from "./$types.ts";

let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>blog | trevor manz</title>
	<meta name="description" content="trevor's blog" />
</svelte:head>

<section class="not-prose">
	<h1 class="font-extrabold">writing...</h1>
	<ul class="divide-y divide-gray-200 dark:divide-slate-200/5">
		{#each data.posts as { slug, frontmatter }}
			<li class="py-6">
				<article
					class="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline"
				>
					<dl>
						<dt class="sr-only">Published on</dt>
						<dd
							class="text-base leading-6 font-medium text-gray-500 dark:text-gray-300"
						>
							<time datetime={frontmatter.date.toString()}
								>{utils.formatDate(frontmatter.date)}</time
							>
						</dd>
					</dl>
					<div class="space-y-5 xl:col-span-3">
						<div class="space-y-6">
							<h2 class="text-lg leading-8 font-bold">
								<a
									class="text-gray-900 dark:text-white hover:underline underline-offset-2"
									href={`/blog/${slug}`}
									>{frontmatter.title}</a
								>
							</h2>
							<div
								class="prose dark:prose-invert max-w-none text-gray-500 dark:text-gray-300"
							>
								<p>{frontmatter.excerpt}</p>
							</div>
						</div>
						<div class="text-base leading-6 font-medium">
							<a
								class="link"
								aria-label="read more"
								href={`/blog/${slug}`}>Read more →</a
							>
						</div>
					</div>
				</article>
			</li>
		{/each}
	</ul>
</section>
