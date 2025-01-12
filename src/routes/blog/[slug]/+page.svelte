<script lang="ts">
import type { PageData } from "./$types";

let { data }: { data: PageData } = $props();
</script>

<article class="prose lg:prose-lg">
	<h1>{data.title}</h1>

	{@html data.content}
</article>
