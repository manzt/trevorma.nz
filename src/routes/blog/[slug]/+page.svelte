<script lang="ts">
import Typewriter from "../../Typewriter.svelte";
import type { PageData } from "./$types";

let { data }: { data: PageData } = $props();
</script>

<article class="prose lg:prose-lg">
	{@html data.content}
</article>
