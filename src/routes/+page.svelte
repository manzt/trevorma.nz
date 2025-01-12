<script lang="ts">
	import Typewriter from "./Typewriter.svelte";
</script>

<svelte:head>
	<title>home</title>
	<meta
		name="description"
		content="Trevor Manz is a postdoctoral fellow at Harvard Medical School and creator of anywidget."
	/>
</svelte:head>

<h1 class="text-3xl font-semibold">
	<Typewriter text="whoami" />trevor manz
</h1>

<div class="text-lg mt-5 space-y-5">
	<p>
		i have a passion for designing software systems that empower humans to
		answer questions with data.
	</p>

	<p>
		current postdoc in the
		<a class="underline" target="_blank" href="https://hidivelab.org"
			>hidive lab</a
		>
		at harvard medical school.
	</p>

	<p>
		follow me on
		<a class="underline" target="_blank" href="https://github.com/manzt"
			>github</a
		>/<a
			class="underline"
			target="_blank"
			href="https://bsky.app/profile/manzt.sh">bluesky</a
		>/<a
			class="underline"
			target="_blank"
			href="https://twitter.com/trevmanz">twitter</a
		>.
	</p>
</div>
