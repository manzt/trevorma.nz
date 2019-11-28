<script>
	export let segment;
</script>

<style>
	nav {
		font-weight: 300;
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

	.selected {
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

<nav>
	<ul>
		<li><a class:selected='{segment === undefined}' href='.'>home</a></li>
		<li><a class:selected='{segment === "about"}' href='about'>about</a></li>

		<!-- for the blog link, we're using rel=prefetch so that Sapper prefetches
		     the blog data when we hover over the link or tap it on a touchscreen -->
		<!-- <li><a rel=prefetch class:selected='{segment === "blog"}' href='blog'>blog</a></li> -->
		<li><a class:selected='{segment === "contact"}' href='contact'>contact</a></li>
	</ul>
</nav>
