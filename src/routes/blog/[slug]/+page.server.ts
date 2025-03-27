import * as path from "node:path";

import * as md from "@astrojs/markdown-remark";
import * as kit from "@sveltejs/kit";

import { loadPost } from "$lib/utils.ts";

import type { PageServerLoad } from "./$types.ts";

let processor = await md.createMarkdownProcessor({
	shikiConfig: {
		themes: {
			light: "github-light",
			dark: "github-dark",
		},
	},
});

export const load: PageServerLoad = async ({ params }) => {
	let entry = Object.entries(import.meta.glob("../../../../posts/*.md"))
		.map(([filepath, _]) => filepath)
		.find((filepath) => filepath.endsWith(`-${params.slug}.md`));

	if (entry) {
		let { frontmatter, body } = await loadPost(
			path.resolve(import.meta.dirname, entry),
		);
		let content = await processor.render(body);
		return {
			frontmatter: frontmatter,
			title: frontmatter.title,
			content: content.code,
			headings: content.metadata.headings,
		};
	}

	kit.error(404, "Not found");
};
