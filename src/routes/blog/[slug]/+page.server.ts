import * as path from "node:path";
import * as app from "$app/environment";
import * as utils from "$lib/utils.ts";
import * as md from "@astrojs/markdown-remark";
import * as kit from "@sveltejs/kit";
import type { PageServerLoad, RouteParams } from "./$types.ts";

let processor = await md.createMarkdownProcessor({
	shikiConfig: {
		themes: {
			light: "github-light",
			dark: "github-dark",
		},
	},
});

export let prerender = true;

export function entries(): Array<RouteParams> {
	return Object.entries(
		import.meta.glob("../../../../posts/*.md", { as: "raw", eager: true }),
	)
		.map(([filepath, contents]) => {
			let slug = path.basename(filepath).match(/^\d+-(.+)\.md$/)?.[1];
			let { frontmatter } = utils.parseMarkdownPost(contents);
			utils.assert(slug, "Invalid slug.");
			return { slug, frontmatter };
		})
		.filter(({ frontmatter }) => app.dev || !frontmatter.draft);
}

export let load: PageServerLoad = async ({ params }) => {
	let posts = import.meta.glob("../../../../posts/*.md", { as: "raw" });
	let post = Object.entries(posts).find(([filepath, _]) =>
		filepath.endsWith(`-${params.slug}.md`),
	);

	if (!post) {
		kit.error(404, "Not found");
	}

	let { frontmatter, body } = utils.parseMarkdownPost(await post[1]());
	let content = await processor.render(body);
	return {
		frontmatter: frontmatter,
		title: frontmatter.title,
		content: content.code,
		headings: content.metadata.headings,
	};
};
