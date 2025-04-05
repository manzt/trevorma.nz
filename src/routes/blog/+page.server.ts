import * as utils from "$lib/utils.ts";
import type { PageServerLoad } from "./$types.ts";

export const prerender = true;

export const load: PageServerLoad = () => ({
	posts: Object.entries(
		import.meta.glob("../../../posts/*.md", {
			as: "raw",
			eager: true,
		}),
	)
		.toSorted((a, b) => a[0].localeCompare(b[0]))
		.map(([name, contents]) => {
			let { frontmatter } = utils.parseMarkdownPost(contents);
			let slug = name
				.split("/")
				.at(-1)
				?.replace(/^\d{3}-|\.md$/g, "");
			return { slug, frontmatter };
		}),
});
