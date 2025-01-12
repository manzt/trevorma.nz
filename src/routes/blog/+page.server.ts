import type { PageLoad } from "./$types";

export const prerender = true;

export const load: PageLoad = () => {
	return {
		posts: Object.keys(import.meta.glob("../../../../posts/*.md"))
			.toSorted()
			.map((path) => ({ slug: path.split("/").at(-1) })),
	};
};
