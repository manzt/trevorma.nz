<script lang="ts">
	import { page } from "$app/state";

	function ariaContent(route: string) {
		return page.url.pathname === route ? "page" : undefined;
	}
</script>

<header>
	<nav class="flex w-full sm:justify-start justify-center">
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
