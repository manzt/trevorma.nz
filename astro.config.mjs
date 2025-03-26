import { defineConfig } from "astro/config";

import svelte from "@astrojs/svelte";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	outDir: "build",
	integrations: [svelte()],
	vite: {
		plugins: [tailwindcss()],
	},
});
