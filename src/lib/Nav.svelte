<script>
	import { onMount } from 'svelte';
	let active;
	onMount(() => {
		active = window.location.pathname;
	});
</script>

<nav>
	<ul on:click={(e) => (active = e.target.pathname)}>
		<li><a class:active={active === '/'} href=".">home</a></li>
		<li><a class:active={active === '/about'} href="about">about</a></li>
		<li><a class:active={active === '/contact'} href="contact">contact</a></li>
		<li><a target="blank" rel="noreferrer" href="/resume.pdf">resume</a></li>
	</ul>
</nav>

<style>
	nav {
		font-weight: 400;
	}

	ul {
		display: flex;
		justify-content: space-between;
		list-style: none;
		padding: 0;
		margin: 1em 1em;
	}

	li {
		pointer-events: all;
	}

	.active {
		text-decoration: none;
	}

	@media (min-width: 500px) {
		ul {
			justify-content: flex-start;
			margin: 2em 2em;
		}
		li {
			width: 10em;
		}
	}
</style>
