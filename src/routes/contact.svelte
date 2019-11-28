<svelte:head>
	<title>trevor manz | contact</title>
</svelte:head>

<script>
    import Typewriter from "../components/Typewriter.svelte";
    let showEmail = false;
</script>

<style>
	ul {
   	 	list-style: none;
		margin: 0.5em;
	}

	li:before {
		content: "+";
		margin-right: 4px;
    }

    .email {
        text-decoration: underline;
        cursor: pointer;
        pointer-events: auto;
    }

    a {
        pointer-events: auto;
    }

</style>

<h3><strong><Typewriter text={"contact"}/>trevor manz</strong></h3>

<p>This page is a work in progress, but please feel free to reach out!</p>
<ul>
    <li on:click={() => showEmail = !showEmail}><span class="email">email</span></li>
    {#if showEmail}
        <span>trevor_manz[at]g[dot]harvard[dot]edu</span>
    {/if}
    <li><a href="https://github.com/manzt">github</a></li>
    <li><a href="https://twitter.com/trevmanz">twitter</a></li>
</ul>