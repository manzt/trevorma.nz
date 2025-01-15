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
	<nav class="flex w-full justify-between">
		<span class="text-2xl font-mono font-semibold">
			<Typewriter text={command()} />trevor manz
		</span>

		<ul class="flex space-x-10 text-xl">
			<li
				class:underline={page.url.pathname === "/"}
				aria-current={ariaContent("/")}
			>
				<a href="/">home</a>
			</li>
			<li
				class:underline={page.url.pathname === "/about"}
				aria-current={ariaContent("/about")}
			>
				<a href="/about">about</a>
			</li>
			<li
				class:underline={page.url.pathname === "/blog"}
				aria-current={ariaContent("/blog")}
			>
				<a href="/blog">blog</a>
			</li>
		</ul>
	</nav>
</header>
