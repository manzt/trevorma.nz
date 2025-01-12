<script lang="ts">
import Typewriter from "../Typewriter.svelte";

let less = $state(true);
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<section>
	<h1 class="not-prose text-2xl font-semibold">
		<Typewriter text="about" />trevor manz
	</h1>

	<p>
		I'm a programmer/Wisconsinite living in Brooklyn, NY. I'm interested in
		how the software systems we build shape our understanding of the world.
	</p>

	<p>
		I created
		<a class="underline" target="_blank" href="https://anywidget.dev"
			>anywidget</a
		>
		and maintain and contribute to several
		<a class="underline" target="_blank" href="https://github.com/manzt"
			>open-source projects</a
		>. I’ve also
		<a
			class="underline"
			target="_blank"
			href="https://scholar.google.com/citations?user=Lo7nJd0AAAAJ&hl=en"
			>published research</a
		>
		in visualization and machine learning
		{#if less}
			<span>...</span>
		{:else}
			<span> with a focus on biological applications.</span>
		{/if}
	</p>

	{#if !less}
		<p>
			I currently work in the
			<a class="underline" target="_blank" href="https://hidivelab.org"
				>hidive lab</a
			>. In a past life, i
			<a
				class="underline"
				href="https://northcoast.org/sports/2022/4/20/awards-Hunsinger-Award-Releases-Manz-2017.aspx"
				target="_blank">swam competitively</a
			>.
		</p>

		<section>
			<heading>Education</heading>
			<ul class="list-disc ml-2">
				<li>Harvard University, PhD Biomedical Informatics</li>
				<li>University of Cambridge, MPhil Computational Biology</li>
				<li>Kenyon College, BA Biochemistry</li>
			</ul>
		</section>

		<section>
			<heading>Honors & Awards</heading>
			<ul class="list-disc">
				<li>NSF Graduate Research Fellowship</li>
				<li>NCAA Postgraduate Scholarship</li>
				<li>Barry M. Goldwater Scholarship</li>
				<li>Google Cloud Academic All-American</li>
				<li>Marshall Scholarship Finalist</li>
			</ul>
		</section>

		<section>
			<heading>Things I Like</heading>
			<ul class="list-disc">
				<li>sourdough | cats | programming languages & type systems</li>
				<li>python | typescript | rust | webassembly</li>
				<li>ghostty | tmux | neovim</li>
			</ul>
		</section>
	{/if}

	<div class="flex justify-end">
		<button class="underline" onclick={() => (less = !less)}>
			{less ? "+ read more" : "- close"}
		</button>
	</div>
</section>
