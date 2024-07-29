<script>
	import Typewriter from '$lib/Typewriter.svelte';
	let showEmail = false;
</script>

<svelte:head>
	<title>trevor manz | contact</title>
</svelte:head>
<h3><strong><Typewriter text={'contact'} />trevor manz</strong></h3>
<ul>
	<li><button on:click={() => (showEmail = !showEmail)}>email</button></li>
	{#if showEmail}
		<span>trevor_manz[at]g[dot]harvard[dot]edu</span>
	{/if}
	<li>
		<a href="https://github.com/manzt" target="_blank" rel="noreferrer">github</a>
	</li>
	<li>
		<a href="https://twitter.com/trevmanz" target="_blank" rel="noreferrer">twitter</a>
	</li>
</ul>

<style>
	ul {
		list-style: none;
		margin: 0.5em;
	}

	li:before {
		content: '+';
		margin-right: 4px;
	}

	a {
		pointer-events: auto;
	}

	button {
		padding: 0;
		font-family: inherit;
		font-size: inherit;
		text-decoration: underline;
		border: none;
		background: none;
		cursor: pointer;
		pointer-events: auto;
	}

	span {
		pointer-events: auto;
	}
</style>
