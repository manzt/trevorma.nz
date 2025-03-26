<script lang="ts">
import Typewriter from "./Typewriter.svelte";

let { url, class: klass }: { url: URL; class: string } = $props();

function ariaContent(route: string) {
	return url.pathname === route ? "page" : undefined;
}

function command() {
	return (
		{
			"/": "./whoami",
			"/about": "./about",
			// "/blog": "./blog",
		}[url.pathname] ?? "./unknown"
	);
}
</script>

<header class={klass}>
	<nav
		class="grid grid-cols-1 sm:grid-cols-2 items-center gap-y-4 sm:gap-y-0 sm:justify-between"
	>
		<ul
			class="order-1 sm:order-2 flex justify-center sm:justify-end space-x-8 text-xl"
		>
			<li aria-current={ariaContent("/")}>
				<a class="hover:underline underline-offset-2" href="/">home</a>
			</li>
			<li aria-current={ariaContent("/about")}>
				<a class="hover:underline underline-offset-2" href="/about">about</a>
			</li>
		</ul>

		<div
			class="order-2 sm:order-1 flex justify-center sm:justify-start text-xl font-mono font-semibold"
		>
			<Typewriter text={command()} />
			<span>trevor manz</span>
		</div>
	</nav>
</header>
