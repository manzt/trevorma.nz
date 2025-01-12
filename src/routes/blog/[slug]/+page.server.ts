import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

import * as fs from "node:fs/promises";
import * as path from "node:path";

import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import * as yaml from "@std/yaml";

let processor = await createMarkdownProcessor({
	shikiConfig: {
		theme: "one-light",
	},
});

function extractFrontmatter(text: string) {
	let match = text.match(/^---\n([\s\S]*?)\n---/);
	if (!match) {
		throw new Error("Frontmatter not found");
	}
	return {
		frontmatter: yaml.parse(match[1]),
		body: text.slice(match[0].length).trim(),
	};
}

export const load: PageLoad = async ({ params }) => {
	let entry = Object.entries(import.meta.glob("../../../../posts/*.md"))
		.map(([filepath, _]) => filepath)
		.find((filepath) => filepath.endsWith(`-${params.slug}.md`));

	if (entry) {
		let resolved = path.resolve(import.meta.dirname, entry);
		let text = await fs.readFile(resolved, { encoding: "utf-8" });
		let { body, frontmatter } = extractFrontmatter(text);
		let content = await processor.render(body);
		return {
			title: entry,
			content: content.code,
			headings: content.metadata.headings,
			frontmatter,
		};
	}

	error(404, "Not found");
};
