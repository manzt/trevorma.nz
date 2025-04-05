import * as yaml from "@std/yaml";
import * as kit from "@sveltejs/kit";
import * as z from "zod";

/**
 * Make an assertion.
 *
 * @param expr - The expression to test.
 * @param msg - The optional message to display if the assertion fails.
 * @throws an {@link Error} if `expression` is not truthy.
 */
export function assert(expr: unknown, msg?: string): asserts expr {
	if (!expr) {
		throw new Error(msg ?? "");
	}
}

export function formatDate(d: Date): string {
	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

let FrontmatterSchema = z.object({
	title: z.string(),
	date: z.date(),
	excerpt: z.string(),
	description: z.string(),
});

function extractRawContents(text: string) {
	let match = text.match(/^---\n([\s\S]*?)\n---/);
	if (!match) {
		throw new Error("Frontmatter not found");
	}
	return {
		frontmatter: yaml.parse(match[1]),
		body: text.slice(match[0].length).trim(),
	};
}

export function parseMarkdownPost(text: string) {
	let raw = extractRawContents(text);
	let result = FrontmatterSchema.safeParse(raw.frontmatter);
	if (!result.success) {
		kit.error(
			404,
			JSON.stringify(
				result.error.flatten((issue) => `[${issue.code}] ${issue.message}`)
					.fieldErrors,
				null,
				2,
			),
		);
	}
	return {
		frontmatter: result.data,
		body: raw.body,
	};
}
