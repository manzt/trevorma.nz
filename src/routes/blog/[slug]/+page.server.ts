import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

import * as fs from "node:fs/promises";
import * as path from "node:path";

import { createMarkdownProcessor } from "@astrojs/markdown-remark";

let processor = await createMarkdownProcessor({
	shikiConfig: {
		theme: "snazzy-light",
	},
	remarkPlugins: [],
});

export const load: PageLoad = async ({ params }) => {
	let filepath = Object.entries(import.meta.glob("../../../../posts/*.md"))
		.map(([filepath, _]) => filepath)
		.find((filepath) => filepath.endsWith(`-${params.slug}.md`));

	if (filepath) {
		let contents = await fs.readFile(
			path.resolve(import.meta.dirname, filepath),
			{ encoding: "utf-8" },
		);
		let { code, metadata } = await processor.render(contents);
		return {
			title: filepath,
			content: code,
			metadata,
		};
	}

	error(404, "Not found");
};
