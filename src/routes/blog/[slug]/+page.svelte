<script lang="ts">
import type { PageData } from "./$types";

let { data }: { data: PageData } = $props();
</script>

<h1>{data.title}</h1>

<div>{@html data.content}</div>

<pre>{JSON.stringify(data.files, null, 2)}</pre>
