<script>
	import { page } from '$app/stores';
	import Canvas from '$lib/Canvas.svelte';
	import '../app.css';

	import { onMount } from 'svelte';

	/** @type {number} */
	let innerWidth;

	/** @type {number} */
	let innerHeight;

	/** @type {string} */
	let active;

	onMount(() => {
		active = window.location.pathname;
	});

	$: active = $page.url.pathname;
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<div>
	<div class="background">
		<Canvas
			height={innerHeight}
			width={innerWidth}
			image={{
				src: 'lemon.webp',
				alt: 'Lemon sliced in half',
				scale: 0.8
			}}
		/>
	</div>
	<div class="foreground">
		<nav>
			<ul>
				<li><a class:active={active === '/'} href=".">home</a></li>
				<li><a class:active={active === '/about'} href="about">about</a></li>
				<li><a class:active={active === '/contact'} href="contact">contact</a></li>
				<li><a target="blank" rel="noreferrer" href="/resume.pdf">resume</a></li>
			</ul>
		</nav>
		<main>
			<slot />
		</main>
	</div>
</div>

<style>
	main {
		position: relative;
		max-width: 40em;
	}

	.background {
		position: absolute;
		height: 100vh;
		z-index: 0;
		overflow: hidden;
	}

	.foreground {
		position: absolute;
		z-index: 1;
		pointer-events: none;
	}

	nav {
		font-weight: 400;
	}

	ul {
		display: flex;
		justify-content: space-between;
		list-style: none;
		padding: 0 5px 0 0;
	}

	li {
		pointer-events: all;
	}

	.active {
		text-decoration: none;
	}

	@media (min-width: 500px) {
		main {
			padding: 0 2em;
		}
	}

	@media (min-width: 500px) {
		ul {
			justify-content: flex-start;
			padding: 0 2em;
		}
		li {
			width: 10em;
		}
	}
</style>
