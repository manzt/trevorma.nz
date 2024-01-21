import adapter from "@sveltejs/adapter-auto";

/** @type {import('@sveltejs/kit').Config} */
let config = {
	kit: {
		adapter: adapter()
	}
};

export default config;
