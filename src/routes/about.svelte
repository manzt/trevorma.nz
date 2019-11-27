<svelte:head>
	<title>trevor manz | about</title>
</svelte:head>

<style>
	.toggle {
		cursor: pointer;
		padding-bottom: 2em;
	}

	.toggle span {
		text-decoration: underline;
	}

	ul {
   	 	list-style: none;
		margin: 0.5em;
	}

	li:before {
		content: "+";
		margin-right: 4px;
	}

	h4 {
		margin: 0;
	}
</style>

<script>
	import Typewriter from "../components/Typewriter.svelte";
	let less = true;
</script>

<h3><strong><Typewriter text={"about"}/>trevor manz<stong/></h3>

<p>
	I’m a student/programmer/Wisconsinite living in Boston, MA.
	I recently finished a Master's in computational biology in the United Kingdom, 
	and prior to that I studied biochemistry among other things at <a href='https://www.kenyon.edu/'>Kenyon College</a>. 
	I moved to Boston to explore the intersection of biology, statistics, and computer science. 
	I am fascinated 
	{#if less}
	<span class='less'>...</span>
	<span class='toggle' on:click={() => less = !less}>+ <span>read more</span></span>
	{:else}
	<span class='more'>
		 by interactive visualization and leveraging web technologies to explore high-dimensional data. In a past life, I swam competitively.
		<br/>
		<br/>
		I currently work in the <a href='http://gehlenborglab.org/'>Gehlenborg Lab</a>.
	</span>
	{/if}
</p>

{#if !less}
	<h4><strong>Things I like</strong></h4>
	<ul>
		<li>Python | JavaScript | R | Julia</li>
		<li>Svelte | React | Node.js | Flask</li>
		<li>D3.js | WebGL | Vega-Lite/Altair | ggplot</li>
		<li>iTerm | VSCode </li>
	</ul>

	<h4><strong>Education</strong></h4>
	<ul>
		<li>University of Cambridge, MPhil Computational Biology</li>
		<li>Kenyon College, BA Biochemistry</li>
	</ul>

	<h4><strong>Honors & Awards</strong></h4>
	<ul>
		<li>NSF Graduate Research Fellowship</li>
		<li>NCAA Postgraduate Scholarship</li>
		<li>Barry M. Goldwater Scholarship</li>
		<li>Google Cloud Academic All-American</li>
		<li>Marshall Scholarship Finalist</li>
	</ul>
	<span class='toggle' on:click={() =>less = !less}>- <span>close</span></span>
{/if}
