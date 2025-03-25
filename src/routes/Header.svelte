<script lang="ts">
import { page } from "$app/state";
import Typewriter from "./Typewriter.svelte";

function ariaContent(route: string) {
	return page.url.pathname === route ? "page" : undefined;
}

function command() {
	return (
		{
			"/": "./whoami",
			"/about": "./about",
			"/blog": "./blog",
		}[page.url.pathname] ?? "./unknown"
	);
}
</script>

<header>
	<nav
		class="grid grid-cols-1 sm:grid-cols-2 items-center gap-y-4 sm:gap-y-0 sm:justify-between"
	>
		<ul
			class="order-1 sm:order-2 flex justify-center sm:justify-end space-x-8 text-xl"
		>
			<li aria-current={ariaContent("/")}>
				<a href="/">home</a>
			</li>
			<li aria-current={ariaContent("/about")}>
				<a href="/about">about</a>
			</li>
			<li aria-current={ariaContent("/blog")}>
				<a href="/blog">blog</a>
			</li>
		</ul>

		<div
			class="order-2 sm:order-1 flex justify-center sm:justify-start text-2xl font-mono font-semibold"
		>
			<Typewriter text={command()} />
			<span>trevor manz</span>
		</div>
	</nav>
</header>
