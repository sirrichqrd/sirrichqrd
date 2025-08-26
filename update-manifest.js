const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
const version = Date.now(); // unique every build

html = html.replace(/manifest\.json(\?v=\d+)?/, `manifest.json?v=${version}`);
fs.writeFileSync('index.html', html, 'utf8');

console.log("✅ Manifest version updated:", version);
