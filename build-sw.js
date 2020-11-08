const fs = require('fs');

const input = 'src/service-worker.js'
const output = 'build/service-worker.js'

const shell = fs.readdirSync('build')
	.filter(d => !(d.startsWith(".") || d === '_app')) // ignore dotfiles
	.map(d => "/" + d);

const files = fs.readdirSync('build/_app')
	.filter(d => !d.endsWith('.map'))
	.map(d => '/_app/' + d);

const imports = `
const timestamp = ${Date.now()};
const files = ${JSON.stringify(files)};
const shell = ${JSON.stringify(['/', ...shell])};
`;

fs.readFile(input, 'utf-8', (err, data) => {
	if (err) return console.log(err);
	// Remove `import { timestamp, files, shell } from 'service-worker'`
	// and replace with assests determined from build.
	const lines = data.split('\n').slice(1).join('\n');
	fs.writeFileSync(output, imports + lines);
});
