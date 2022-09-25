import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
let config = {
	kit: {
		adapter: adapter()
	}
};

export default config;
