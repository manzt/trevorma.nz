import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params }) => {
	if (params.slug === "hello-world") {
		return {
			title: "Hello world!",
			content: "Welcome to our blog. Lorem ipsum dolor sit amet...",
			files: Object.keys(import.meta.glob("../../../../posts/*.md")),
		};
	}
	error(404, "Not found");
};
