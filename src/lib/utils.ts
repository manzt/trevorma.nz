import * as fs from "node:fs/promises";

import * as yaml from "@std/yaml";
import * as kit from "@sveltejs/kit";
import * as z from "zod";

let FrontmatterSchema = z.object({
	title: z.string(),
	date: z.date(),
	excerpt: z.string(),
});

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

function parsePost(text: string) {
	let match = text.match(/^---\n([\s\S]*?)\n---/);
	if (!match) {
		throw new Error("Frontmatter not found");
	}
	return FrontmatterSchema.transform((frontmatter) => ({
		frontmatter,
		body: text.slice(match[0].length).trim(),
	})).safeParse(yaml.parse(match[1]));
}

export async function loadPost(filepath: string) {
	let text = await fs.readFile(filepath, { encoding: "utf-8" });
	let result = parsePost(text);
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
	return result.data;
}

export function formatDate(d: Date): string {
	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}
