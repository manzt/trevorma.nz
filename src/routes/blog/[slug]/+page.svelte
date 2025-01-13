<script lang="ts">
import type { PageData } from "./$types";

let { data }: { data: PageData } = $props();
</script>

<section>
	<h1>{data.title}</h1>

	<article>
		{@html data.content}
	</article>
</section>
