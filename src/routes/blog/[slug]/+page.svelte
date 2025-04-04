<script lang="ts">
import * as utils from "$lib/utils.ts";
import type { PageData } from "./$types.ts";

let { data }: { data: PageData } = $props();
let { title, frontmatter, content } = data;
</script>

<section>
	<h1 class="text-2xl">{title}</h1>
	<time class="text-gray-500">{utils.formatDate(frontmatter.date)}</time>
	<article>
		{@html content}
	</article>
</section>
