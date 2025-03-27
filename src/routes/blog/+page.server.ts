import * as path from "node:path";

import { loadPost } from "$lib/utils";

import type { PageLoad } from "./$types";

export const prerender = true;

export const load: PageLoad = async () => {
	let posts = await Promise.all(
		Object.keys(import.meta.glob("../../../posts/*.md"))
			.toSorted()
			.map(async (entry) => {
				let { frontmatter } = await loadPost(
					path.resolve(import.meta.dirname, entry),
				);
				let slug = entry
					.split("/")
					.at(-1)
					?.replace(/^\d{3}-|\.md$/g, "");

				return { slug, frontmatter };
			}),
	);

	return { posts };
};
