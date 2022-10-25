<script>
	import Typewriter from '$lib/Typewriter.svelte';
	let less = true;
</script>

<svelte:head>
	<title>trevor manz | about</title>
</svelte:head>
<h3><strong><Typewriter text={'about'} />trevor manz</strong></h3>
<p>
	I’m a student/programmer/Wisconsinite living in Boston, MA. Previously, I studied biochemistry
	among other things at <a href="https://www.kenyon.edu/" target="_blank" rel="noreferrer"
		>Kenyon College</a
	>. I moved to Boston to explore the intersection of biology, statistics, and computer science. I
	am fascinated
	{#if less}
		<span class="less">...</span>
		<button on:click={() => (less = !less)}>+ read more</button>
	{:else}
		<span class="more">
			by interactive visualization and leveraging web technologies to explore high-dimensional data.
			In a past life, I
			<a
				href="http://www.northcoast.org/awards/Hunsinger_Award_Releases/Manz-2017"
				target="_blank"
				rel="noreferrer"
			>
				swam competitively
			</a>
			.
			<br />
			<br />
			I currently work in the
			<a href="http://gehlenborglab.org/team/members/trevor-manz/" target="_blank" rel="noreferrer">
				Gehlenborg Lab
			</a>
			on
			<a href="https://github.com/hms-dbmi/viv" target="_blank" rel="noreferrer">Viv</a>
			and
			<a href="https://github.com/gosling-lang/gos" target="_blank" rel="noreferrer">Gos</a>
			.
		</span>
	{/if}
</p>

{#if !less}
	<h4>
		<strong>Things I like</strong>
	</h4>
	<ul>
		<li>sourdough | cats | live music</li>
		<li>python | typescript | rust | webassembly</li>
		<li>kitty | neovim | programming languages & type theory</li>
	</ul>

	<h4>
		<strong>Education</strong>
	</h4>
	<ul>
		<li>University of Cambridge, MPhil Computational Biology</li>
		<li>Kenyon College, BA Biochemistry</li>
	</ul>

	<h4>
		<strong>Honors & Awards</strong>
	</h4>
	<ul>
		<li>NSF Graduate Research Fellowship</li>
		<li>NCAA Postgraduate Scholarship</li>
		<li>Barry M. Goldwater Scholarship</li>
		<li>Google Cloud Academic All-American</li>
		<li>Marshall Scholarship Finalist</li>
	</ul>

	<button on:click={() => (less = !less)}>- close</button>
{/if}

<style>
	ul {
		list-style: none;
		margin: 0.5em;
	}

	li:before {
		content: '+';
		margin-right: 4px;
	}

	h4 {
		margin: 0;
	}

	a {
		pointer-events: auto;
	}

	button {
		font-family: inherit;
		font-size: inherit;
		text-decoration: underline;
		border: none;
		background: none;
		cursor: pointer;
		pointer-events: auto;
	}
</style>
